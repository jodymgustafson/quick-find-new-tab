import { IAppSettings, IAppSettingsService } from "./services/appSettingsService";

let service: IAppSettingsService;
let appSettings: IAppSettings;
let appSettingsChanged: (appSettings: IAppSettings, ...fields: string[]) => any;

export default function initSettingsView(settingsSvc: IAppSettingsService, onChanged: (appSettings: IAppSettings, ...field: string[]) => any): void
{
    service = settingsSvc;
    appSettingsChanged = onChanged;

    settingsSvc.getAppSettings(settings => {
        appSettings = settings;
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
        initThemeRadio(<HTMLInputElement>rb, appSettings.theme);
    });

    initRecentPagesInput("max-recent-pages", appSettings.maxRecentPages.toString());
    initRecentPagesInput("max-recent-hours", appSettings.maxRecentHours.toString());

    // This will cause the settings to be applied
    fireAppSettingsChanged("theme", "maxRecentPages", "maxRecentHours");
}

function initThemeRadio(rb: HTMLInputElement, theme: string): void
{
    rb.addEventListener("change", ev => onThemeChange(ev));
    (<HTMLInputElement>rb).checked = (rb.id === theme);
}

function initRecentPagesInput(id: string, value: string): void
{
    let maxRecentsEl = <HTMLInputElement>document.getElementById(id);
    if (maxRecentsEl)
    {
        maxRecentsEl.value = value;
        maxRecentsEl.addEventListener("change", ev => onMaxRecentsChange(ev));
    }
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
    }
}

function fireAppSettingsChanged(...fields: string[]): void
{
    service.saveAppSettings(appSettings);
    appSettingsChanged(appSettings, ...fields);
}

function toggleSettings(): void
{
    const el = document.getElementById("settings");
    if (el)
    {
        el.classList.toggle("expanded");
    }
}