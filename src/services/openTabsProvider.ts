export interface IOpenTab
{
    title: string;
    titleLower: string;
    windowId: number;
    tabIndex: number;
}

export interface IOpenTabsProvider
{
    getOpenTabs(callback: (tabs: IOpenTab[]) => any): void;
}

export class TestOpenTabsProvider implements IOpenTabsProvider 
{
    public getOpenTabs(callback: (tabs: IOpenTab[]) => any): void 
    {
        const tabs: IOpenTab[] = [];
        for (let i = 0; i < 10; i++)
        {
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

export class ChromeOpenTabsProvider implements IOpenTabsProvider
{
    public getOpenTabs(callback: (tabs: IOpenTab[]) => any): void 
    {
        let openTabs: IOpenTab[] = [];

        if (chrome.tabs)
        {
            chrome.tabs.query({}, tabs =>{
                openTabs = tabs.map(t => this.createOpenTab(t));
                callback(openTabs);
            });
        }
        else
        {
            console.error("chrome.tabs api not available");
        }
    }

    private createOpenTab(tab: chrome.tabs.Tab): IOpenTab
    {
        let name = tab.title || "Unknown";
        return {
            windowId: tab.windowId,
            tabIndex: tab.index,
            title: name,
            titleLower: name.toLocaleLowerCase()
        };
    }
}