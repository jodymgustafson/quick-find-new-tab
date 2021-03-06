let filterInput: HTMLInputElement;
let filterCallback: (filterText: string)=>any;

export default function initFilter(onFilter: (filterText: string)=>any): void
{
    filterCallback = onFilter;
    filterInput = <HTMLInputElement>document.getElementById("filter-text");
    if (filterInput)
    {
        filterInput.addEventListener("keyup", (ev) => onKeyUp(ev));
    }
    else
    {
        console.error("Couldn't find filter text field");
    }

    const button = document.getElementById("clear-filter");
    if (button)
    {
        button.addEventListener("click", () => clearFilter());
    }
}

// let endDebounce = 0;

// function onFilterChanged(): void
// {
//     const now = new Date().getTime();
//     if (endDebounce === 0 || now < endDebounce)
//     {
//         endDebounce = now + 100;
//     }

//     if (now < endDebounce)
//     setTimeout(() => {

//     }, 100);

//     applyFilter();
// }

const KEY_ESCAPE = 27;

function onKeyUp(ev: KeyboardEvent): void
{
    if (ev.keyCode === KEY_ESCAPE)
    {
        clearFilter();
    }
    else
    {
        applyFilter();
    }
}

export function applyFilter(): void
{
    if (filterInput)
    {
        const text = filterInput.value;
        filterCallback(text);
    }
}

function clearFilter(): void
{
    filterInput.value = "";
    filterInput.focus();
    applyFilter();
}