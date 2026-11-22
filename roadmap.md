# Roadmap

- [ ] Persist real Telegram referrals, read pending/qualified counts from the server, qualify only after verified withdrawals
- [ ] Remove requested server description
- [ ] Remove the disabled final withdrawal button without claiming an unprocessed payout succeeded
- [ ] Verify referral registration, duplicate/self-referral protection and private counts

- [x] Restyle all GEMSTON pages with supplied glass/slab design, preserving existing functionality
- [x] Remove top application name/icon and menu, reduce text, prioritize balances and actions
- [x] Fix wallet manifest: private -dev host returned 403; published manifest and icon return 200, wallet picker opens and withdrawal restores on close
- [x] Verify simplified design at 434×537, 360×740 and 1440×900; navigation, welcome claim, mining readback, conversion, server selection, bot-link copying and reduced motion; 30 tests pass
- [ ] Verify completed wallet connection and real transaction on a wallet device (requires wallet-owner approval; browser verified picker and handoff only)

- [x] Public invite/share/post links use @Gemystabot; webhook passes the current Telegram user's id into personal invite buttons
- [x] Verify bot referral-link correction: 28 tests passed and copied invite opens @Gemystabot; publish requested after saving

- [x] Add 90-server catalogue starting at 1 TON (1–90 TON), nine shared rig images and TON Connect purchase flow
- [x] Allow a purchased server instead of 3 referrals in local game rules, still require withdrawal fee
- [x] Test server prices, transaction amounts and withdrawal alternative (24 tests pass)
- [x] Apply 0.5 GEMSTON per TON per 2-hour session for purchased servers
- [ ] Verify a real server purchase on-chain and authorize the referral alternative server-side (needs persistent backend and payment verification)

- [x] Refresh /start: MajorEmojis, bold caption, colored buttons, generated welcome photo (native fallback if Telegram refuses custom emoji)
- [x] Fix wallet connection handoff and restore withdrawal sheet on cancel/return (checked mobile and desktop)
- [x] Bot message app link points at production; publish requested as final deployment action
- [ ] Verify Telegram menu link: update accepted but readback still returns commands
- [x] Prepare two channel posts with images and deliver drafts in chat
- [ ] Deliver posts to @Torekr: Telegram reports chat not found; recipient must send /start to @Gemystabot (delivery wired to that start message)
- [x] Offer GEMSTON or GRAM selection at any time after conditions
- [ ] Enable real payouts: needs verified server-side balances, referral/payment verification and funded payout wallet
- [x] Remove minimum for both withdrawal currencies, retain fee then 3 invites

- [x] Home page (user's design, GEMSTON coin, live STON.fi price, mining session, $7 welcome gift)
- [x] Tasks page: join community https://t.me/gemstoe, open Talon (each $3 in GEMSTON)
- [x] Refer page (each friend $4 in GEMSTON, invite link via @Gemystabot)
- [x] Wallet page (no wallet list) + convert GEMSTON→GRAM at live prices + withdraw steps: 0.15 GRAM fee → 3 invites, no minimum
- [x] Fee paid automatically from connected TON wallet (TON Connect) to the payments address
- [ ] Server-side accounts: save progress, real referral counting, verify task membership, fee payments and withdrawals (needs backend)
- [x] Bot start message: welcome + $7 gift + task/referral/withdrawal terms + app button (webhook at /api/public/telegram/webhook)
- [ ] Bot: daily notifications, gifts, channel posts, admin panel at /101
- [x] Bot's "Open the app" button uses public production address; publishing requested
- [ ] Set the bot's Main Mini App in BotFather so invite links open the app (user action)
- [x] Shrink UI element sizes across pages
