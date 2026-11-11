# StockBanao → Android Studio WebView notes (Java)

This is a GitHub Pages website. Do not copy `.mjs` into `file:///android_asset/index.html`: the modules are best loaded from the HTTPS GitHub Pages URL.

1. Publish this website to GitHub Pages. Confirm it opens in Chrome.
2. Create a new Android Studio project using Java and Views. Example Android application ID: `com.stockbanao.app` (choose a package ID not already in use). App label: StockBanao.
3. Manifest: `<uses-permission android:name="android.permission.INTERNET" />` and activity exported=true with MAIN/LAUNCHER intent-filter.
4. The WebView should enable JavaScript and DOM storage. Set `setAllowFileAccess(false)` and `MIXED_CONTENT_NEVER_ALLOW`; use your HTTPS URL.
5. Keep page links for your GitHub Pages domain in the WebView and open unrelated domains externally. Handle browser back correctly.
6. WebView upload/restore: implement `WebChromeClient.onShowFileChooser` and pass the selected file URI to `ValueCallback<Uri[]>`.
7. WebView download: implement `setDownloadListener` and handle `blob:` URLs appropriately. A basic DownloadManager listener for HTTP URLs alone does NOT handle the Blob downloads that this application creates. For a fully functional Android wrapper, either implement JavaScript-to-native download handling securely or replace the Blob URLs with native file creation through a trusted bridge.
8. Test JSON backup, JSON restore and both CSV exports on the actual phone. Do not promise users backup works before testing it.
9. App's localStorage is in Android app data; uninstall/clear data may wipe it. Test upgrade persistence and content before publishing.
10. Signed release bundle (AAB) must match the Play Console application ID. `com.stockbanao.app` is a suggestion, not guaranteed available.

Do not use an AppCompatActivity with a non-AppCompat theme. A plain `android.app.Activity` is compatible with an Android platform theme. If using `AppCompatActivity`, use `Theme.AppCompat` or a compatible Material theme instead.
