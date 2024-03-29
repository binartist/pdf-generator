const express = require('express')
const puppeteer = require("puppeteer");
const http = require("http");
const querystring = require("querystring");
const url = require("url");
const bodyParser = require('body-parser')
const port = 3000;

const app = express();
app.use(bodyParser.json())

app.post("/pdf/generation", (req, res)=> {
  console.log("/report/generation ==== ", req.body)

  res.end()

  generatePDF(req.body)
})

type Action = {
  targetUrl: string
  filename: string
}

const generatePDF = async (action: Action) => {
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const page = await browser.newPage();

    await page.exposeFunction("onCustomEvent", async () => {
      console.log(`Event fired`);
      await page.pdf({
        path: `/var/report-files/${action.filename}`,
        format: "A4",
      });
      await browser.close();
    });

    await page.evaluateOnNewDocument(() => {
      window.addEventListener("status", () => {
        window["onCustomEvent"]();
      });
    });

    await page
      .goto(`${action.targetUrl}`, {
        waitUntil: "networkidle0",
      })
      .catch((e) => {
        console.log(e);
      });
  } catch (e) {
    console.error(e);
  }
};

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})