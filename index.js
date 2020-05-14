const plScrape = require('./web-scrape/pl-scraper')
const nbaScrape = require('./web-scrape/nba-scraper')
const fetchReditNews = require('./web-scrape/redit-webscrape')
const { insertScrapedData, fetchAllSheetData, addNewSheet } = require('./google-spreadsheet/spread-sheet')
const { dbInsertMultiData, dbSeed } = require('./database/mysql')

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

function nbaWebScrape() {
    try{
         nbaScrape()
            .then(async res => {
                const sheetName = 'NBA-player-ranking'
                await addNewSheet(sheetName)
                scope = 2
                sheetHeader = ['rank', 'name', 'url', 'score', 'FG', 'Three', 'FT']
                const obj = {header: sheetHeader, data: res}
                insertScrapedData(obj, scope) 
            })
            .catch(err => {
                throw new Error(err)
            })

    }
    catch(err) {
        throw new Error(err)
    }
}

// Web Scraping for dynamic web page
async function reditWebScarpe() {
    try {
        fetchReditNews()
            .then(res => {
                // Scope is reference for choosing spread sheet.
                scope = 0
                sheetHeader = ['title', 'url']
                const obj = {header: sheetHeader, data: res}
                insertScrapedData(obj, scope) 
            })
            .catch(err => {
                throw new Error(err)
            })

    }
    catch(err) {
        throw new Error(err)
    }
}

// Create db and table
async function dbInitialSeed() {
    const dbName = 'web_scrape'
    const stmt = 'CREATE TABLE IF NOT EXISTS test(id int NOT NULL AUTO_INCREMENT, title varchar(255), url varchar(2083), updated_at TIMESTAMP NOT NULL DEFAULT NOW(), created_at TIMESTAMP NOT NULL, PRIMARY KEY(id));'
    dbSeed(dbName, stmt)
}

// Save data from spread sheet
async function saveSheetDataToDB() {
    let data = await fetchAllSheetData()
    let insertData = formatDbData(data)
    let tableName = 'news'
    let stmtInfo = { table: tableName , tableInfo: getTableInfo(data.header)}

    dbInsertMultiData(insertData, stmtInfo);
}

// Spread sheet header and db table columns must be match
function getTableInfo(header) {
    let tableInfo = ''
    header.map(h => tableInfo +=  h + ', ')
    return tableInfo
}

// Format spread sheet data for db table
function formatDbData(data) {
    let dateTime = new Date()
    let insertData = []
    let childData = []
    // Data for db has to be in array which fits for table
    data.rows.map(v => {
        data.header.map(h => childData.push(v[h]))
        // Add updated_at, created_at
        childData.push(dateTime, dateTime)
        insertData.push(childData)
        childData = []
    })
    return insertData
}

// plWebScrape();
// reditWebScarpe();
// dbInitialSeed()
nbaWebScrape()
// saveSheetDataToDB()