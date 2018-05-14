import { ITopSitesProvider, ITopSite } from "./services/topSitesProvider";

let topSites: ITopSite[];

let listEl: HTMLUListElement;

export function initTopSites(tsProvider: ITopSitesProvider): void
{
    listEl = <HTMLUListElement>document.getElementById("top-sites-list");
    if (listEl)
    {
        tsProvider.getTopSites(ts => {
            topSites = ts;
            createList(ts);
        });
    }
    else
    {
        console.error("Couldn't find top sites list");
    }
}

export function filterTopSites(filter: string): void
{
    if (filter)
    {
        filter = filter.toLocaleLowerCase();
        const sites = topSites.filter(t => t.titleLower.indexOf(filter) >= 0);
        createList(sites.sort());
    }
    else
    {
        createList(topSites);
    }
}

function createList(sites: ITopSite[]): void
{
    let html = "";
    if (sites.length)
    {
        sites.forEach(r => {
            html += `<li><a href='${r.url}'>${r.title}</a></li>`;
            //html += `<li><a href='${r.url}'><img src='chrome://favicon/${r.url}'>${r.title}</a></li>`;
        });
    }
    else
    {
        html = "<li>No top sites found</li>";
    }
    listEl.innerHTML = html;
}