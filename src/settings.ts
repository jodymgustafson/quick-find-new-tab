export default function initSettings(): void
{
    const btn = document.getElementById("toggle-settings");
    if (btn)
    {
        btn.addEventListener("click", () => toggleSettings());
    }
}

function toggleSettings(): void
{
    const el = document.getElementById("settings");
    if (el)
    {
        el.classList.toggle("expanded");
    }
}