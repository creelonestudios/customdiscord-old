const { app, BrowserWindow, Menu, ipcMain } = require("electron");

process.env.NODE_ENV = "development";

app.whenReady().then(() => {

    const window = new BrowserWindow({
        width: 1200,
        height: 1000,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false
        }
    });

    window.on('closed', function(){
        app.quit();
    });

    window.loadFile("page/app/app.html"); // neeto find a better way to do this instead of needing to copy this into the page folder ../ wont work
});