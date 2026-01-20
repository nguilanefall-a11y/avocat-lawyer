const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

// Environment check
const IS_PRODUCTION = process.env.NODE_ENV === 'production' || process.env.VERCEL;

let puppeteer;
let chromium;

if (IS_PRODUCTION) {
    // Vercel / Production
    puppeteer = require('puppeteer-core');
    chromium = require('@sparticuz/chromium');
} else {
    // Local Development
    puppeteer = require('puppeteer');
}

exports.generatePdf = async (templateName, data) => {
    try {
        // 1. Load Template
        const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
        const templateHtml = fs.readFileSync(templatePath, 'utf8');

        // 2. Compile
        const template = handlebars.compile(templateHtml);
        const html = template(data);

        // 3. Browser Config
        let browser;
        if (IS_PRODUCTION) {
            browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
                ignoreHTTPSErrors: true
            });
        } else {
            console.log("Launching Local Puppeteer");
            browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox']
            });
        }

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
        });

        await browser.close();
        return pdfBuffer;

    } catch (error) {
        console.error("PDF Gen Error:", error);
        throw error;
    }
};
