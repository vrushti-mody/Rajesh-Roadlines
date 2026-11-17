"use client";
import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, OrbitControls, Text } from "@react-three/drei";
import type { Group } from "three";
import { pack, smallestTruck, type Item, type Placement, type Truck } from "@/lib/pack";

const COLORS = ["#f4b400", "#4f8fc7", "#e07a5f", "#7bc47f", "#b48ead", "#d8a657", "#5ec2c2"];
const S = 0.01; // cm -> scene units (1 unit = 1 m)

const START: Item[] = [
  { id: "a", name: "Paint drums 200 L", l: 60, w: 60, h: 90, kg: 230, qty: 12, stackable: false },
  { id: "b", name: "FMCG cartons", l: 60, w: 40, h: 40, kg: 15, qty: 80, stackable: true },
  { id: "c", name: "Pallet", l: 120, w: 100, h: 120, kg: 600, qty: 2, stackable: false },
];

function Box({ p, color, shownAt, progress }: { p: Placement; color: string; shownAt: number; progress: React.MutableRefObject<number> }) {
  const ref = useRef<Group>(null);
  const target: [number, number, number] = [(p.x + p.l / 2) * S, (p.y + p.h / 2) * S, (p.z + p.w / 2) * S];
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const k = Math.min(1, Math.max(0, progress.current - shownAt)); // 0 = not yet, 1 = in place
    g.visible = k > 0;
    g.position.set(target[0] + (1 - k) * 4, target[1], target[2]); // slide in from the rear door
  });
  return (
    <group ref={ref} position={target}>
      <mesh>
        <boxGeometry args={[p.l * S * 0.98, p.h * S * 0.98, p.w * S * 0.98]} />
        <meshStandardMaterial color={color} />
        <Edges color="#0d1b2a" />
      </mesh>
    </group>
  );
}

function TruckScene({ truck, placements, colorOf, progress }: { truck: Truck; placements: Placement[]; colorOf: (id: string) => string; progress: React.MutableRefObject<number> }) {
  const L = truck.l * S, W = truck.w * S, H = truck.h * S;
  return (
    <group position={[-L / 2, 0, -W / 2]}>
      {/* Floor and body outline */}
      <mesh position={[L / 2, -0.03, W / 2]}><boxGeometry args={[L, 0.06, W]} /><meshStandardMaterial color="#2b3f56" /></mesh>
      <mesh position={[L / 2, H / 2, W / 2]}><boxGeometry args={[L, H, W]} /><meshStandardMaterial color="#9fb3c8" transparent opacity={0.08} /><Edges color="#9fb3c8" /></mesh>
      {/* Side panel with the name, on the far wall */}
      <Text position={[L / 2, H * 0.6, -0.01]} fontSize={Math.min(0.9, H * 0.3)} color="#f4b400" anchorX="center" anchorY="middle">RRPL</Text>
      {/* Cab */}
      <mesh position={[-0.9, 1.0, W / 2]}><boxGeometry args={[1.6, 2.0, W * 0.95]} /><meshStandardMaterial color="#16263a" /></mesh>
      <mesh position={[-1.55, 1.35, W / 2]}><boxGeometry args={[0.32, 0.8, W * 0.8]} /><meshStandardMaterial color="#8fb3d9" /></mesh>
      {/* Wheels */}
      {[[-0.9, 0], [-0.9, W], [L * 0.75, 0], [L * 0.75, W], [L * 0.75 - 1.1, 0], [L * 0.75 - 1.1, W]].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.45, z]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.45, 0.45, 0.3, 24]} /><meshStandardMaterial color="#111" /></mesh>
      ))}
      {placements.map((p, i) => <Box key={`${p.itemId}-${p.index}`} p={p} color={colorOf(p.itemId)} shownAt={i * 0.15} progress={progress} />)}
    </group>
  );
}

function Player({ progress, playing, total, onDone }: { progress: React.MutableRefObject<number>; playing: boolean; total: number; onDone: () => void }) {
  useFrame((_, dt) => {
    if (!playing) return;
    progress.current += dt * 6;
    if (progress.current >= total * 0.15 + 1) { progress.current = total * 0.15 + 1; onDone(); }
  });
  return null;
}

