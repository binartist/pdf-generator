const puppeteer = require('puppeteer');
const http = require('http');
const querystring = require('querystring');
const url = require('url');
const port = 3000;

http.createServer((request, response) => {
  request.on('error', (err) => {
    console.error(err);
    response.statusCode = 400;
    response.end();
  });
  response.on('error', (err) => {
    console.error(err);
  });

console.log(request.url)  
  const myUrl = url.parse(request.url);
  if (request.method === 'GET' && myUrl.pathname.includes('/report/generation')) {
      const query = querystring.parse(myUrl.query);
      response.end(JSON.stringify(query));

      generateReport(query['date']);
    
  } else {
    // response.statusCode = 404;
    response.end('Salut, il n\'y a rien!');
  }
}).listen(port, () => {
  console.log(`Server is running ${port}`);
});

const generateReport = async (date) => {
  const browser = await puppeteer.launch({args: [ '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',]});
  // const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  await page.exposeFunction('onCustomEvent', async ({ type, detail }) => {
    await page.pdf({ path: `/var/report-file/report-${date}.pdf`, format: 'A4' });
    await browser.close();
    console.log(`Event fired: ${type}, detail: ${detail}`);
  });

  await page.evaluateOnNewDocument(() => {
    window.addEventListener('status', ({ type, detail }) => {
      window.onCustomEvent({ type, detail });
    });
  });

  await page.goto(`https://swag/report?date=${date}&open_in=headless-browser`, { waitUntil: 'networkidle2' }).catch(e=> {
    console.log(e)
  });
  // await page.goto(`http://localhost:8080?date=${date}`, { waitUntil: 'networkidle2' });
};
