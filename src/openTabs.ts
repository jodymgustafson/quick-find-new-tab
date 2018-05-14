import { IOpenTab, IOpenTabsProvider } from "./services/openTabsProvider";

let openTabs: IOpenTab[];

let listEl: HTMLUListElement;

export function initOpenTabs(provider: IOpenTabsProvider): void
{
    listEl = <HTMLUListElement>document.getElementById("open-tabs-list");
    if (listEl)
    {
        listEl.addEventListener("click", (ev) =>onClicked(ev));

        provider.getOpenTabs(tabs => {
            openTabs = tabs;
            createList(tabs);
        });
    }
    else
    {
        console.error("Couldn't find open tabs list");
    }
}

export function filterOpenTabs(filter: string): void
{
    if (filter)
    {
        filter = filter.toLocaleLowerCase();
        const tabs = openTabs.filter(t => t.titleLower.indexOf(filter) >= 0);
        createList(tabs.sort());
    }
    else
    {
        createList(openTabs);
    }
}

function createList(tabs: IOpenTab[]): void
{
    let html = "";
    if (tabs.length)
    {
        tabs.forEach(r => {
            html += `<li><a href='tab://${r.windowId}#${r.tabIndex}'>${r.title}</a></li>`;
            //html += `<li><a href='${r.url}'><img src='chrome://favicon/${r.url}'>${r.title}</a></li>`;
        });
    }
    else
    {
        html = "<li>No open tabs found</li>";
    }
    listEl.innerHTML = html;
}

function onClicked(ev: MouseEvent): void
{
    let el = <HTMLElement>ev.srcElement;
    if (el instanceof HTMLAnchorElement)
    {
        const href = el.href;
        let idx = href.slice("tab://".length).split("#");
        console.log(idx);
        chrome.tabs!.highlight({tabs: [parseInt(idx[1])]}, ()=>{});
        ev.stopPropagation();
        ev.preventDefault();
    }
}