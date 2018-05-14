define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TestTopSitesProvider {
        getTopSites(callback) {
            const sites = [];
            for (let i = 0; i < 10; i++) {
                sites.push({ title: "TopSite" + i, url: "http://topsite" + i, titleLower: "topsite" + i });
            }
            callback(sites);
        }
    }
    exports.TestTopSitesProvider = TestTopSitesProvider;
    class ChromeTopSitesProvider {
        getTopSites(callback) {
            if (chrome.topSites) {
                chrome.topSites.get(ts => {
                    const sites = ts.map(x => ({
                        title: x.title,
                        url: x.url,
                        titleLower: x.title.toLocaleLowerCase()
                    }));
                    callback(sites);
                });
            }
            else {
                console.error("chrome.topSites api not available");
            }
        }
    }
    exports.ChromeTopSitesProvider = ChromeTopSitesProvider;
});
//# sourceMappingURL=topSitesProvider.js.map