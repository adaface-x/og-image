const puppeteer = require("puppeteer");
const templates = require("../utils/templates");
const { queueFunction } = require("../utils/queueApi");
process.setMaxListeners(Infinity);

const generateScreenshotUsingPuppeteer = async ({
    template = "og-image",
    data = {
        name: "",
        tags: [""],
        authorName: "",
        title: "",
        emoji: "",
        profilePicture: "",
    },
}) =>
    await queueFunction(
        "generateScreenshotUsingPuppeteerQueue",
        async () => {
            let browser;
            try {
                console.log("generateScreenshotUsingPuppeteer", template, data);
                browser = await puppeteer.launch({
                    args: [
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--disable-dev-profile",
                        "--disable-dev-shm-usage",
                    ],
                    headless: "new",
                });
                const html = templates[template].html(data);
                const page = await browser.newPage();

                await page.setViewport({
                    width: 1200,
                    height: 630,
                    deviceScaleFactor: 0,
                });
                await page.setContent(html, { waitUntil: "domcontentloaded" });

                await page.evaluate(async () => {
                    const selectors = Array.from(
                        document.querySelectorAll("img")
                    );
                    await Promise.all([
                        document.fonts.ready,
                        ...selectors.map((img) => {
                            // Image has already finished loading, let's see if it worked
                            if (img.complete) {
                                // Image loaded and has presence
                                if (img.naturalHeight !== 0) return;
                                // Image failed, so it has no height
                                throw new Error("Image failed to load");
                            }
                            // Image hasn't loaded yet, added an event listener to know when it does
                            return new Promise((resolve, reject) => {
                                img.addEventListener("load", resolve);
                                img.addEventListener("error", reject);
                            });
                        }),
                    ]);
                });

                await page.waitForSelector(`#${template}`);
                const element = await page.$(`#${template}`);
                const screenshotBuffer = await element.screenshot({
                    fullPage: false,
                    captureBeyondViewport: false,
                    type: "png",
                });

                await page.close();
                return screenshotBuffer;
            } catch (err) {
                console.error(err);
                throw err;
            } finally {
                if (browser) {
                    await browser.close();
                }
            }
        },
        3
    );

module.exports = { generateScreenshotUsingPuppeteer };
