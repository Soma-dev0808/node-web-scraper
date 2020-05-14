const { GoogleSpreadsheet } = require('google-spreadsheet');
const dotenv = require('dotenv');
dotenv.config()

let doc = null
let sheet = null
let sheetHeader = null

// Load sheet info by sheet id from spread sheet url
async function googleFetchInfo() {
    doc = new GoogleSpreadsheet(process.env.SPREAD_SHEET);
    try {
        await doc.useServiceAccountAuth(require('../client_secret.json'))
        await doc.loadInfo();
    }
    catch (err) {
        throw new Error(err)
    }
}

//Add new sheet
async function addNewSheet(title) {
    await googleFetchInfo()
    await doc.addSheet({title: title}) 
}

// Load sheet by index of rows
async function loadSheetByIndex(index = 0) {
    try {
        sheet = doc.sheetsByIndex[index];
    }
    catch(err) {
        throw new Error(err)
    }
}

// Load sheet by sheet id in sheet's url
async function loadSheetById(id) {
    try {
        sheet = doc.sheetsById[id]
    }
    catch(err) {
        throw new Error(err)
    }
}

// Set sheet header. If there's already sheet header, it will update the header
async function setSheetHeader(header) {
    sheetHeader = header
    await sheet.setHeaderRow(sheetHeader)
}

//  Add single data into sheet
async function addData(data) {
    try {
        await sheet.addRow(data)
        const rows = await sheet.getRows();
        rows.map((v) => {
            sheetHeader.map(s => {
                console.log(v[s])
            })  
        })
        
    }
    catch(err) {
        throw new Error(err)
    }
}

//  Add multiple data into sheet
async function addMultipleData(data) {
    try {        
        // The data insert must be array
        await sheet.addRows(data)
        const rows = await sheet.getRows();
        rows.map((v) => {
            sheetHeader.map(s => {
                console.log(v[s])
            })          
        })
        
    }
    catch(err) {
        throw new Error(err)
    }
}

// Fetch all rows from spread sheet by specifying sheet index
async function fetchAllSheetData(scope = 0) {
    await googleFetchInfo()
    await loadSheetByIndex(scope)
    try {
        const rows = await sheet.getRows();
        // This woll populate sheet.headerValues
        await sheet.loadHeaderRow();
        const header = sheet.headerValues
        return {rows, header}
    }
    catch (err) {
        throw new Error(err)
    }
    
}

// Insert Scraped data into sheet
async function insertScrapedData(obj, scope = 0) {
    try {
        await googleFetchInfo()
        await loadSheetByIndex(scope)
        await setSheetHeader(obj.header)
        await addMultipleData(obj.data)
    }
    catch(err) {
        throw new Error(err)
    }
}

module.exports = { 
    googleFetchInfo,
    addNewSheet,
    loadSheetByIndex, 
    loadSheetById, 
    setSheetHeader, 
    addData, 
    fetchAllSheetData, 
    insertScrapedData
}