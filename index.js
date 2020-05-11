const plScrape = require('./web-scrape/pl-scraper');
const fetchReditNews = require('./web-scrape/redit');
const { insertScrapedData } = require('./google-spreadsheet/spread-sheet');

let scope = 0
let sheetHeader = ''

// Web scrape for static web page
function plWebScrape() {
    plScrape().then(async res => {
        if(res) {
            scope = 1
            sheetHeader = ['rank', 'name', 'nationality', 'goals']
            const obj = {header: sheetHeader, data: res}
            insertScrapedData(obj, scope)
        }
    })
    .catch(err => {
        throw new Error(err)
    })
}

// Web Scraping for dynamic web page
async function reditWebScarpe() {
    try {
        const data = await fetchReditNews();
        if(data) {
            // Scope is reference for choosing spread sheet.
            scope = 0
            sheetHeader = ['title', 'url']
            const obj = {header: sheetHeader, data: data}
            insertScrapedData(obj, scope)
        }
    }
    catch(err) {
        throw new Error(err)
    }
}

// plWebScrape();
reditWebScarpe();