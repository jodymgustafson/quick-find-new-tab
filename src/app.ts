import initFilter, { applyFilter } from "./filter";
import { TestBookmarkProvider, ChromeBookmarkProvider } from "./services/bookmarkProvider";
import { TestRecentPagesProvider, ChromeRecentPagesProvider } from "./services/recentPagesProvider";
import { ChromeTopSitesProvider, TestTopSitesProvider } from "./services/topSitesProvider";
import { ChromeOpenTabsProvider, TestOpenTabsProvider } from "./services/openTabsProvider";
import initRecentPages, { filterRecentPages } from "./recentPages";
import initBookmarks, { filterBookmarks } from "./bookmarks";
import { initTopSites, filterTopSites } from "./topSites";
import { initOpenTabs, filterOpenTabs } from "./openTabs";
import initAppView from "./appView";
import { ChromeAppSettingsService, TestAppSettingsService, IAppSettings } from "./services/appSettingsService";

const isTesting = (window.location.protocol !== "chrome-extension:");

function main(): void
{
    const settingsSvc = (isTesting ? new TestAppSettingsService() : new ChromeAppSettingsService());

    settingsSvc.getAppSettings(settings => {
        initViews(settings);
    });
}

function initViews(appSettings: IAppSettings): void
{
    applyTheme(appSettings.theme);

    if (isTesting)
    {
        initBookmarks(new TestBookmarkProvider());
        initTopSites(new TestTopSitesProvider());
        initOpenTabs(new TestOpenTabsProvider());
        initRecentPages(new TestRecentPagesProvider(appSettings.maxRecentPages, appSettings.maxRecentHours));
    }
    else
    {
        initBookmarks(new ChromeBookmarkProvider());
        initTopSites(new ChromeTopSitesProvider());
        initOpenTabs(new ChromeOpenTabsProvider());
        initRecentPages(new ChromeRecentPagesProvider(appSettings.maxRecentPages, appSettings.maxRecentHours));
    }

    initAppView();
    initFilter(filter => onFilterChanged(filter));

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