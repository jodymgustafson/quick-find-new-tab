import initFilter, { applyFilter } from "./filter";
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
    initFilter(filter => onFilterChanged(filter));

}

function onAppSettingsChanged(appSettings: IAppSettings, ...fields: string[]): void
{
    if (fields.indexOf("maxRecentPages") >= 0 || fields.indexOf("maxRecentHours") >= 0)
    {
        if (isTesting)
        {
            initRecentPages(new TestRecentPagesProvider(appSettings.maxRecentPages, appSettings.maxRecentHours));
        }
        else
        {
            initRecentPages(new ChromeRecentPagesProvider(appSettings.maxRecentPages, appSettings.maxRecentHours));
        }
    }
    if (fields.indexOf("theme") >= 0)
    {
        applyTheme(appSettings.theme);
    }
}

function applyTheme(theme: string): void
{
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add(theme);
}

function onFilterChanged(filter: string): void
{
    filterTopSites(filter);
    filterRecentPages(filter);
    filterBookmarks(filter);
    filterOpenTabs(filter);
}

main();