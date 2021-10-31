const fs = require('fs')
const odds = require("./odds-2019-01-01.json");
const odds_2 = odds['odds'];
const moment = require('moment-timezone');
const _ = require('lodash');
const timezone = 'Africa/Nairobi';
moment.locale('en');

fs.readFile('./inverse.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    var content = JSON.parse(data);
    count = 0;
    try {
        content.events.map(item => {
            let object = {};
            object.match_id = item.id;
            object.competition = item.tournament.category.name.concat(" - ", item.tournament.name);
            object.home_team = getValueWithKey(item.homeTeam, "name");
            object.away_team = getValueWithKey(item.awayTeam, "name");
            object.half_time = getValueWithKey(item.homeScore, "period1") + "-" + getValueWithKey(item.awayScore, "period1");
            object.second_half = getValueWithKey(item.homeScore, "period2") + "-" + getValueWithKey(item.awayScore, "period2");
            object.full_time = getValueWithKey(item.homeScore, "normaltime") + "-" + getValueWithKey(item.awayScore, "normaltime");
            object.half_time_result = getHalftimeWinner(getValueWithKey(item.homeScore, "period1"), getValueWithKey(item.awayScore, "period1"));
            object.result = getValueWithKey(item, "winnerCode") == 3 ? "X" : getValueWithKey(item, "winnerCode");
            if (odds_2[object.match_id] !== undefined) {
                object.home_change = odds_2[object.match_id].choices[0].change;
                object.draw_change = odds_2[object.match_id].choices[1].change;
                object.away_change = odds_2[object.match_id].choices[2].change;
                object.home_odd = odds_2[object.match_id].choices[0].fractionalValue;
                object.draw_odd = odds_2[object.match_id].choices[1].fractionalValue;
                object.away_odd = odds_2[object.match_id].choices[2].fractionalValue;
            }
            
            object.event_date = moment.unix(item.startTimestamp).tz(timezone).format("L");
            count += 1;
            console.log(object);
        });
    } catch (err) {
        console.log(err);
    }
});


var getValueWithKey = function(object, key) {
    if (_.has(object, key)) {
        return object[key];
    }

    return "";
}
var getHalftimeWinner = function (home_score, away_score) {
    let home_score_int = parseInt(home_score);
    let away_score_int = parseInt(away_score);
    if (home_score_int === away_score_int) return "X";
    if (home_score_int > away_score_int) return 1;
    if (home_score_int < away_score_int) return 2;

    return "-";
}
