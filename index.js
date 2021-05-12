const { createWindow } = require('./main_app.js')
const { app, ipcRenderer } = require('electron')
require('./models/conexao')
app.allowRendererProcessReuse = false
app.on('ready', createWindow)
app.on('window-all-close', () => {
    if (process.platform !== 'darwin'){

        
    } 
})
app.on('activate', () => {
    if (mainWindow === null) createWindow()
})