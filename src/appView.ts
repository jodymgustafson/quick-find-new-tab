export default function initAppView(): void
{
    const appEl = <HTMLElement>document.getElementById("main-view");
    if (appEl)
    {
        // Listen for toggle click events
        appEl.addEventListener("click", onClick);
    }
    else
    {
        console.error("Couldn't find main view");
    }

    const bOpts = document.getElementById("show-options");
    if (bOpts)
    {
        bOpts.addEventListener("click", showOptions);
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
            a.parentElement!.nextElementSibling!.classList.toggle("expanded");
            ev.preventDefault();
            ev.stopPropagation();
        }
    }
}

function showOptions(): void
{
    if (chrome.runtime.openOptionsPage) 
    {
        chrome.runtime.openOptionsPage();
    }
    else
    {
        window.open(chrome.runtime.getURL('options.html'));
    }
}
