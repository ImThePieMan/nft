"use client";

function ScrollDown({ targetId, label }: { targetId: string; label: string }) {
  return (
    <div className="flex justify-center pt-8 pb-2">
      <button
        onClick={() =>
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" })
        }
        className="group flex flex-col items-center gap-2 text-gray-300 hover:text-gray-500 transition-colors duration-200"
      >
        <span className="text-[10px] uppercase tracking-widest font-mono">{label}</span>
        <span className="flex flex-col items-center gap-0.5">
          <div className="w-px h-6 bg-gradient-to-b from-gray-300 to-transparent group-hover:from-gray-400 transition-colors duration-200" />
          <svg
            className="w-3 h-3 -mt-1"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 4l4 4 4-4" />
          </svg>
        </span>
      </button>
    </div>
  );
}

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
      <section id="nft-explainer" className="w-full max-w-3xl mx-auto px-4 pt-4 pb-12">
        <p className="text-center text-gray-400 text-[23px] leading-[30px] uppercase tracking-widest mb-8 font-mono">
          What is an NFT?
        </p>

        <div className="flex flex-col gap-6">
          {/* Card: Minting */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 font-mono">
                Minting
              </p>
            </div>
            <div className="divide-y divide-gray-50">
              <div className="px-6 py-5">
                <p className="text-gray-700 text-sm font-semibold mb-2">What is an NFT?</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  NFT stands for <span className="text-gray-500 font-medium">Non-Fungible Token</span> — a
                  unique digital item recorded on a blockchain. Unlike regular files that can be copied
                  endlessly, an NFT has a verified owner and a provable history. It can represent artwork,
                  music, collectibles, in-game items, or any other digital good.
                </p>
              </div>
              <div className="px-6 py-5">
                <p className="text-gray-700 text-sm font-semibold mb-2">What does it mean to mint?</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Minting is the act of writing a new token to the blockchain for the first time. When you
                  mint, a smart contract creates a fresh NFT, assigns it a unique ID, and records you as its
                  first owner — all in a single on-chain transaction. Think of it like pressing a vinyl
                  record: once it&apos;s pressed, it&apos;s permanent and traceable forever.
                </p>
              </div>
              <div className="px-6 py-5">
                <p className="text-gray-700 text-sm font-semibold mb-2">Why does minting cost money?</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Every action on a blockchain requires a small fee paid to network validators — called a{" "}
                  <span className="text-gray-500 font-medium">gas fee</span>. On Polygon, gas is paid in
                  MATIC and is usually a fraction of a cent. The mint price itself goes to the creator;
                  gas is a separate, minimal network cost.
                </p>
              </div>
            </div>
          </div>

          {/* Card: Ownership */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 font-mono">
                Ownership
              </p>
            </div>
            <div className="divide-y divide-gray-50">
              <div className="px-6 py-5">
                <p className="text-gray-700 text-sm font-semibold mb-2">How do you actually own an NFT?</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Ownership is stored on the blockchain, not on any server. Your wallet address is
                  registered as the token&apos;s owner in the contract. As long as you control your private
                  key, you own the NFT — no company, no platform, and no one else can revoke it.
                </p>
              </div>
              <div className="px-6 py-5">
                <p className="text-gray-700 text-sm font-semibold mb-2">What can you do with it?</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  You can hold it in your wallet as a collectible, display it in on-chain galleries like
                  OpenSea or Rarible, transfer it to a friend, or list it for sale — all without asking
                  anyone&apos;s permission. Ownership travels with the token wherever it goes.
                </p>
              </div>
              <div className="px-6 py-5">
                <p className="text-gray-700 text-sm font-semibold mb-2">
                  What if the website goes down?
                </p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  The NFT lives on the blockchain, not on this site. Even if this website disappears
                  tomorrow, the token remains in your wallet forever. Metadata and artwork for this
                  collection are stored on{" "}
                  <span className="text-gray-500 font-medium">IPFS</span>, a decentralised file network,
                  so the content is durable too.
                </p>
              </div>
            </div>
          </div>
        </div>

        <ScrollDown targetId="how-to-mint" label="How to Mint" />
      </section>

    <section id="how-to-mint" className="w-full max-w-3xl mx-auto px-4 pb-16">
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

      <ScrollDown targetId="mint-section" label="Claim NFT" />
    </section>
    </>
  );
}
