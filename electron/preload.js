const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('udoNativeDesktop', {
  isNativeApp: true,
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  platform: process.platform,
  version: '2.0.0-PROD'
});
