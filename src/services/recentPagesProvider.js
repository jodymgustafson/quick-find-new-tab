define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BaseRecentPagesProvider {
        constructor(maxItems) {
            this.maxItems = maxItems;
        }
    }
    exports.BaseRecentPagesProvider = BaseRecentPagesProvider;
    class TestRecentPagesProvider extends BaseRecentPagesProvider {
        getRecentPages(callback) {
            const recents = [];
            for (let i = 0; i < this.maxItems; i++) {
                recents.push({ title: "RecentPage" + i, titleLower: "recentpage" + i, url: "http://recentpage.com#" + i });
            }
            callback(recents);
        }
    }
    exports.TestRecentPagesProvider = TestRecentPagesProvider;
    class ChromeRecentPagesProvider extends BaseRecentPagesProvider {
        getRecentPages(callback) {
            let pages = [];
            if (chrome.history) {
                chrome.history.search({ text: "", maxResults: this.maxItems }, results => {
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