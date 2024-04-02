import express from "express";
import puppeteer from "puppeteer-core";
import bodyParser from "body-parser";

const port = 3000;

const app = express();
app.use(bodyParser.json());

app.post("/pdf/generation", (req, res) => {
  console.log("/report/generation ==== ", req.body);

  res.end();

  generatePDF(req.body);
});

type Action = {
  targetUrl: string;
  filename: string;
};

const generatePDF = async (action: Action) => {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    timeout: 0,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const page = await browser.newPage();

    page.on("console", (msg) => {
      console.log(`[Page Console] ${msg.type().toUpperCase()}: ${msg.text()}`);
    });

    await page.exposeFunction("onCustomEvent", async () => {
      console.log(`Event fired`);
      await page.pdf({
        path: `/app/report-files/${action.filename}`,
        format: "A4",
        timeout: 0,
      });

      await page.close();

      // setTimeout(async () => {  
      //   await browser.close();
      //   console.log("Browser closed");
      // }, 1000);
    });

    await page.evaluateOnNewDocument(() => {
      window.addEventListener("status", () => {
        window["onCustomEvent"]();
      });
    });

    await page.goto(`${action.targetUrl}`, {
      waitUntil: "networkidle0",
      timeout: 0,
    });
  } catch (e) {
    console.error(e);
  }
};

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
