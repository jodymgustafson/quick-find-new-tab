import { IBookmarkInfo, IBookmarkProvider } from "./services/bookmarkProvider";

let listEl: HTMLUListElement;
let bookmarks: IBookmarkInfo[];
let flatBookmarks: IBookmarkInfo[];
let bookmarksHtml = "";

export default function initBookmarks(bmProvier: IBookmarkProvider): void
{
    listEl = <HTMLUListElement>document.getElementById("bookmarks-list");
    if (listEl)
    {
        bmProvier.getBookmarks(bm => {
            bookmarks = bm;
            createHierarchyList(bm);
        });

        // Listen for clicks to toggle bookmark sections
        listEl.addEventListener("click", ev => onClick(ev));
    }
    else
    {
        console.error("Couldn't find recent pages list");
    }
}

export function filterBookmarks(filter: string): void
{
    if (filter)
    {
        if (!flatBookmarks)
        {
            flatBookmarks = [];
            flattenBookmarks(bookmarks, flatBookmarks);
        }
        
        filter = filter.toLocaleLowerCase();
        const nodes = flatBookmarks.filter(bm => bm.titleLower.indexOf(filter) >= 0);
        createFlatList(nodes.sort());
    }
    else
    {
        listEl.innerHTML = bookmarksHtml;
    }
}

function onClick(ev: MouseEvent): void
{
    const src = ev.srcElement;
    if (src && src.nodeName.toUpperCase() === "A")
    {
        const a = <HTMLAnchorElement>src;
        if (a.href === "toggle://#")
        {
            // expand the ul element
            a.nextElementSibling!.classList.toggle("expanded");
            ev.preventDefault();
            ev.stopPropagation();
        }
    }
}

function flattenBookmarks(bookmarks: IBookmarkInfo[], flat: IBookmarkInfo[]): void
{
    bookmarks.forEach(bm =>{
        if (bm.children && bm.children.length)
        {
            flattenBookmarks(bm.children, flat);
        }
        else
        {
            flat.push(bm);
        }
    });
}

function createFlatList(nodes: IBookmarkInfo[]): void
{
    let html = "";
    if (nodes.length)
    {
        nodes.forEach(r => {
            html += `<li><a href='${r.url}'>${r.title}</a></li>`;
            //html += `<li><a href='${r.url}'><img src='chrome://favicon/${r.url}'>${r.title}</a></li>`;
        });
    }
    else
    {
        html = "<li>No bookmarks found</li>";
    }
    listEl.innerHTML = html;
}

function createHierarchyList(nodes: IBookmarkInfo[]): void
{
    if (nodes.length > 0 && nodes[0].children)
    {
        bookmarksHtml = createListElements(<IBookmarkInfo[]>nodes[0].children);
    }
    else
    {
        bookmarksHtml = "<li>No bookmarks</li>";
    }

    listEl.innerHTML = bookmarksHtml;
}

function createListElements(nodes: IBookmarkInfo[]): string
{
    let html = "";
    nodes.forEach(bm => {
        const link = getBookmarkLink(bm);
        if (bm.children)
        {
            const children = createListElements(bm.children!);
            html += `<li class='header'><a href="toggle://#" class="toggle header">${link}</a><ul>${children}</ul></li>`;
        }
        else
        {
            html += `<li>${link}</li>`;
        }
    });

    return html;
}

function getBookmarkLink(bm: IBookmarkInfo): string
{
    const title = bm.title || bm.url || "Unknown";
    if (bm.url)
    {
        return `<a href='${bm.url}'>${title}</a>`;
        //return `<a href='${bm.url}'><img src='chrome://favicon/${r.url}'>${bm.title}</a>`;
    }
    return title;
}