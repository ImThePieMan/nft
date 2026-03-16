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
  );
}
