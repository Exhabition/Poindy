const { app, dialog, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const generateGifImage = require("../src/images");

function createWindow() {
    const mainWindow = new BrowserWindow({
        show: false,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.maximize();
    mainWindow.show();

    mainWindow.webContents.openDevTools();

    mainWindow.loadFile(path.join(__dirname, "../assets/index.html"));
    mainWindow.setIcon(path.join(__dirname, "../assets/images/favicon.png"));
    mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

const currentSettings = {
    static: null,
    dynamic: null,
    loops: 1,
    save: "./results",
};

ipcMain.handle("selectImage", async (event, fileFilters, type) => {
    const response = await dialog.showOpenDialog({
        title: "Select a static image",
        properties: ["openFile"],
        filters: fileFilters,
    }).catch(error => console.error(error));

    if (!response.canceled) {
        // handle fully qualified file name
        console.log(response.filePaths[0]);
        currentSettings[type] = response.filePaths[0];
    } else {
        console.log("no file selected");
    }

    console.log("done, returning", currentSettings[type]);

    return currentSettings[type];
});

ipcMain.handle("changeSaveLocation", async (event) => {
    const response = await dialog.showOpenDialog({
        title: "Select a save location",
        properties: ["openDirectory"],
    }).catch(error => console.error(error));

    if (!response.canceled) {
        console.log(response);
        // handle fully qualified file name
        console.log(response.filePaths[0]);
        currentSettings.save = response.filePaths[0];
    } else {
        console.log("no file selected");
    }

    return currentSettings.save;
});

ipcMain.handle("addOptionalStat", async (event, toSaveKey, toSaveValue) => {
    console.log("adding", toSaveKey, "as", toSaveValue);
    currentSettings[toSaveKey] = toSaveValue;
});

ipcMain.handle("getCurrentInfo", async (event) => currentSettings);

ipcMain.handle("generateGifImage", async (event) => {
    if (currentSettings.static && currentSettings.dynamic) {
        generateGifImage(currentSettings);
    }
});