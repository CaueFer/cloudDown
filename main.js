import { app, BrowserWindow, Tray, Menu, screen } from "electron";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    frame: false,
    transparent: true,
    show: false, // Start show
    skipTaskbar: true, // Hide from taskbar
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
    resizable: false
  });

  mainWindow.loadURL("http://localhost:3000");

  mainWindow.webContents.on("did-fail-load", () => {
    console.error("Failed to load http://localhost:3000");

    mainWindow.loadFile(join(__dirname, "public", "fallback.html"));
  });

  // mainWindow.on("blur", () => {
  //   mainWindow.hide();
  // });

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

  positionWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
