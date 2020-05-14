const express = require('express')
const app = express()
const {
    addSheet,
    plWebScrape,
    nbaWebScrape,
    reditWebScarpe,
    dbInitialSeed,
    saveSheetDataToDB
} = require('./service/service')

const port = process.env.PORT || 8080;
const scope = ['redit_news', 'soccer_player_ranking', 'nba_player_ranking']

app.listen(port, () => {
    console.log('Listening port' , port)
})

app.get('/', (res, req) => {
    console.log('accessed')
})

// Add db tables first before save data into db
app.get('/db-seed', async (req, res) => {
    try {
        await dbInitialSeed()
        res.json({
            status : 'Success fully seeded!!'
        })
    }
    catch(err) {
        res.json({
            status: 'Error'
        })
        throw new Error(err)
    }
})

// add sheet before web scraping 
app.get('/add-sheeet/:scope', async (req, res) => {
    try {
        // scope: 0. news, 1. soccer, 2. nba
        const scopeIndex = req.params.scope
        if(scopeIndex >= 3) {
            res.json({
                status: 'Error'
            })
        }
        await addSheet(scope[scopeIndex])
        res.json({
            status: 'Success fully Sheet added!!',
        })
    }
    catch(err) {
        res.json({
            status: 'Error'
        })
        throw new Error(err)
    }
})

// Web scrape for redit news 
app.get('/redit-news', async (req, res) => {
    try {
        await reditWebScarpe()
        res.json({
            status : 'Success fully scraped!!'
        })
    }
    catch(err) {
        res.json({
            status: 'Error'
        })
        throw new Error(err)
    }
})

// Web scrape for soccer player ranking
app.get('/soccer', async (req, res) => {
    try {
        await plWebScrape()
        res.json({
            status : 'Success fully scraped!!'
        })
    }
    catch(err) {
        res.json({
            status: 'Error'
        })
        throw new Error(err)
    }
})

// Web scrape for nba player ranking
app.get('/nba', async (req, res) => {
    try {
        await nbaWebScrape()
        res.json({
            status : 'Success fully scraped!!'
        })
    }
    catch(err) {
        res.json({
            status: 'Error'
        })
        throw new Error(err)
    }
})

// insert web scraped data from sprad sheet
app.get('/db-insert/:scope', async (req, res) => {
    try {
        // scope: 0. news, 1. soccer, 2. nba
        const scopeIndex = req.params.scope
        if(scopeIndex >= 3) {
            res.json({
                status: 'Error'
            })
            return
        }
        await saveSheetDataToDB(scope[scopeIndex])
        res.json({
            status : 'Success fully inserted!!'
        })
    }
    catch(err) {
        res.json({
            status: 'Error'
        })
        throw new Error(err)
    }
})
