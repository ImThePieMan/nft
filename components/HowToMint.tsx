const steps = [
  {
    title: "Install a wallet",
    desc: "Download MetaMask (or any WalletConnect-compatible wallet) and create an account. Keep your seed phrase safe — never share it.",
  },
  {
    title: "Add Polygon network",
    desc: 'In MetaMask go to Settings → Networks → Add Network and add Polygon Mainnet, or visit chainlist.org and click "Add to MetaMask" next to Polygon.',
  },
  {
    title: "Get MATIC",
    desc: "Buy MATIC on any major exchange (Binance, Coinbase, Kraken) and withdraw it to your wallet on the Polygon network, or bridge ETH via the Polygon Bridge.",
  },
  {
    title: "Connect & Mint",
    desc: "Scroll down, click \u201cConnect Wallet\u201d, select the quantity you want, and confirm the transaction. Gas fees on Polygon are minimal \u2014 usually under $0.01.",
  },
];

export default function HowToMint() {
  return (
    <>
      {/* What is minting / NFT ownership explainer */}
      <section className="w-full max-w-3xl mx-auto px-4 pt-4 pb-12">
        <p className="text-center text-gray-400 text-[23px] leading-[30px] uppercase tracking-widest mb-8 font-mono">
          What is an NFT?
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 font-mono mb-3">
              Minting
            </p>
            <p className="text-gray-700 text-sm leading-relaxed font-medium mb-2">
              What does it mean to mint?
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Minting is the process of publishing a unique digital asset on the blockchain. When you
              mint an NFT you create a permanent on‑chain record that proves the token exists — and
              that you were the one who brought it to life. Think of it like pressing a vinyl record:
              once it&apos;s pressed, it&apos;s real and traceable forever.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 font-mono mb-3">
              Ownership
            </p>
            <p className="text-gray-700 text-sm leading-relaxed font-medium mb-2">
              How do you own an NFT?
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Ownership is stored directly in your wallet on the blockchain — no platform or company
              can take it away. As long as you hold the private key to your wallet, you own the NFT.
              You can hold it, display it in galleries like OpenSea, or sell it to anyone, anywhere,
              at any time without asking anyone&apos;s permission.
            </p>
          </div>
        </div>
      </section>

    <section className="w-full max-w-3xl mx-auto px-4 pb-16">
      <p className="text-center text-gray-400 text-[23px] leading-[30px] uppercase tracking-widest mb-8 font-mono">
        How to mint
      </p>

      <ol className="flex flex-col gap-0">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            {/* Connector column */}
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center shrink-0 z-10">
                <span className="text-[11px] text-gray-400 font-mono font-bold">{i + 1}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-px flex-1 bg-gray-200 my-1" />
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 min-w-0 ${i < steps.length - 1 ? "pb-6" : ""}`}>
              <p className="text-gray-800 text-sm font-semibold leading-7">{step.title}</p>
              <p className="text-gray-400 text-xs leading-relaxed mt-0.5">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
    </>
  );
}
