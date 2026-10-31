import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('emAgentAPI', {
    selectWorkspace: () => ipcRenderer.invoke('select-workspace'),
    getWorkspace: () => ipcRenderer.invoke('get-workspace'),
    runTask: (task, provider, model) => ipcRenderer.invoke('run-task', { task, provider, model }),
});
