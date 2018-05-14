export interface ITopSite
{
    title: string;
    titleLower: string;
    url: string;
}

export interface ITopSitesProvider
{
    getTopSites(callback: (sites: ITopSite[])=>any): void;
}

export class TestTopSitesProvider implements ITopSitesProvider
{
    getTopSites(callback: (sites: ITopSite[]) => any): void 
    {
        const sites: ITopSite[] = [];
        for (let i = 0; i < 10; i++)
        {
            sites.push({ title: "TopSite" + i, url: "http://topsite" + i, titleLower: "topsite" + i});
        }

        callback(sites);
    }
}

export class ChromeTopSitesProvider implements ITopSitesProvider 
{
    getTopSites(callback: (sites: ITopSite[]) => any): void 
    {
        if (chrome.topSites)
        {
            chrome.topSites.get(ts => {
                const sites: ITopSite[] = ts.map(x => <ITopSite>{
                    title: x.title,
                    url: x.url,
                    titleLower: x.title.toLocaleLowerCase()
                });
                
                callback(sites);
            });
        }
        else
        {
            console.error("chrome.topSites api not available");
        }
    }
}