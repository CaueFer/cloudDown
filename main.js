import {
  app,
  BrowserWindow,
  Tray,
  Menu,
  screen,
  ipcMain,
  dialog,
  shell,
} from "electron";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import * as fs from "node:fs";
import http from "node:http";
import https from "https";
import path from "path";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// PATH para configs do usuario
const configPath = path.join(app.getPath("userData"), "config.json");

let mainWindow;
let tray;

const windowWidth = 300;
const windowHeight = 500;

const positionWindow = () => {
  const trayBounds = tray.getBounds();
  const { x, y, width, height } = trayBounds;

  const nearestDisplay = screen.getDisplayNearestPoint({ x, y });
  const { bounds: screenBounds } = nearestDisplay;
  const screenHeight = screenBounds.height;
  const screenWidth = screenBounds.width;

  const isTaskbarTop = y < screenHeight / 2;

  let windowX = Math.round(x + width / 2 - windowWidth / 2);
  let windowY = isTaskbarTop ? y + height + 5 : y - windowHeight - 5;

  windowX = Math.max(0, Math.min(windowX, screenWidth - windowWidth));
  windowY = Math.max(0, Math.min(windowY, screenHeight - windowHeight));

  mainWindow.setBounds({
    x: windowX,
    y: windowY,
    width: windowWidth,
    height: windowHeight,
  });
};

function readConfig() {
  try {
    const data = fs.readFileSync(configPath, {
      encoding: "utf8",
    });
    const config = JSON.parse(data);
    return config;
  } catch (err) {
    console.error(err);
    return { defaultDownloadPath: path.join(os.homedir(), "Downloads") };
  }
}

function writeConfig(config) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to write config:", error);
  }
}

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    frame: false,
    transparent: true,
    show: false, // Show on start
    skipTaskbar: true, // Hide from taskbar
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    resizable: false,
  });

  mainWindow.loadURL("http://localhost:3000");
  // mainWindow.webContents.openDevTools();

  mainWindow.webContents.on("did-fail-load", () => {
    console.error("Failed to load http://localhost:3000");

    mainWindow.loadFile(join(__dirname, "public", "fallback.html"));
  });

  try {
    tray = new Tray(join(__dirname, "public", "icon.png"));
  } catch (error) {
    console.error("Failed to create tray:", error);
    app.quit();
    return;
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Mostrar",
      click: () => {
        positionWindow();
        mainWindow.show();
      },
    },
    { label: "Sair", click: () => app.quit() },
  ]);

  tray.setToolTip("CloudDown");
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      positionWindow();
      mainWindow.show();
    }
  });

  ipcMain.handle("select-folder", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  });

  ipcMain.handle("read-config", () => {
    const config = readConfig();

    return { defaultDownloadPath: config.defaultDownloadPath };
  });

  ipcMain.handle("set-config", (event, newPath) => {
    const config = readConfig();
    config.defaultDownloadPath = newPath;
    writeConfig(config);
    return { defaultDownloadPath: config.defaultDownloadPath };
  });

  ipcMain.on("open-folder", (event, path) => {
    shell.openPath(path);
  });

  ipcMain.on("download-files-to", (event, { urls, targetPath }) => {
    urls.forEach((url) => {
      const fileName = path.basename(new URL(url).pathname);
      const filePath = path.join(targetPath, fileName);
      const fileStream = fs.createWriteStream(filePath);

      const protocol = url.startsWith("https") ? https : http;

      protocol
        .get(url, (response) => {
          if (response.statusCode === 200) {
            response.pipe(fileStream);
            fileStream.on("finish", () => {
              fileStream.close();
              console.log(`Baixado em: ${filePath}`);
            });
          } else {
            console.error(`Erro ao baixar ${url}: ${response.statusCode}`);
          }
        })
        .on("error", (err) => {
          console.error(`Erro: ${err.message}`);
        });
    });
  });

  positionWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
