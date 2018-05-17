import initFilter from "./filter";
import { TestBookmarkProvider, ChromeBookmarkProvider } from "./services/bookmarkProvider";
import { TestRecentPagesProvider, ChromeRecentPagesProvider } from "./services/recentPagesProvider";
import { ChromeTopSitesProvider, TestTopSitesProvider } from "./services/topSitesProvider";
import { ChromeOpenTabsProvider, TestOpenTabsProvider } from "./services/openTabsProvider";
import initRecentPages, { filterRecentPages } from "./recentPages";
import initBookmarks, { filterBookmarks } from "./bookmarks";
import { initTopSites, filterTopSites } from "./topSites";
import { initOpenTabs, filterOpenTabs } from "./openTabs";
import initSettingsView from "./settingsView";
import initAppView from "./appView";
import { ChromeAppSettingsService, TestAppSettingsService, IAppSettings } from "./services/appSettingsService";

let isTesting = false;

function main(): void
{
    isTesting = (window.location.protocol !== "chrome-extension:");
    
    if (isTesting)
    {
        initSettingsView(new TestAppSettingsService(), onAppSettingsChanged);
        initBookmarks(new TestBookmarkProvider());
        initTopSites(new TestTopSitesProvider());
        initOpenTabs(new TestOpenTabsProvider());
    }
    else
    {
        initSettingsView(new ChromeAppSettingsService(), onAppSettingsChanged);
        initBookmarks(new ChromeBookmarkProvider());
        initTopSites(new ChromeTopSitesProvider());
        initOpenTabs(new ChromeOpenTabsProvider());
    }

    initAppView();
    initFilter(filter => applyFilter(filter));

}

function onAppSettingsChanged(appSettings: IAppSettings, field: string): void
{
    if (field === "maxRecentPages")
    {
        if (isTesting)
        {
            initRecentPages(new TestRecentPagesProvider(appSettings.maxRecentPages));
        }
        else
        {
            initRecentPages(new ChromeRecentPagesProvider(appSettings.maxRecentPages));
        }
    }
}

function applyFilter(filter: string): void
{
    filterTopSites(filter);
    filterRecentPages(filter);
    filterBookmarks(filter);
    filterOpenTabs(filter);
}

main();