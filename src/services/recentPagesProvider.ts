export interface IRecentPageInfo
{
    title: string;
    titleLower: string;
    url: string;
}

export interface IRecentPagesProvider
{
    getRecentPages(maxItems: number, calback: (recentPages: IRecentPageInfo[]) => any): void;
}

export class TestRecentPagesProvider implements IRecentPagesProvider
{
    public getRecentPages(maxItems: number, callback: (recentPages: IRecentPageInfo[]) => any): void
    {
        const recents: IRecentPageInfo[] = [];
        for (let i = 0; i < maxItems; i++)
        {
            recents.push({ title: "RecentPage" + i, titleLower: "recentpage" + i, url: "http://recentpage.com#" + i});
        }

        callback(recents);
    }
}

export class ChromeRecentPagesProvider implements IRecentPagesProvider
{
    public getRecentPages(maxItems: number, callback: (recentPages: IRecentPageInfo[]) => any): void
    {
        let pages: IRecentPageInfo[] = [];
        if (chrome.history)
        {
            chrome.history.search({ text: "", maxResults: maxItems}, results => {
                const recents = results.map(r => this.createRecentPageInfo(r));
                callback(recents);
            });
        }
        else
        {
            console.error("chrome.history api not available");
        }
    }
    
    private createRecentPageInfo(r: chrome.history.HistoryItem): IRecentPageInfo
    {
        const title = r.title || r.url || "Unknown";
        return {
            title: title,
            titleLower: title.toLocaleLowerCase(),
            url: r.url || ""
        };
    }
}