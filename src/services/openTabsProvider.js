define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TestOpenTabsProvider {
        getOpenTabs(callback) {
            const tabs = [];
            for (let i = 0; i < 10; i++) {
                tabs.push({
                    windowId: 0,
                    tabIndex: i,
                    title: "Tab" + i,
                    titleLower: "tab" + i
                });
            }
            callback(tabs);
        }
    }
    exports.TestOpenTabsProvider = TestOpenTabsProvider;
    class ChromeOpenTabsProvider {
        getOpenTabs(callback) {
            let openTabs = [];
            if (chrome.tabs) {
                chrome.tabs.query({}, tabs => {
                    openTabs = tabs.map(t => this.createOpenTab(t));
                    callback(openTabs);
                });
            }
            else {
                console.error("chrome.tabs api not available");
            }
        }
        createOpenTab(tab) {
            let name = tab.title || "Unknown";
            return {
                windowId: tab.windowId,
                tabIndex: tab.index,
                title: name,
                titleLower: name.toLocaleLowerCase()
            };
        }
    }
    exports.ChromeOpenTabsProvider = ChromeOpenTabsProvider;
});
//# sourceMappingURL=openTabsProvider.js.map