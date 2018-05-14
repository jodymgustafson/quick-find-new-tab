chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set(getDefaultSettings(), () => console.log("Extension installed"));
});

function getDefaultSettings()
{
    return {
        version: "0.1"
    };
}