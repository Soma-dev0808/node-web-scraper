const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

function nbaScrape() {
    const url = 'https://stats.nba.com/leaders/'

    return puppeteer
    .launch()
    .then(browser => browser.newPage())
    .then(page => {
        return page.goto(url)
            .then(function() {
                return page.content()
            })
    })
    .then(html => {
        const $ = cheerio.load(html)
        const playerStats = []
        const statusTable = $('.nba-stat-table > .nba-stat-table__overflow > table > tbody > tr')
        statusTable.each(function() {
            
            const playerName = $(this).find('.player > a').text()
            const playerUrl = $(this).find('.player > a').attr('href')
            const playerRank = $(this).find('td').eq(0).text()
            const playeAvgScore = $(this).find('td').eq(4).text()
            const playerAvgFg = $(this).find('td').eq(7).text()
            const playeAvgThree = $(this).find('td').eq(10).text()
            const playeAvgFt = $(this).find('td').eq(13).text()

            playerStats.push({
                rank: playerRank,
                name: playerName,
                url: 'https://stats.nba.com' + playerUrl,
                score: playeAvgScore,
                FG: playerAvgFg,
                Three: playeAvgThree,
                FT: playeAvgFt
            })
        })
        return playerStats
    })
    .catch(err => {
        throw new Error(err)
    })
}

module.exports = nbaScrape
