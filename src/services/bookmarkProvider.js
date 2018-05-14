define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TestBookmarkProvider {
        getBookmarks(callback) {
            const bookmarks = [];
            const root = { title: "Root", titleLower: "root", children: [] };
            bookmarks.push(root);
            for (let i = 0; i < 5; i++) {
                root.children.push({ title: "Parent" + i, titleLower: "parent" + i, children: [] });
            }
            root.children.forEach(n => {
                n.children = [];
                for (let i = 0; i < 5; i++) {
                    n.children.push({ title: n.title + "-Bookmark" + i, titleLower: n.titleLower + "-bookmark" + i, url: "http://bookmark.com#" + i });
                }
            });
            callback(bookmarks);
        }
    }
    exports.TestBookmarkProvider = TestBookmarkProvider;
    class ChromeBookmarkProvider {
        getBookmarks(callback) {
            if (chrome.bookmarks) {
                chrome.bookmarks.getTree(nodes => {
                    const bookmarks = this.parseNodes(nodes);
                    callback(bookmarks);
                });
            }
            else {
                console.error("chrome.bookmarks api not available");
            }
        }
        parseNodes(nodes) {
            return nodes.map(n => {
                return {
                    title: n.title,
                    titleLower: n.title.toLocaleLowerCase(),
                    url: n.url,
                    children: (n.children ? this.parseNodes(n.children) : null)
                };
            });
        }
    }
    exports.ChromeBookmarkProvider = ChromeBookmarkProvider;
});
//# sourceMappingURL=bookmarkProvider.js.map