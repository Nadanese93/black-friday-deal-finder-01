# DealBeacon — Black Friday Deal Finder 2026

[![bounty](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/Nadanese93/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/Nadanese93/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

DealBeacon is a static Black Friday deal finder: **35 real deals** from Amazon, Best Buy,
Walmart and Dell, across 8 categories (TVs, laptops, headphones, wearables, smart home,
toys & gaming, home, tablets & accessories). Every price was read on **27 November 2026**
from the store's own product page or a deals source that names the store, and each deal
prints its source and check date on the card.

What makes it more than a list: every deal carries an honest verdict — **NEW LOW** (lowest
price tracked this season), **STRONG** (deep cut, near its best price) or **ROUTINE**
(modest cut, or a saving measured against a rarely-charged list price) — with the evidence
for that verdict written on the card. Two products are also compared across stores
(MacBook Air 13-inch M5: Amazon $999 vs Best Buy $1,049; AirPods Pro 3: $149 at both
Amazon and Walmart), so the cheapest place to buy is visible at a glance.

The finder works entirely client-side with no network requests: search by product or store,
filter by category, store and minimum discount, and sort by biggest discount, biggest
dollar saving, best verdict, or lowest price. The discount on each card is computed from
its two prices, so it always adds up.

## Run it

Serve `app/` with any static server and open `index.html`:

```sh
npx serve app
```

## Hand-in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` into
`$MAKEFUN_OUTPUT_DIR` (default `/output`) and writes `dossier.json` with `buildDossier`
from `vendor/makefun-frontend.ts`.

## License

MIT — see [LICENSE](LICENSE).
