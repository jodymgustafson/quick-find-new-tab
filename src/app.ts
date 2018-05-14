import initFilter from "./filter";
import { TestBookmarkProvider, ChromeBookmarkProvider } from "./services/bookmarkProvider";
import { TestRecentPagesProvider, ChromeRecentPagesProvider } from "./services/recentPagesProvider";
import { ChromeTopSitesProvider, TestTopSitesProvider } from "./services/topSitesProvider";
import { ChromeOpenTabsProvider, TestOpenTabsProvider } from "./services/openTabsProvider";
import initRecentPages, { filterRecentPages } from "./recentPages";
import initBookmarks, { filterBookmarks } from "./bookmarks";
import { initTopSites, filterTopSites } from "./topSites";
import { initOpenTabs, filterOpenTabs } from "./openTabs";
import initSettings from "./settings";

function main(): void
{
    if (window.location.protocol === "chrome-extension:")
    {
        initRecentPages(new ChromeRecentPagesProvider());
        initBookmarks(new ChromeBookmarkProvider());
        initTopSites(new ChromeTopSitesProvider());
        initOpenTabs(new ChromeOpenTabsProvider());
    }
    else
    {
        initRecentPages(new TestRecentPagesProvider());
        initBookmarks(new TestBookmarkProvider());
        initTopSites(new TestTopSitesProvider());
        initOpenTabs(new TestOpenTabsProvider());
    }

    initFilter(filter => applyFilter(filter));
    initSettings();
}

function applyFilter(filter: string): void
{
    filterTopSites(filter);
    filterRecentPages(filter);
    filterBookmarks(filter);
    filterOpenTabs(filter);
}

// function ready(callback: () => any): void
// {
//     // If the dom has been loaded it will not fire an event so need to check if loaded and fire the callback immediately
//     if (document.readyState == "interactive" || document.readyState == "complete")
//     {
//         callback();
//     }
//     else
//     {
//         document.addEventListener("DOMContentLoaded", (evt) => callback());
//     }
// }

// ready(() => main());

main();