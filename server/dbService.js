const Database = require('better-sqlite3');
// const db = new Database('../demo-scraper/database.db', {verbose: console.log});
const db = new Database('../demo-scraper/database.db');


function getLgStats(){
    const statement = db.prepare("SELECT games.demo_name, stats.eb_fired, stats.eb_hit FROM games INNER JOIN stats ON games.game_id == stats.id");
    const data = statement.all();
    // statement.all returns all rows, statement.get() only does 1
    return data;
}

function getMainStats(){
    const lgStats = db.prepare("SELECT games.demo_name, stats.lg_fired, stats.lg_hit FROM games INNER JOIN stats ON games.game_id == stats.id").all();
    const ebStats = db.prepare("SELECT games.demo_name, stats.eb_fired, stats.eb_hit FROM games INNER JOIN stats ON games.game_id == stats.id").all();
    const rlStats = db.prepare("SELECT games.demo_name, stats.rl_fired, stats.rl_hit FROM games INNER JOIN stats ON games.game_id == stats.id").all();
    return {
        lg: lgStats,
        eb: ebStats,
        rl: rlStats,
    };
}

function getAvgAccOfWeapon(weaponName){
    const statement = db.prepare(`SELECT avg(stats.${weaponName}_fired) AS fired, avg(stats.${weaponName}_hit) AS hit FROM games INNER JOIN stats ON games.game_id == stats.id`);
    const data = statement.get();
    return data.hit / data.fired * 100;
}

function getMostHitsOfWeapon(weaponName){
    const statement = db.prepare(`SELECT max(stats.${weaponName}_hit) AS hits FROM games INNER JOIN stats ON games.game_id == stats.id`);
    const data = statement.get();
    return data.hits;
}

module.exports = {
    getLgStats,
    getMainStats,
    getAvgAccOfWeapon,
    getMostHitsOfWeapon,
}