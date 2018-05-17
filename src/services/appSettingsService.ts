const VERSION = "0.2";

export interface IAppSettings
{
    version: string;
    theme: string;
    maxRecentPages: number;
    maxRecentHours: number;
}

export interface IAppSettingsService
{
    getAppSettings(callback: (settings: IAppSettings) => any): void;
    saveAppSettings(settings: IAppSettings): void;
}

abstract class BaseAppSettingsService implements IAppSettingsService
{
    abstract getAppSettings(callback: (settings: IAppSettings) => any): void;
    abstract saveAppSettings(settings: IAppSettings): void;

    protected upgradeSettings(settings: any): IAppSettings
    {
        if (settings.version !== VERSION)
        {
            const dflt: any = getDefaultSettings();
            for (let i in dflt)
            {
                if (!settings[i])
                {
                    //console.log("Adding setting: " + i);
                    settings[i] = dflt[i];
                }
            }
            this.saveAppSettings(settings);
        }
    
        return settings;
    }
}

export class TestAppSettingsService extends BaseAppSettingsService
{
    public getAppSettings(callback: (settings: IAppSettings) => any): void
    {
        let appSettings: IAppSettings;
        let json = localStorage.getItem("appSettings");
        if (json)
        {
            appSettings = this.upgradeSettings(JSON.parse(json));
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

export class ChromeAppSettingsService extends BaseAppSettingsService
{
    public getAppSettings(callback: (settings: IAppSettings) => any): void
    {
        chrome.storage.sync.get(items => {
            let settings: IAppSettings;
            if (items.appSettings)
            {
                settings = this.upgradeSettings(items.appSettings);
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
        version: VERSION,
        theme: "theme-dark",
        maxRecentPages: 100,
        maxRecentHours: 24
    };
}
