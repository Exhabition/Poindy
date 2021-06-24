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
};

ipcMain.on("selectImage", async (event, fileFilters, type) => {
    console.log(event);
    console.log(fileFilters);

    dialog.showOpenDialog({
        title: "Select a static image",
        properties: ["openFile"],
        filters: fileFilters,
    }).then(function (response) {
        if (!response.canceled) {
            // handle fully qualified file name
            console.log(response.filePaths[0]);
            currentPaths[type] = response.filePaths[0];
        } else {
            console.log("no file selected");
        }
    });
});

ipcMain.on("generateGifImage", async (event) => {
    console.log("generataergetfbnhg");
    if (currentPaths.static && currentPaths.dynamic) {
        generateGifImage(currentPaths.static, currentPaths.dynamic, 1);
    }
});