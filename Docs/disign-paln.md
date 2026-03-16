🎨 NFT Mint Website Design Specification

Retro Handmade Desktop UI

1. Design Concept

Website style:

Retro operating system UI (Windows 95 / early Mac style)

Pixel-art inspired interface

Handmade UI elements (outlined icons, folder UI, buttons)

Flat colors with bold borders

Minimal gradients

Playful desktop metaphor

Visual inspiration:

90s desktop software

pixel interfaces

retro indie games

early internet aesthetic

Main UI metaphor:

The website behaves like a retro desktop interface where sections appear as windows.

Examples:

Mint window

Gallery window

Roadmap window

Wallet connection popup

2. Color Palette

Based on your references.

Primary palette
Teal        #2BABA5
Soft Mint   #93D3AE
Cream       #FAECB6
Orange      #F9A822
Coral       #E96635
UI Colors
Background        #2BABA5
Window Background #FAECB6
Border            #1A1A1A
Text              #111111
Highlight         #F9A822
Accent            #E96635
Soft UI           #93D3AE
Retro UI Colors
Button Idle       #FAECB6
Button Hover      #F9A822
Button Active     #E96635
Disabled          #C8C8C8
NFT Card Colors
Card Background   #FAECB6
Card Border       #111111
Badge Color       #F9A822
Mint Glow         #E96635
3. Typography

Use pixel / retro fonts.

Primary Font
Press Start 2P

Use for:

headers

titles

section labels

Secondary Font
VT323

Use for:

body text

mint instructions

NFT metadata

buttons

Optional UI Font
IBM Plex Mono

Use for:

technical info

wallet address

contract data

Font Sizes
Headers
H1 — 36px
H2 — 28px
H3 — 22px
Body
Normal text — 18px
UI text — 16px
Small — 14px
4. Layout System

Website layout behaves like desktop windows.

Example:

[ LOGO ]

[ Mint Window ]

[ NFT Gallery Window ]

[ Roadmap Window ]

[ Contract Info Window ]

Each block looks like:

┌───────────────────────┐
│ Mint NFT          [X] │
├───────────────────────┤
│                       │
│   content             │
│                       │
└───────────────────────┘
5. Window Component
Window Header

Height:

40px

Style:

background: #F9A822
border-bottom: 3px solid #000
font: Press Start 2P

Header layout:

Title                  [X]
Window Body
background: #FAECB6
padding: 20px
border: 3px solid #000
6. Button Design

Retro OS buttons.

Style:

background: #FAECB6
border: 3px solid #000
border-radius: 6px
padding: 10px 18px
font-family: VT323
font-size: 20px
cursor: pointer

Hover:

background: #F9A822

Active:

background: #E96635
transform: translateY(2px)
7. Mint Button

Primary action.

background: #E96635
color: white
border: 3px solid #000
font-size: 24px
padding: 14px 24px

Hover animation:

scale(1.05)
8. NFT Card Component

Structure:

┌─────────────┐
│   NFT IMG   │
├─────────────┤
│ NFT #0234   │
│ Price       │
│ Mint Btn    │
└─────────────┘

Style:

background: #FAECB6
border: 3px solid #000
border-radius: 8px
padding: 10px

Image:

border: 3px solid #000
image-rendering: pixelated
9. Icons

Use hand drawn retro icons.

Examples:

floppy disk

folder

globe

music note

paint palette

Icon style:

outlined
2px stroke
flat colors
10. Animations

Subtle retro UI animation.

Window open
scale 0.95 → 1
duration 0.2s
Button press
translateY(2px)
NFT hover
border glow
11. Mint Section Layout

Example:

┌───────────────────────────┐
│  Mint NFT             [X] │
├───────────────────────────┤

Wallet: Connected

Price: 3 POL

Supply:
[ 023 / 1000 ]

[   MINT NFT   ]

└───────────────────────────┘
12. Background Style

Use flat retro color.

background: #2BABA5

Optional:

pixel stars

or

small UI shapes.

13. Grid System
max-width: 1200px
margin: auto
grid-gap: 20px

NFT gallery:

grid-template-columns:
repeat(auto-fit, minmax(220px, 1fr))
14. NFT Gallery

Displayed as desktop icons grid.

Example:

[NFT] [NFT] [NFT] [NFT]
[NFT] [NFT] [NFT] [NFT]
15. Wallet Connect Window

Popup style.

┌ Connect Wallet ────────┐
│                        │
│ [ Metamask ]           │
│ [ WalletConnect ]      │
│                        │
└────────────────────────┘
16. Responsive Behavior

Mobile:

Windows become stacked cards.

Buttons full width.

Grid:

2 columns mobile
4 columns desktop
17. Tech Stack Recommendation

For Cursor generation:

Next.js
TailwindCSS
Framer Motion
Viem / Wagmi
RainbowKit
18. Image Style

NFT images should follow:

pixel art
clean outlines
minimal shading
flat color

Render setting:

image-rendering: pixelated
19. Accessibility

Minimum contrast:

WCAG AA

Font readability:

line-height: 1.4
20. UI Inspiration Keywords

Use these prompts for Cursor / AI:

retro desktop ui
pixel interface
windows 95 ui
hand drawn icons
retro software aesthetic
indie game ui