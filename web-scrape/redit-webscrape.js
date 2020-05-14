const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { isEmpty } = require('../utils/helpers');

function fetchReditNews() {
    const url = 'https://www.reddit.com/r/news/';

    return puppeteer
        .launch()
        .then(browser => browser.newPage())
        .then(page => {
            return page.goto(url)
                    .then(function(){
                        return page.content();
                    })
        })
        .then(html => {
            const $ = cheerio.load(html)
            const newsHeadLines = []
            $('a[href*="/r/news/comments"]').each(function() {
                const title = $(this).find('div > h3').text();
                let url = $(this).attr('href');
                if(!isEmpty(title)) {
                    newsHeadLines.push({
                        title: title,
                        url: 'https://www.reddit.com' + url
                    })
                }
            })

            return newsHeadLines;
        })
        .catch(err => {
            throw new Error(err)
        })
}

module.exports = fetchReditNews;
