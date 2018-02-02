const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


/* global __dirname */
/* global process */

var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var storage = require('./storage');

// Report crashes to our server.
require('crash-reporter').start();

var argv = process.argv;

var openFile;

if (process.platform !== 'darwin') {
  openFile = process.argv[1];
}

app.on('open-file', function (event, path) {
    event.preventDefault();
    openFile = path;
    if (mainWindow) {
      mainWindow.webContents.executeJavaScript('loadFile(' + JSON.stringify(path) + ')');
    }
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

var init = function() {
  var lastWindowState = storage.get('lastWindowState');
  if (lastWindowState === null) {
    lastWindowState = {
      width: 1200,
      height: 600,
      maximized: false 
    }; 
  }
  
  mainWindow = new BrowserWindow({
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width, 
    height: lastWindowState.height,
    icon: __dirname + '/squiffy.png'
  });
  
  if (lastWindowState.maximized) {
    mainWindow.maximize();
  }

  mainWindow.openFile = openFile;

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/desktop.html');
  
  mainWindow.on('close', function () {
    var bounds = mainWindow.getBounds(); 
    storage.set('lastWindowState', {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      maximized: mainWindow.isMaximized()
    });
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// Quit when all windows are closed, except on OS X.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// On OS X, this is called when the app is running in the Dock with no open windows.
app.on('activate-with-no-open-windows', init);

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', init);