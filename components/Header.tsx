"use client";

export default function Header() {
  const scrollToMint = () =>
    document.getElementById("mint-section")?.scrollIntoView({ behavior: "smooth" });

  const reasons = [
    {
      icon: "💾",
      title: "Verified Contract",
      desc: "Smart contract audited and verified on-chain — open source, no surprises.",
    },
    {
      icon: "📁",
      title: "Limited Supply",
      desc: "Fixed collection size. Once sold out, no new tokens can ever be minted.",
    },
    {
      icon: "🌐",
      title: "On-Chain Provenance",
      desc: "Full ownership history permanently recorded on the blockchain.",
    },
    {
      icon: "🎨",
      title: "Community Access",
      desc: "Holders get exclusive access to drops, events, and the inner circle.",
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
        <div className="retro-window-header">
          <span className="truncate">Welcome.exe</span>
          <div className="retro-window-close">✕</div>
        </div>
        <div className="retro-window-body text-center">
          <p
            className="mb-6"
            style={{
              fontFamily: "var(--font-vt323), monospace",
              fontSize: "22px",
              color: "#111111",
              lineHeight: "1.5",
            }}
          >
            Limited pixel art NFT collection on Polygon.<br />
            Handcrafted, on-chain, forever yours.
          </p>
          <button
            onClick={scrollToMint}
            className="retro-mint-btn"
            style={{ width: "auto", padding: "14px 32px" }}
          >
            ▶ CLAIM NFT
          </button>
        </div>
      </div>

      {/* Why Mint window */}
      <div className="retro-window w-full max-w-2xl">
        <div className="retro-window-header">
          <span className="truncate">Why_Mint.txt</span>
          <div className="retro-window-close">✕</div>
        </div>
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
                      fontSize: "9px",
                      color: "#111111",
                      lineHeight: "1.7",
                    }}
                  >
                    {r.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-vt323), monospace",
                      fontSize: "17px",
                      color: "#111111",
                      lineHeight: "1.3",
                    }}
                  >
                    {r.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll down */}
      <button
        onClick={() =>
          document.getElementById("nft-explainer")?.scrollIntoView({ behavior: "smooth" })
        }
        className="retro-btn"
        style={{ fontSize: "18px", padding: "8px 20px" }}
      >
        ▼ What is an NFT?
      </button>
    </section>
  );
}
