import { IAppSettings, IAppSettingsService } from "./services/appSettingsService";

let service: IAppSettingsService;
let appSettings: IAppSettings;
let appSettingsChanged: (appSettings: IAppSettings, fields: string) => any;

export default function initSettingsView(settingsSvc: IAppSettingsService, onChanged: (appSettings: IAppSettings, field: string) => any): void
{
    service = settingsSvc;
    appSettingsChanged = onChanged;

    settingsSvc.getAppSettings(settings => {
        appSettings = settings;
        applyTheme();
        initInputs();
    });

    const btn = document.getElementById("toggle-settings");
    if (btn)
    {
        btn.addEventListener("click", () => toggleSettings());
    }
}

function initInputs(): void
{
    const themeRBs = document.getElementsByName("theme");
    themeRBs.forEach(rb => {
        rb.addEventListener("change", ev => onThemeChange(ev));
        (<HTMLInputElement>rb).checked = (rb.id === appSettings.theme);
    });
    fireAppSettingsChanged("theme");

    let maxRecentsEl = <HTMLInputElement>document.getElementById("max-recent-pages");
    if (maxRecentsEl)
    {
        maxRecentsEl.value = appSettings.maxRecentPages.toString();
        maxRecentsEl.addEventListener("change", ev => onMaxRecentsChange(ev));
    }

    maxRecentsEl = <HTMLInputElement>document.getElementById("max-recent-hours");
    if (maxRecentsEl)
    {
        maxRecentsEl.value = appSettings.maxRecentHours.toString();
        maxRecentsEl.addEventListener("change", ev => onMaxRecentsChange(ev));
    }

    // This will cause the recent pages service to get initialized
    fireAppSettingsChanged("maxRecentPages,maxRecentHours");
}

function onMaxRecentsChange(ev: Event): void
{
    const maxRecentsEl = <HTMLInputElement>ev.srcElement;
    if (maxRecentsEl)
    {
        const val = maxRecentsEl.value;
        if (val)
        {
            const field = maxRecentsEl.name;
            (<any>appSettings)[field] = parseInt(val);
            fireAppSettingsChanged(maxRecentsEl.name);
        }
    }
}

function onThemeChange(ev: Event): void
{
    if (ev.srcElement)
    {
        // id of the rb is the theme 
        appSettings.theme = ev.srcElement.id;
        fireAppSettingsChanged("theme");
        applyTheme();
    }
}

function applyTheme(): void
{
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add(appSettings.theme);
}

function fireAppSettingsChanged(field: string): void
{
    service.saveAppSettings(appSettings);
    appSettingsChanged(appSettings, field);
}

function toggleSettings(): void
{
    const el = document.getElementById("settings");
    if (el)
    {
        el.classList.toggle("expanded");
    }
}