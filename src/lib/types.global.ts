export {};

type downloadPathResponse = {
  defaultDownloadPath: string;
};
declare global {
  interface Window {
    electronAPI?: {
      selectFolder: () => Promise<string>;
      openFolder: (path: string) => void;
      getDefaultDownloadPath: () => Promise<downloadPathResponse>;
      setDefaultDownloadPath: (
        newPath: string
      ) => Promise<downloadPathResponse>;
    };
  }
}
