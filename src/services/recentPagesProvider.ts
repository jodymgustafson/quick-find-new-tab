export interface IRecentPageInfo
{
    title: string;
    titleLower: string;
    url: string;
}

export interface IRecentPagesProvider
{
    getRecentPages(calback: (recentPages: IRecentPageInfo[]) => any): void;
}

export abstract class BaseRecentPagesProvider implements IRecentPagesProvider
{
    constructor(public maxItems: number, public maxHours: number)
    {
    }
    
    abstract getRecentPages(calback: (recentPages: IRecentPageInfo[]) => any): void;
}

export class TestRecentPagesProvider extends BaseRecentPagesProvider
{
    public getRecentPages(callback: (recentPages: IRecentPageInfo[]) => any): void
    {
        const recents: IRecentPageInfo[] = [];
        for (let i = 0; i < this.maxItems; i++)
        {
            recents.push({ title: "RecentPage" + i, titleLower: "recentpage" + i, url: "http://recentpage.com#" + i});
        }

        callback(recents);
    }
}

export class ChromeRecentPagesProvider extends BaseRecentPagesProvider
{
    public getRecentPages(callback: (recentPages: IRecentPageInfo[]) => any): void
    {
        let pages: IRecentPageInfo[] = [];
        if (chrome.history)
        {
            let start = new Date().getTime() - (this.maxHours * 60 * 60 * 1000);
            //console.log("start date: " + new Date(start));
            chrome.history.search({ text: "", maxResults: this.maxItems, startTime: start}, results => {
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