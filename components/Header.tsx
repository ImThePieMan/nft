"use client";

export default function Header() {
  const scrollToMint = () =>
    document.getElementById("mint-section")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-4">
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

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
        <span className="text-xs uppercase tracking-widest">scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
