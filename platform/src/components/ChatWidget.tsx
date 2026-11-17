"use client";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatWidget() {
  const t = useTranslations("chat");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const log = useRef<HTMLDivElement>(null);
  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight }); }, [msgs, busy]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const q = text.trim();
    if (!q || busy) return;
    const next = [...msgs, { role: "user" as const, content: q }].slice(-12);
    setMsgs(next); setText(""); setBusy(true);
    try {
      const res = await fetch("/api/public/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next, locale }) });
      const j = await res.json();
      setMsgs([...next, { role: "assistant", content: res.ok ? j.reply : j.error ?? "Please call 022-62284444." }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: "I could not connect. Please call 022-62284444." }]);
    } finally { setBusy(false); }
  }

  return (
    <>
      {open ? (
        <section className="chat-panel" aria-label={t("open")}>
          <div className="chat-head"><strong>{t("open")}</strong><button className="btn" style={{ color: "#fff", minHeight: 32 }} onClick={() => setOpen(false)} aria-label="Close">✕</button></div>
          <div className="chat-log" ref={log} aria-live="polite">
            {msgs.length === 0 ? <p className="muted">{t("hint")}</p> : null}
            {msgs.map((m, i) => <div key={i} className={`msg ${m.role}`}>{m.content}</div>)}
            {busy ? <div className="msg assistant muted">…</div> : null}
          </div>
          <form className="chat-form" onSubmit={send}>
            <label htmlFor="chat-q" className="sr-only">{t("ph")}</label>
            <input id="chat-q" value={text} maxLength={1000} placeholder={t("ph")} onChange={(e) => setText(e.target.value)} />
            <button className="btn btn-signal" disabled={busy}>{t("send")}</button>
          </form>
        </section>
      ) : null}
      <button className="btn btn-ink chat-fab" onClick={() => setOpen((o) => !o)} aria-expanded={open}>{t("open")}</button>
    </>
  );
}
