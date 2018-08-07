import { IAppSettings, IAppSettingsService, ChromeAppSettingsService, TestAppSettingsService } from "./services/appSettingsService";

let service: IAppSettingsService;
let appSettings: IAppSettings;

function initSettingsView(settingsSvc: IAppSettingsService): void
{
    service = settingsSvc;

    settingsSvc.getAppSettings(settings => {
        appSettings = settings;
        initInputs();
    });
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
    saveAppSettings();
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
            saveAppSettings();
        }
    }
}

function onThemeChange(ev: Event): void
{
    if (ev.srcElement)
    {
        // id of the rb is the theme 
        appSettings.theme = ev.srcElement.id;
        saveAppSettings();
    }
}

function saveAppSettings(): void
{
    service.saveAppSettings(appSettings);
}

function toggleSettings(): void
{
    const el = document.getElementById("settings");
    if (el)
    {
        el.classList.toggle("expanded");
    }
}

function main(): void
{
    const isTesting = (window.location.protocol !== "chrome-extension:");
    if (isTesting)
    {
        initSettingsView(new TestAppSettingsService());
    }
    else
    {
        initSettingsView(new ChromeAppSettingsService());
    }
}

main();