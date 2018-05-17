export interface IAppSettings
{
    version: string;
    theme: string;
    maxRecentPages: number;
}

export interface IAppSettingsService
{
    getAppSettings(callback: (settings: IAppSettings) => any): void;
    saveAppSettings(settings: IAppSettings): void;
}

export class TestAppSettingsService implements IAppSettingsService
{
    public getAppSettings(callback: (settings: IAppSettings) => any): void
    {
        let appSettings: IAppSettings;
        let json = localStorage.getItem("appSettings");
        if (json)
        {
            appSettings = JSON.parse(json);
        }
        else
        {
            console.log("Getting default settings");
            appSettings = getDefaultSettings();
            this.saveAppSettings(appSettings);
        }
        console.log("Loaded app settings: " + appSettings);

        callback(appSettings);
    }
    
    public saveAppSettings(settings: IAppSettings): void
    {
        localStorage.setItem("appSettings", JSON.stringify(settings));
    }
}

export class ChromeAppSettingsService implements IAppSettingsService
{
    public getAppSettings(callback: (settings: IAppSettings) => any): void
    {
        chrome.storage.sync.get(items => {
            let settings: IAppSettings;
            if (items.appSettings)
            {
                settings = items.appSettings;
            }
            else
            {
                settings = getDefaultSettings();
                this.saveAppSettings(settings);
            }
    
            callback(settings);
        });
    }

    public saveAppSettings(settings: IAppSettings): void
    {
        chrome.storage.sync.set({
            appSettings: settings
        });
    }
}


function getDefaultSettings(): IAppSettings
{
    return {
        version: "0.1",
        theme: "theme-dark",
        maxRecentPages: 100
    };
}