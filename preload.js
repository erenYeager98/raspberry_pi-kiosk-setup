const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  runCommand: (which) => ipcRenderer.invoke('run-command', which),
});
