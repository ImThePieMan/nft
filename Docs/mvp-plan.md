# NFT Mint Website — MVP Plan

## 1. Project Goal

Create a minimal NFT mint website for an existing smart contract deployed on the Polygon network.

Users should be able to:

* connect their wallet
* view mint price and supply
* select number of NFTs to mint
* mint NFTs directly from the contract

The site should work **without a backend and without a database**.
The smart contract is the single source of truth.

---

# 2. Tech Stack

Frontend:

* Next.js
* TypeScript
* TailwindCSS

Web3:

* wagmi
* viem
* RainbowKit

Network:

* Polygon

Deployment:

* Vercel

No backend services or databases are required for MVP.

---

# 3. Smart Contract Info

Network: Polygon

Contract address:

```
0xC4B931629Cc30c9778513EFF4c470e0F4C8daFd9
```

ABI file:

```
/Docs/abi.json
```

Important functions from ABI:

Read functions:

```
cost()
paused()
maxMintAmount()
maxSupply()
totalSupply()
name()
symbol()
whitelisted(address)
```

Write function:

```
mint(address _to, uint256 _mintAmount) payable
```

Admin functions (NOT used in frontend):

```
setCost
pause
setBaseURI
setmaxMintAmount
withdraw
whitelistUser
```

---

# 4. User Flow

1. User opens website
2. User connects wallet
3. Website checks Polygon network
4. Website reads contract data
5. User selects mint quantity
6. Website calculates total price
7. User clicks mint
8. Wallet asks for confirmation
9. Transaction sent to blockchain
10. Contract mints NFT to user's wallet
11. User sees success message and transaction link

---

# 5. UI Layout

Main mint page should include:

* Collection name
* Collection preview image
* Mint price
* Total supply progress
* Quantity selector
* Total price
* Connect wallet button
* Mint button
* Transaction status

Design:

* clean
* dark theme
* minimalistic
* responsive

---

# 6. Project Structure

```
/app
/page.tsx

/components
MintCard.tsx
WalletConnect.tsx
QuantitySelector.tsx

/lib
web3.ts
contract.ts

/config
contractConfig.ts

/abis
contract.json

/docs
MVP_PLAN.md
```

---

# 7. Mint Logic

Mint price:

```
price = cost()
```

Total price:

```
totalPrice = price * quantity
```

Mint call:

```
mint(userAddress, quantity)
```

Transaction value:

```
value = totalPrice
```

Example:

```
writeContract({
 address: contractAddress,
 abi: contractAbi,
 functionName: "mint",
 args: [userAddress, quantity],
 value: totalPrice
})
```

---

# 8. Required Validations

Before mint:

* wallet connected
* correct network (Polygon)
* contract not paused
* quantity <= maxMintAmount
* totalSupply < maxSupply

---

# 9. Features NOT included in MVP

The following are intentionally excluded:

* backend server
* database
* admin panel
* authentication system
* email notifications
* referral system
* analytics dashboard
* whitelist management UI

---

# 10. Development Steps

Step 1
Initialize Next.js project with TypeScript and Tailwind.

Step 2
Install dependencies:

```
wagmi
viem
RainbowKit
```

Step 3
Configure wallet connection.

Step 4
Configure Polygon network.

Step 5
Load contract ABI and address.

Step 6
Implement read contract functions.

Step 7
Create mint UI.

Step 8
Implement mint transaction.

Step 9
Show transaction status.

Step 10
Deploy to Vercel.

---

# 11. Security Rules

Frontend must never:

* store private keys
* call owner-only contract functions
* expose admin functionality
* modify contract logic

Only public contract functions should be used.

---

# 12. Expected Result

User opens the site → connects wallet → selects quantity → clicks mint → receives NFT in wallet.

No backend required.
