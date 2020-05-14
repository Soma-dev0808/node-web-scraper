const plScrape = require('../web-scrape/pl-scraper')
const nbaScrape = require('../web-scrape/nba-scraper')
const fetchReditNews = require('../web-scrape/redit-webscrape')
const { insertScrapedData, fetchAllSheetData, addNewSheet } = require('../google-spreadsheet/spread-sheet')
const { dbInsertMultiData, dbSeed } = require('../database/mysql')

let scope = 0
let sheetHeader = ''

// You can create sheet by this
async function addSheet(sName) {
    const sheetName = sName
    return await addNewSheet(sheetName)
        .then(res => {
            return res
        })
        .catch(err => {
            throw new Error(err)  
        })
}

// Web scrape for static web page
function plWebScrape() {
    return plScrape()
        .then(async res => {
        if(res) {
            scope = 'soccer_player_ranking'
            sheetHeader = ['rank', 'name', 'nationality', 'goals']
            const obj = {header: sheetHeader, data: res}
            await insertScrapedData(obj, scope)
        }
    })
    .catch(err => {
        throw new Error(err)
    })
}

// Web scrape for dynamic web page
function nbaWebScrape() {
    try{
         return nbaScrape()
            .then(async res => {
                scope = 'nba_player_ranking'
                sheetHeader = ['rank', 'name', 'url', 'score', 'FG', 'Three', 'FT']
                const obj = {header: sheetHeader, data: res}
                await insertScrapedData(obj, scope) 
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
        return fetchReditNews()
            .then(async res => {
                // Scope is reference for choosing spread sheet.
                scope = 'redit_news'
                sheetHeader = ['title', 'url']
                const obj = {header: sheetHeader, data: res}
                await insertScrapedData(obj, scope) 
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
    const stmt1 = 'CREATE TABLE IF NOT EXISTS redit_news(id int NOT NULL AUTO_INCREMENT, title varchar(255), url varchar(2083), updated_at TIMESTAMP NOT NULL DEFAULT NOW(), created_at TIMESTAMP NOT NULL, PRIMARY KEY(id));'
    const stmt2 = 'CREATE TABLE IF NOT EXISTS nba_player_ranking(id int NOT NULL AUTO_INCREMENT, rank int(11), name varchar(255), url varchar(2083), score int(11), FG int(11), Three int(11), FT int(11), updated_at TIMESTAMP NOT NULL DEFAULT NOW(), created_at TIMESTAMP NOT NULL, PRIMARY KEY(id));'
    const stmt3 = 'CREATE TABLE IF NOT EXISTS soccer_player_ranking(id int NOT NULL AUTO_INCREMENT, rank int(11), name varchar(255), nationality varchar(255), goals int(11), updated_at TIMESTAMP NOT NULL DEFAULT NOW(), created_at TIMESTAMP NOT NULL, PRIMARY KEY(id));'

    dbSeed(dbName, [stmt1, stmt2, stmt3])
}

// Save data from spread sheet
async function saveSheetDataToDB(scope) {
    let data = await fetchAllSheetData(scope)
    let insertData = formatDbData(data)
    let tableName = scope
    let stmtInfo = { table: tableName , tableInfo: getTableInfo(data.header)}

    await dbInsertMultiData(insertData, stmtInfo);
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


module.exports = {
    addSheet,
    plWebScrape,
    reditWebScarpe,
    dbInitialSeed,
    nbaWebScrape,
    saveSheetDataToDB
}