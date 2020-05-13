const mysql = require('mysql')
const config = require('./config')
const con = mysql.createConnection(config)

// Add multiple data into Data base
function dbInsertMultiData(data, stmtInfo) {
    con.connect(function(err) {
        if(err) throw err

        let stmt = 'INSERT INTO ' + stmtInfo.table + '(' + stmtInfo.tableInfo + 'updated_at, created_at) VALUES?'
        let dbName = 'web_scrape'
        
        con.query('USE ' + dbName)
        con.query(stmt, [data], (err, res, fields) => {
            if(err) {
                throw new Error(err)
            }
            console.log(res)
        })
        con.end()
    });
}

// Initialize database and create table
function dbSeed(dbName, stmt) {
    con.connect(function(err) {
        if(err) throw err
        con.query('CREATE DATABASE IF NOT EXISTS ' + dbName)
        con.query('USE ' + dbName)
        con.query(stmt, function(err,res,fields) {
            if(err) {
                throw new Error(err)
            }
            console.log(res)
        })
        con.end();
    });
}

module.exports = { dbInsertMultiData, dbSeed }

