"use client";

export default function Header() {
  const scrollToMint = () =>
    document.getElementById("mint-section")?.scrollIntoView({ behavior: "smooth" });

  const reasons = [
    {
      icon: "✦",
      title: "Verified Contract",
      desc: "Smart contract audited and verified on-chain — open source, no surprises.",
    },
    {
      icon: "◈",
      title: "Limited Supply",
      desc: "Fixed collection size. Once sold out, no new tokens can ever be minted.",
    },
    {
      icon: "⬡",
      title: "On-Chain Provenance",
      desc: "Full ownership history permanently recorded on the blockchain.",
    },
    {
      icon: "⌘",
      title: "Community Access",
      desc: "Holders get exclusive access to drops, events, and the inner circle.",
    },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-start px-4 pt-28 pb-24">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-900/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-900/30 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        {/* Collection name */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent leading-tight">
          昭和伝説ガレージ
        </h1>
        <p className="text-white/40 text-sm uppercase tracking-widest">
          しょうわ でんせつ ガレージ
        </p>

        {/* Claim NFT button */}
        <button
          onClick={scrollToMint}
          className="mt-4 px-10 py-4 rounded-2xl font-bold text-base text-white
            bg-gradient-to-r from-purple-600 to-indigo-500
            hover:from-purple-500 hover:to-indigo-400
            shadow-lg shadow-purple-900/40
            transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Claim NFT
        </button>
      </div>

      {/* Why mint this collection */}
      <div className="relative z-10 mt-20 w-full max-w-3xl">
        <p className="text-center text-white/30 text-[23px] leading-[30px] uppercase tracking-widest mb-8">
          Why mint
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 backdrop-blur-sm"
            >
              <span className="mt-0.5 text-purple-400 text-lg leading-none">{r.icon}</span>
              <div>
                <p className="text-white/90 text-sm font-semibold mb-1">{r.title}</p>
                <p className="text-white/35 text-xs leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
        <span className="text-xs uppercase tracking-widest">scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
