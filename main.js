const { app, dialog, BrowserWindow } = require("electron");
const path = require("path");
const ipcMain = require("electron").ipcMain;

const chromePaths = require("chrome-paths");
const chromepath = chromePaths.chrome;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1270,
    height: 820,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadFile("index.html");
  mainWindow.setMenu(null);
};

app.whenReady().then(async () => {
  await createMainWindow();
  app.on("activate", function () {});
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

//receive ipc
ipcMain.on("test", function (event, ...arg) {
  test();
});

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

async function test() {
  puppeteer.launch({ headless: false, executablePath: chromepath }).then(async (browser) => {
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });
    await page.goto("https://bot.sannysoft.com");
    await browser.close();
  });
}

//run puppeteer
// async function test() {
//   let page;
//   let browser;
//   browser = await puppeteer
//     .launch({ headless: false, executablePath: chromepath })
//     .catch(function (error) {
//       console.log(error);
//     });
//   page = await browser.newPage();
//   await page.setViewport({ width: 800, height: 600 });

//   await page.goto("https://bot.sannysoft.com");
//   await page.waitForTimeout(3000);
//   await browser.close();
// }