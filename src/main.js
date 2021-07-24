const { app, dialog, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const generateGifImage = require("../src/images");

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

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

const currentPaths = {
    static: null,
    dynamic: null,
    loops: 1,
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
        currentPaths[type] = response.filePaths[0];
    } else {
        console.log("no file selected");
    }

    console.log("done, returning", currentPaths[type]);

    return currentPaths[type];
});

ipcMain.handle("generateGifImage", async (event) => {
    console.log("generataergetfbnhg");
    if (currentPaths.static && currentPaths.dynamic) {
        generateGifImage(currentPaths.static, currentPaths.dynamic, 1);
    }
});

ipcMain.handle("getCurrentInfo", async (event) => currentPaths);