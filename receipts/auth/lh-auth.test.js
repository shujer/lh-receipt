const fs = require("fs");
const puppeteer = require("puppeteer");
const lighthouse = require("lighthouse");
const CONFIGS = require("./configs");

/**
 * @description login
 * @param {import('puppeteer').Browser} browser
 */
const loginBeforeRun = async (browser) => {
  const page = await browser.newPage();
  await page.goto(CONFIGS.LOGIN_URL, {
    waitUntil: "networkidle0",
  });
  await page.type("input[type=text]", CONFIGS.USERNAME);
  await page.type("input[type=password]", CONFIGS.PASSWORD);
  await page.screenshot({
    path: "./receipts/screenshots/auth_login_form.png",
  });
  await Promise.all([
    page.click(".xiao-button"),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);
  await page.screenshot({ path: "./receipts/screenshots/auth_redirect.png" });
  await page.close();
};

const CHROME_DEBUG_PORT = 8042;

const runLighthouse = async (url) => {
  const options = {
    logLevel: "info",
    output: "html",
    onlyCategories: ["performance", "best-practices"],
    port: CHROME_DEBUG_PORT,
    preset: "desktop",
    disableStorageReset: true,
  };
  const runnerResult = await lighthouse(url, options);
  const reportHtml = runnerResult.report;
  fs.writeFileSync("lhreport.html", reportHtml);
};

describe("Auth", () => {
  /** @type {import('puppeteer').Browser} */
  let browser;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: [`--remote-debugging-port=${CHROME_DEBUG_PORT}`],
      headless: !process.env.DEBUG,
      slowMo: process.env.DEBUG ? 50 : undefined,
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  it("lighthouse", async () => {
    await loginBeforeRun(browser);
    await runLighthouse(CONFIGS.TARGET_URL);
  });
});
