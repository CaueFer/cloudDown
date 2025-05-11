import { contextBridge, ipcRenderer } from "electron";

import path from "path";
import os from "os";

contextBridge.exposeInMainWorld("electronAPI", {
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  downloadFilesTo: (urls, targetPath) =>
    ipcRenderer.send("download-files-to", { urls, targetPath }),
  getDefaultDownloadPath: async () => {
    return path.join(os.homedir(), "Downloads");
  },
  openFolder: (path) => ipcRenderer.send("open-folder", path),
});
