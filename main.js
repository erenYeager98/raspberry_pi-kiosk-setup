const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');
}

ipcMain.handle('run-command', async (_, which) => {
  let cmd;
  switch (which) {
    case 'reboot-pi':
      cmd = 'sudo cp /home/eren/config.txt /boot/firmware/config.txt && sudo reboot';
      break;
    case 'launch':
      cmd = ' chromium-browser --start-maximized   --noerrdialogs   --disable-infobars   --disable-session-crashed-bubble   --autoplay-policy=no-user-gesture-required --app=https://erenyeager-dk.live > /dev/null 2>&1 & sleep 1 && pkill robo-kiosk';
      break;
    case 'revert':
      cmd = 'sudo cp /home/eren/config_mod.txt /boot/firmware/config.txt && sudo reboot';
      break;
    default:
      cmd = 'echo "Unknown Command"';
  }

  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) reject(stderr);
      else resolve(stdout);
    });
  });
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
