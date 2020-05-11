const axios = require('axios');
const cheerio = require('cheerio');


function plScrape() {
    const url = 'https://www.premierleague.com/stats/top/players/goals?se=-1&cl=-1&iso=-1&po=-1?se=-1';

    return axios(url)
        .then(res => {
            const html = res.data;
            const $ = cheerio.load(html);
            const statusTable = $('.statsTableContainer > tr');
            const topPremierLeagueScorers = []
            statusTable.each(function(){
                const rank = $(this).find('.rank > strong').text();
                const playerName = $(this).find('.playerName > strong').text();
                const nationality = $(this).find('.playerCountry').text();
                const goals = $(this).find('.mainStat').text();
    
                topPremierLeagueScorers.push({
                    rank: rank,
                    name: playerName,
                    nationality: nationality,
                    goals: goals,
                })
            })
    
            return topPremierLeagueScorers;
    
        })
        .catch(err => console.log(err))
}

module.exports = plScrape;
