# StockBanao – Inventory & Stock Manager

A responsive GitHub Pages website / PWA based on KhataBanao's green-and-cream visual design. Source is vanilla HTML, CSS and JavaScript (no build step, server or API key).

## Main features

- Inventory dashboard with product count, units available, stock cost value, low-stock alerts and out-of-stock counts.
- Products: add, edit, delete; name, SKU, category, minimum stock, opening quantity, purchase price, selling price and notes.
- Stock In / Stock Out with dates and notes. Stock Out cannot exceed the current balance.
- Product details and transaction history; search and type filters.
- Reports showing inventory value by category and low-stock watchlist.
- CSV export for products and stock movements, JSON backup and restore, dark mode and sample data.
- Responsive desktop/mobile layout; PWA web manifest and offline asset caching.

## Publish to GitHub Pages

1. Extract this ZIP.
2. Open the `stockbanao` folder. **Upload the contents of this folder, not the ZIP, and not an extra nested folder**, to the **root** of a GitHub repository called `StockBanao` (or any name).
3. In `assets/config.js` change `YOUR DEVELOPER NAME` and `YOUR_EMAIL@example.com`. Also replace these placeholders in `privacy.html` and `contact.html`.
4. Repository → **Settings → Pages** → **Deploy from a branch** → Branch `main`, folder `/ (root)` → Save.
5. The website will normally be at `https://YOUR_USERNAME.github.io/StockBanao/` (capitalisation and repository path must match).
6. Test adding products, stock in/out, backup and restore in a normal mobile browser before packaging an Android WebView app.

GitHub Pages serves the site over HTTPS. No npm install or build is needed.

## Android WebView

Create an Android Studio Java Views app and set your hosted website as the URL, e.g.:

```java
private static final String APP_URL = "https://YOUR_USERNAME.github.io/StockBanao/";
```

Use the same WebView Java wrapper approach you used for KhataBanao. Require the `INTERNET` permission, enable JavaScript and DOM storage, use HTTPS and avoid enabling unsafe file URL access. `Activity` can use an Android platform theme to avoid AppCompat dependency mismatch. See [ANDROID-NOTES.md](ANDROID-NOTES.md).

> **Important**: This ZIP is a website/PWA source, not an APK/AAB, and is not an Android Studio Java project. For Google Play, make a separate Android Studio signed AAB with an appropriate Android package ID such as `com.stockbanao.app` (or another available application ID).

## Data model

- Data is kept in browser `localStorage` under `stockbanao:v1`. This storage is **per site origin/device/browser**, not synchronised.
- Quantities are whole units; negative stock is rejected. `Current stock = opening quantity + stock in − stock out`.
- Purchase/sale prices are stored as integer minor currency units to avoid floating-point roundoff in each entered price.
- Stock cost value is `current stock × purchase price`, not sales revenue or profit.
- CSV files are **exports only**; restore requires a StockBanao JSON backup.
- Backups contain all product and movement records in plaintext; keep secure.
- Browser or Android app removal, clearing app data, or changing origin can lose local data. Export backups regularly.
- The Android WebView wrapper may need a native Java `DownloadListener` for JSON/CSV exports; `WebChromeClient.onShowFileChooser` for import file selection. The browser version works with regular browser upload/download controls.

## Running tests

With Node.js 18+ installed:

```sh
npm test
npm run check
```

To preview locally, use a web server (because browsers restrict JavaScript ES modules at `file://` origins):

```sh
python -m http.server 8000
```

Visit `http://localhost:8000`. Publish over HTTPS for PWA/offline functionality.

## Legal pages

- `privacy.html` is drafted for this local-first source only. Check any Android SDKs, analytics, ads, server APIs or third-party services added later and update all privacy text and the Google Play Data Safety form accordingly.
- `delete-data.html`, `terms.html`, `contact.html`, `about.html`, `help.html` are included. Replace publisher placeholders before public launch.

## Limitations

- This is single-device inventory tracking, not a multi-user cloud warehouse system.
- Stock out is a quantity movement and **does not** create a sales invoice, payment record or profit entry.
- No barcode scanning or server synchronisation is implemented.
- Currency selection is locked after the first product is added to avoid silently relabelling entered prices.
- This repository includes a service worker for offline file caching, but offline availability depends on the browser/WebView's service worker support and first successful online load.

## Folder structure

- `index.html` – main website
- `assets/app.mjs` – UI and interactions
- `assets/core.mjs` – calculations and validation
- `assets/store.mjs` – local persistence
- `assets/base.css` – inherited KhataBanao/BillBanao theme
- `assets/stock.css` – new StockBanao layout
- `assets/icon.svg`, `icon-192.png`, `icon-512.png` – StockBanao brand artwork
- `sw.js` and `manifest.webmanifest` – PWA
- `tests/` – Node tests
- `scripts/check.mjs` – quick package checks
