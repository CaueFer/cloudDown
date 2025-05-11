/* eslint-disable @typescript-eslint/no-require-imports */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  downloadFilesTo: (urls, targetPath) =>
    ipcRenderer.send("download-files-to", { urls, targetPath }),
});

contextBridge.exposeInMainWorld("electronAPI", {
  selectFolder: () => ipcRenderer.invoke("dialog:selectFolder"),
});
