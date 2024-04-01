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
  let browser;

  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await exposeCustomEvent(page);

    await page.goto(action.targetUrl, { waitUntil: "networkidle0" });
    console.log("Page navigation completed");

    // Handle custom event to trigger PDF generation
    page.on("status", async () => {
      console.log("Custom event 'status' received");
      await generatePDFFromPage(page, action.filename);
    });
  } catch (e) {
    console.error("Error during PDF generation:", e);
  } finally {
    if (browser) {
      await browser.close();
      console.log("Browser closed");
    }
  }
};

const launchBrowser = async () => {
  return await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    timeout: 0,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
};

const exposeCustomEvent = async (page) => {
  await page.exposeFunction("onCustomEvent", async () => {
    console.log("Custom event 'onCustomEvent' fired");
    await page.evaluate(() => window["onCustomEvent"]());
  });
};

const generatePDFFromPage = async (page, filename) => {
  const pdfPath = `/app/report-files/${filename}`;
  console.log("Generating PDF:", pdfPath);
  await page.pdf({ path: pdfPath, format: "A4", timeout: 0 });
  console.log("PDF generated successfully");
};


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
