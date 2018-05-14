define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TestRecentPagesProvider {
        getRecentPages(maxItems, callback) {
            const recents = [];
            for (let i = 0; i < maxItems; i++) {
                recents.push({ title: "RecentPage" + i, titleLower: "recentpage" + i, url: "http://recentpage.com#" + i });
            }
            callback(recents);
        }
    }
    exports.TestRecentPagesProvider = TestRecentPagesProvider;
    class ChromeRecentPagesProvider {
        getRecentPages(maxItems, callback) {
            let pages = [];
            if (chrome.history) {
                chrome.history.search({ text: "", maxResults: maxItems }, results => {
                    const recents = results.map(r => this.createRecentPageInfo(r));
                    callback(recents);
                });
            }
            else {
                console.error("chrome.history api not available");
            }
        }
        createRecentPageInfo(r) {
            const title = r.title || r.url || "Unknown";
            return {
                title: title,
                titleLower: title.toLocaleLowerCase(),
                url: r.url || ""
            };
        }
    }
    exports.ChromeRecentPagesProvider = ChromeRecentPagesProvider;
});
//# sourceMappingURL=recentPagesProvider.js.map