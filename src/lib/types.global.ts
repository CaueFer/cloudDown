export {};

declare global {
  interface Window {
    electronAPI?: {
      selectFolder: () => Promise<string>;
      getDefaultDownloadPath: () => Promise<string>;
      openFolder: (path: string) => void;
    };
  }
}
