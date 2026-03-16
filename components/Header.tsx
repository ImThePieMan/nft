"use client";

import { useState } from "react";

export default function Header() {
  const [welcomeOpen, setWelcomeOpen] = useState(true);
  const [whyMintOpen, setWhyMintOpen] = useState(true);

  const scrollToMint = () =>
    document.getElementById("mint-section")?.scrollIntoView({ behavior: "smooth" });

  const reasons = [
    {
      icon: "🔥",
      title: "Limited Supply",
      desc: "Only 1 000 tokens exist — ever. No reprints. No expansions. When they're gone, they're gone.",
    },
    {
      icon: "🎨",
      title: "Exclusive Access",
      desc: "Holders unlock private drops, IRL events, and early access to future releases — permanently.",
    },
    {
      icon: "💾",
      title: "Verified Contract",
      desc: "Audited, open-source smart contract. Every line of code is public — no hidden fees, no rug pulls.",
    },
    {
      icon: "🌐",
      title: "Yours Forever",
      desc: "Ownership lives on the blockchain, not on our servers. Even if this site disappears, your token stays.",
    },
  ];

  return (
    <section className="relative w-full flex flex-col items-center px-4 pt-14 pb-20 gap-8">

      {/* Title */}
      <div className="text-center">
        <h1
          className="leading-tight mb-3"
          style={{
            fontFamily: "var(--font-press-start), monospace",
            fontSize: "clamp(14px, 3vw, 28px)",
            color: "#111111",
          }}
        >
          昭和伝説ガレージ
        </h1>
        <p
          style={{
            fontFamily: "var(--font-vt323), monospace",
            fontSize: "22px",
            color: "#FAECB6",
            letterSpacing: "0.1em",
          }}
        >
          しょうわ でんせつ ガレージ
        </p>
      </div>

      {/* Welcome window */}
      <div className="retro-window w-full max-w-lg">
        <div
          className="retro-window-header"
          onClick={!welcomeOpen ? () => setWelcomeOpen(true) : undefined}
          style={!welcomeOpen ? { cursor: "pointer" } : undefined}
          title={!welcomeOpen ? "Click to restore" : undefined}
        >
          <span className="truncate">Welcome.exe</span>
          <div
            className="retro-window-close"
            onClick={(e) => { e.stopPropagation(); setWelcomeOpen((v) => !v); }}
            title={welcomeOpen ? "Close" : "Restore"}
          >
            {welcomeOpen ? "✕" : "▲"}
          </div>
        </div>
        {welcomeOpen && (
          <div className="retro-window-body text-center">
            <p
              className="mb-2"
              style={{
                fontFamily: "var(--font-vt323), monospace",
                fontSize: "18px",
                color: "#111111",
                lineHeight: "1.6",
              }}
            >
              1 000 unique pixel art pieces — handcrafted, on-chain, <strong>forever yours.</strong>
            </p>
            <p
              className="mb-6"
              style={{
                fontFamily: "var(--font-vt323), monospace",
                fontSize: "15px",
                color: "#555",
                lineHeight: "1.5",
              }}
            >
              Minted on Polygon. Low gas. True ownership. No middlemen.
            </p>
            <button
              onClick={scrollToMint}
              className="retro-mint-btn"
              style={{ width: "auto", padding: "14px 36px" }}
            >
              ▶ MINT YOURS NOW
            </button>
          </div>
        )}
      </div>

      {/* Why Mint window */}
      <div className="retro-window w-full max-w-2xl">
        <div
          className="retro-window-header"
          onClick={!whyMintOpen ? () => setWhyMintOpen(true) : undefined}
          style={!whyMintOpen ? { cursor: "pointer" } : undefined}
          title={!whyMintOpen ? "Click to restore" : undefined}
        >
          <span className="truncate">Why_Own_One.txt</span>
          <div
            className="retro-window-close"
            onClick={(e) => { e.stopPropagation(); setWhyMintOpen((v) => !v); }}
            title={whyMintOpen ? "Close" : "Restore"}
          >
            {whyMintOpen ? "✕" : "▲"}
          </div>
        </div>
        {whyMintOpen && (
        <div className="retro-window-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="flex items-start gap-3 p-3"
                style={{
                  border: "2px solid #1A1A1A",
                  borderRadius: "4px",
                  background: "#93D3AE",
                }}
              >
                <span className="text-xl shrink-0 mt-0.5">{r.icon}</span>
                <div>
                  <p
                    className="mb-1"
                    style={{
                  fontFamily: "var(--font-press-start), monospace",
                    fontSize: "14px",
                    color: "#111111",
                    lineHeight: "1.6",
                    }}
                  >
                    {r.title}
                  </p>
                  <p
                    style={{
                  fontFamily: "var(--font-vt323), monospace",
                    fontSize: "14px",
                    color: "#111111",
                    lineHeight: "1.5",
                    }}
                  >
                    {r.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>

      {/* Scroll down */}
      <button
        onClick={() =>
          document.getElementById("how-to-mint")?.scrollIntoView({ behavior: "smooth" })
        }
        className="retro-btn"
        style={{ fontSize: "18px", padding: "8px 20px" }}
      >
        ▼ How to Mint
      </button>
    </section>
  );
}
