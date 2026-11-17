"use client";
import dynamic from "next/dynamic";
import type { Truck } from "@/lib/pack";

// WebGL only runs in the browser.
const LoadPlanner = dynamic(() => import("@/components/LoadPlanner").then((m) => m.LoadPlanner), {
  ssr: false,
  loading: () => <p className="card">Loading the 3D planner…</p>,
});

export function LoadPlannerClient({ trucks }: { trucks: Truck[] }) {
  return <LoadPlanner trucks={trucks} />;
}
