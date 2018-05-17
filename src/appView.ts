let appEl: HTMLElement;

export default function initAppView(): void
{
    appEl = <HTMLElement>document.getElementById("main-view");
    if (appEl)
    {
        // Listen for toggle click events
        appEl.addEventListener("click", ev => onClick(ev));
    }
    else
    {
        console.error("Couldn't find main view");
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