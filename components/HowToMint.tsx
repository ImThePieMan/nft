"use client";

import { useState } from "react";

function ScrollDown({ targetId, label }: { targetId: string; label: string }) {
  return (
    <div className="flex justify-center pt-8 pb-2">
      <button
        onClick={() =>
          document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" })
        }
        className="retro-btn"
        style={{ fontSize: "18px", padding: "8px 20px" }}
      >
        ▼ {label}
      </button>
    </div>
  );
}

const steps = [
  {
    title: "Install a wallet",
    desc: "Download MetaMask (or any WalletConnect-compatible wallet) and create an account. Write down your seed phrase and keep it safe — never share it with anyone.",
  },
  {
    title: "Add Polygon network",
    desc: 'Open MetaMask → Settings → Networks → Add Network and add Polygon Mainnet. Or visit chainlist.org and click "Add to MetaMask" next to Polygon — takes 10 seconds.',
  },
  {
    title: "Get POL",
    desc: "Buy POL on any major exchange (Binance, Coinbase, Kraken) and withdraw to your Polygon wallet. Or bridge ETH via the Polygon Bridge. Gas on Polygon is under $0.01.",
  },
  {
    title: "Connect & Mint",
    desc: "Click \"Connect Wallet\" above, choose your quantity, and confirm the transaction. Your NFT appears in your wallet instantly — yours forever.",
  },
];

const nftCards = [
  {
    title: "What is an NFT?",
    body: (
      <>
        NFT stands for <strong>Non-Fungible Token</strong> — a unique digital item recorded on a
        blockchain. Unlike regular files that can be copied endlessly, an NFT has a verified owner
        and a provable history. It can represent artwork, music, collectibles, in-game items, or any
        other digital good.
      </>
    ),
  },
  {
    title: "What does it mean to mint?",
    body: (
      <>
        Minting is the act of writing a new token to the blockchain for the first time. When you
        mint, a smart contract creates a fresh NFT, assigns it a unique ID, and records you as its
        first owner — all in a single on-chain transaction. Think of it like pressing a vinyl
        record: once it&apos;s pressed, it&apos;s permanent and traceable forever.
      </>
    ),
  },
  {
    title: "Why does minting cost money?",
    body: (
      <>
        Every action on a blockchain requires a small fee paid to network validators — called a{" "}
        <strong>gas fee</strong>. On Polygon, gas is paid in MATIC and is usually a fraction of a
        cent. The mint price itself goes to the creator; gas is a separate, minimal network cost.
      </>
    ),
  },
  {
    title: "How do you actually own an NFT?",
    body: (
      <>
        Ownership is stored on the blockchain, not on any server. Your wallet address is registered
        as the token&apos;s owner in the contract. As long as you control your private key, you own
        the NFT — no company, no platform, and no one else can revoke it.
      </>
    ),
  },
  {
    title: "What can you do with it?",
    body: (
      <>
        You can hold it in your wallet as a collectible, display it in on-chain galleries like
        OpenSea or Rarible, transfer it to a friend, or list it for sale — all without asking
        anyone&apos;s permission. Ownership travels with the token wherever it goes.
      </>
    ),
  },
  {
    title: "What if the website goes down?",
    body: (
      <>
        The NFT lives on the blockchain, not on this site. Even if this website disappears
        tomorrow, the token remains in your wallet forever. Metadata and artwork for this collection
        are stored on <strong>IPFS</strong>, a decentralised file network, so the content is
        durable too.
      </>
    ),
  },
];

const titleStyle: React.CSSProperties = {
  fontFamily: "var(--font-press-start), monospace",
  fontSize: "14px",
  color: "#111111",
  lineHeight: "1.6",
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-vt323), monospace",
  fontSize: "14px",
  color: "#111111",
  lineHeight: "1.6",
};

export default function HowToMint() {
  const [nftOpen, setNftOpen] = useState(false);
  const [howOpen, setHowOpen] = useState(true);

  return (
    <>
      {/* NFT Explainer window */}
      <section
        id="nft-explainer"
        className="w-full max-w-3xl mx-auto px-4 pt-4 pb-12"
      >
        <div className="retro-window">
          <div
            className="retro-window-header"
            onClick={!nftOpen ? () => setNftOpen(true) : undefined}
            style={!nftOpen ? { cursor: "pointer" } : undefined}
            title={!nftOpen ? "Click to restore" : undefined}
          >
            <span className="truncate">NFT_FAQ.txt</span>
            <div
              className="retro-window-close"
              onClick={(e) => { e.stopPropagation(); setNftOpen((v) => !v); }}
              title={nftOpen ? "Close" : "Restore"}
            >
              {nftOpen ? "✕" : "▲"}
            </div>
          </div>
          {nftOpen && (
          <div className="retro-window-body" style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {/* Section label */}
            <p
              className="mb-4"
              style={{
                fontFamily: "var(--font-press-start), monospace",
                fontSize: "13px",
                color: "#888",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Minting &amp; Ownership
            </p>

            <div className="flex flex-col gap-0" style={{ border: "2px solid #1A1A1A" }}>
              {nftCards.map((card, i) => (
                <div
                  key={card.title}
                  className="px-5 py-4"
                  style={{
                    borderBottom: i < nftCards.length - 1 ? "2px solid #1A1A1A" : undefined,
                    background: i % 2 === 0 ? "#FAECB6" : "#93D3AE",
                  }}
                >
                  <p className="mb-2" style={titleStyle}>{card.title}</p>
                  <p style={bodyStyle}>{card.body}</p>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>

        <ScrollDown targetId="how-to-mint" label="Ready? See how to mint →" />
      </section>

      {/* How to Mint window */}
      <section id="how-to-mint" className="w-full max-w-3xl mx-auto px-4 pb-16">
        <div className="retro-window">
          <div
            className="retro-window-header"
            onClick={!howOpen ? () => setHowOpen(true) : undefined}
            style={!howOpen ? { cursor: "pointer" } : undefined}
            title={!howOpen ? "Click to restore" : undefined}
          >
            <span className="truncate">How_To_Mint.exe — 4 steps, 5 minutes</span>
            <div
              className="retro-window-close"
              onClick={(e) => { e.stopPropagation(); setHowOpen((v) => !v); }}
              title={howOpen ? "Close" : "Restore"}
            >
              {howOpen ? "✕" : "▲"}
            </div>
          </div>
          {howOpen && (
          <div className="retro-window-body">
            <ol className="flex flex-col gap-0">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  {/* Step connector */}
                  <div className="flex flex-col items-center">
                    <div
                      className="flex items-center justify-center shrink-0 z-10"
                      style={{
                        width: "32px",
                        height: "32px",
                        border: "3px solid #1A1A1A",
                        background: "#F9A822",
                        fontFamily: "var(--font-press-start), monospace",
                        fontSize: "14px",
                        color: "#111111",
                      }}
                    >
                      {i + 1}
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className="flex-1 my-1"
                        style={{ width: "3px", background: "#1A1A1A" }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 min-w-0 ${i < steps.length - 1 ? "pb-5" : ""}`}
                  >
                    <p className="mb-1" style={titleStyle}>{step.title}</p>
                    <p style={bodyStyle}>{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          )}
        </div>

        <ScrollDown targetId="mint-section" label="Mint your NFT now ↑" />
      </section>
    </>
  );
}
