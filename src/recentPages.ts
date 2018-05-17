import { IRecentPageInfo, IRecentPagesProvider } from "./services/recentPagesProvider";

let listEl: HTMLUListElement;
let recentPages: IRecentPageInfo[];

export default function initRecentPages(provider: IRecentPagesProvider): void
{
    listEl = <HTMLUListElement>document.getElementById("recent-pages-list");
    if (listEl)
    {
        provider.getRecentPages(list => {
            recentPages = list;
            createList(recentPages);
        });
    }
    else
    {
        console.error("Couldn't find recent pages list");
    }
}

export function filterRecentPages(filter: string): void
{
    if (filter)
    {
        filter = filter.toLocaleLowerCase();
        const pages = recentPages.filter(r => r.titleLower.indexOf(filter) >= 0);
        createList(pages.sort());
    }
    else
    {
        createList(recentPages);
    }
}

function createList(recents: IRecentPageInfo[]): void
{
    let html = "";
    if (recents.length)
    {
        recents.forEach(r => {
            html += `<li><a href='${r.url}'>${r.title}</a></li>`;
            //html += `<li><a href='${r.url}'><img src='chrome://favicon/${r.url}'>${r.title}</a></li>`;
        });
    }
    else
    {
        html = "<li>No recent pages found</li>";
    }
    listEl.innerHTML = html;
}