export function LoadPlanner({ trucks }: { trucks: Truck[] }) {
  const t = useTranslations("planner");
  const [items, setItems] = useState<Item[]>(START);
  const [truckId, setTruckId] = useState(trucks.find((x) => /22/.test(x.name))?.id ?? trucks[0]?.id);
  const [playing, setPlaying] = useState(false);
  const progress = useRef(1e9); // start fully loaded
  const truck = trucks.find((x) => x.id === truckId) ?? trucks[0];

  const result = useMemo(() => (truck ? pack(truck, items) : null), [truck, items]);
  const best = useMemo(() => smallestTruck(trucks, items), [trucks, items]);
  const colorOf = (id: string) => COLORS[Math.max(0, items.findIndex((i) => i.id === id)) % COLORS.length];

  const update = (i: number, k: keyof Item, v: string | boolean) =>
    setItems((list) => list.map((it, j) => (j === i ? { ...it, [k]: typeof v === "boolean" || k === "name" ? v : Math.max(0, Number(v)) } : it)));

  if (!truck) return <p className="card">No trucks are set up yet. Add them under Shipper tools → Trucks in the admin.</p>;

  return (
    <div className="planner">
      <div className="stack">
        <div className="card stack">
          <div className="field"><label htmlFor="truck">Truck</label>
            <select id="truck" value={truckId} onChange={(e) => setTruckId(e.target.value)}>
              {trucks.map((x) => <option key={x.id} value={x.id}>{x.name}, {(x.payloadKg / 1000).toFixed(1)} t</option>)}
            </select></div>
          <div className="items" role="table" aria-label="Packages">
            <div className="item-row muted" role="row" style={{ fontSize: 12 }}><span>Item</span><span>L cm</span><span>W cm</span><span>H cm</span><span>kg</span><span>Qty</span><span>Stack</span></div>
            {items.map((it, i) => (
              <div className="item-row field" role="row" key={it.id}>
                <input aria-label="Item name" value={it.name} onChange={(e) => update(i, "name", e.target.value)} style={{ borderLeft: `6px solid ${colorOf(it.id)}` }} />
                {(["l", "w", "h", "kg", "qty"] as const).map((k) => (
                  <input key={k} aria-label={k} type="number" min={0} value={it[k]} onChange={(e) => update(i, k, e.target.value)} />
                ))}
                <input aria-label="Stackable" type="checkbox" checked={it.stackable !== false} onChange={(e) => update(i, "stackable", e.target.checked)} style={{ minHeight: 20 }} />
              </div>
            ))}
          </div>
          <div className="row">
            <button className="btn btn-line" type="button" onClick={() => setItems((l) => [...l, { id: crypto.randomUUID().slice(0, 6), name: "New item", l: 50, w: 50, h: 50, kg: 20, qty: 10 }])}>Add item</button>
            <button className="btn btn-line" type="button" disabled={items.length < 2} onClick={() => setItems((l) => l.slice(0, -1))}>Remove last</button>
            <button className="btn btn-signal" type="button" onClick={() => { progress.current = 0; setPlaying(true); }}>{t("play")}</button>
          </div>
        </div>

        {result ? (
          <div className="card stack" aria-live="polite">
            <p><span className={`pill ${result.fitsAll ? "ok" : "bad"}`}>{result.fitsAll ? "Everything fits" : "Does not all fit"}</span></p>
            <dl className="kv">
              <div><dt>Packages loaded</dt><dd>{result.placements.length} of {items.reduce((s, i) => s + i.qty, 0)}</dd></div>
              <div><dt>Weight</dt><dd>{result.usedKg.toLocaleString("en-IN")} kg ({result.usedWeightPct}%)</dd></div>
              <div><dt>Space used</dt><dd>{result.usedVolumePct}%</dd></div>
              <div><dt>Floor used</dt><dd>{(result.floorUsed / 30.48).toFixed(1)} ft of {(truck.l / 30.48).toFixed(0)} ft</dd></div>
            </dl>
            {result.unplaced.map((u) => (
              <p key={u.itemId} className="bad">{u.count} × {items.find((i) => i.id === u.itemId)?.name}: {u.reason === "weight" ? "over the payload" : u.reason === "too-big" ? "larger than the body" : "no space left"}</p>
            ))}
            <p><strong>{t("suggest")}:</strong> {best ? `${best.truck.name} (${best.result.usedVolumePct}% full)` : "none of our standard trucks; call us for a trailer."}</p>
            <p className="muted">A planning aid. The loading supervisor confirms the final plan.</p>
          </div>
        ) : null}
      </div>

      <div className="stage" aria-label={`3D view of ${truck.name} with ${result?.placements.length ?? 0} packages. Drag to rotate.`} role="img">
        <Canvas camera={{ position: [6, 5, 9], fov: 45 }} dpr={[1, 2]}>
          <color attach="background" args={["#0f1b28"]} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 10, 6]} intensity={1.1} />
          <TruckScene truck={truck} placements={result?.placements ?? []} colorOf={colorOf} progress={progress} />
          <Player progress={progress} playing={playing} total={result?.placements.length ?? 0} onDone={() => setPlaying(false)} />
          <gridHelper args={[30, 30, "#22364d", "#1a2b3d"]} position={[0, -0.9, 0]} />
          <OrbitControls enablePan={false} minDistance={4} maxDistance={25} maxPolarAngle={Math.PI / 2.1} />
        </Canvas>
      </div>
    </div>
  );
}
