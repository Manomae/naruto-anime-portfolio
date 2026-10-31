import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// @ts-ignore
import { runEMAgent } from '../../dist/engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let currentWorkspace: string = process.cwd();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'EM Agent Desktop',
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
  
  mainWindow.loadURL(devUrl).catch(() => {
    setTimeout(() => {
      mainWindow?.loadURL(devUrl);
    }, 1000);
  });
}

// IPC Handlers
ipcMain.handle('select-workspace', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (!result.canceled && result.filePaths.length > 0) {
    currentWorkspace = result.filePaths[0];
  }
  return currentWorkspace;
});

ipcMain.handle('get-workspace', () => currentWorkspace);

ipcMain.handle('run-task', async (_, { task, provider, model }) => {
  try {
    await runEMAgent({
      task,
      workspaceDir: currentWorkspace,
      provider,
      modelName: model,
    });
    return `Tarefa "${task}" executada com sucesso!`;
  } catch (error: any) {
    throw new Error(error.message);
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});