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

      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        {/* Collection name */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
          昭和伝説ガレージ
        </h1>
        <p className="text-gray-400 text-sm uppercase tracking-widest font-mono">
          しょうわ でんせつ ガレージ
        </p>

        {/* Claim NFT button — green */}
        <button
          onClick={scrollToMint}
          className="mt-4 px-10 py-4 rounded-2xl font-bold text-base text-white
            bg-green-600
            hover:bg-green-500
            shadow-lg shadow-green-200
            transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Claim NFT
        </button>
      </div>

      {/* Why mint this collection */}
      <div className="relative z-10 mt-20 w-full max-w-3xl">
        <p className="text-center text-gray-400 text-[23px] leading-[30px] uppercase tracking-widest mb-8 font-mono">
          Why mint
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
            >
              <span className="mt-0.5 text-green-600 text-lg leading-none">{r.icon}</span>
              <div>
                <p className="text-gray-800 text-sm font-semibold mb-1">{r.title}</p>
                <p className="text-gray-400 text-xs leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-300">
        <span className="text-xs uppercase tracking-widest font-mono">scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-transparent" />
      </div>
    </section>
  );
}
