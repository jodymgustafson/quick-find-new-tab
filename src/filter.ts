let filterEl: HTMLInputElement;
let filterCallback: (filterText: string)=>any;

export default function initFilter(onFilter: (filterText: string)=>any): void
{
    filterCallback = onFilter;
    filterEl = <HTMLInputElement>document.getElementById("filter-text");
    if (filterEl)
    {
        filterEl.addEventListener("keyup", () => applyFilter());
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

function applyFilter(): void
{
    const text = filterEl.value;
    filterCallback(text);
}

function clearFilter(): void
{
    filterEl.value = "";
    applyFilter();
}