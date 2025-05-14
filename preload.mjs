import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  downloadFilesTo: (urls, targetPath) =>
    ipcRenderer.send("download-files-to", { urls, targetPath }),
  openFolder: (path) => ipcRenderer.send("open-folder", path),
  getDefaultDownloadPath: async () => {
    return await ipcRenderer.invoke("read-config");
  },
  setDefaultDownloadPath: async (newPath) => {
    await await ipcRenderer.invoke("set-config", newPath);
  },
});
