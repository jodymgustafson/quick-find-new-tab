export interface IBookmarkInfo
{
    title: string;
    titleLower: string;
    url?: string;
    children?: IBookmarkInfo[];
}

export interface IBookmarkProvider
{
    getBookmarks(callback: (bookmarks: IBookmarkInfo[])=>any): void;
}

export class TestBookmarkProvider implements IBookmarkProvider
{
    getBookmarks(callback: (bookmarks: IBookmarkInfo[]) => any): void
    {
        const bookmarks: IBookmarkInfo[] = [];
        const root = { title: "Root", titleLower: "root", children: <IBookmarkInfo[]>[] };
        bookmarks.push(root);
        for (let i = 0; i < 5; i++)
        {
            root.children.push({ title: "Parent" + i, titleLower: "parent" + i, children: <IBookmarkInfo[]>[] });
        }

        root.children.forEach(n =>{
            n.children = [];
            for (let i = 0; i < 5; i++)
            {
                n.children.push({ title: n.title + "-Bookmark" + i, titleLower: n.titleLower + "-bookmark" + i, url: "http://bookmark.com#" + i });
            }
        });
        
        callback(bookmarks);
    }
}

export class ChromeBookmarkProvider implements IBookmarkProvider
{
    public getBookmarks(callback: (bookmarks: IBookmarkInfo[])=>any): void
    {
        if (chrome.bookmarks)
        {
            chrome.bookmarks.getTree(nodes => {
                const bookmarks = this.parseNodes(nodes);
                callback(bookmarks);
            });
        }
        else
        {
            console.error("chrome.bookmarks api not available");
        }
    }

    private parseNodes(nodes: chrome.bookmarks.BookmarkTreeNode[]): IBookmarkInfo[]
    {
        return nodes.map(n => {
            return <IBookmarkInfo>{
                title: n.title,
                titleLower: n.title.toLocaleLowerCase(),
                url: n.url,
                children: (n.children ? this.parseNodes(n.children) : null)
            }
        });
    }
}