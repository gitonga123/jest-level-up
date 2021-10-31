const fs = require("fs");
const odds = require("./odds-2019-01-02.json");
const odds_2 = odds["odds"];
const moment = require("moment-timezone");
const _ = require("lodash");
const { Pool } = require("pg");
const dotenv = require('dotenv');
dotenv.config();

const timezone = "Africa/Nairobi";
moment.locale("en");
const date_format = "YYYY-MM-DD HH:mm:ss";

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT,
});

pool.on("error", (err, client) => {
  console.error("Error:", err);
});

fs.readFile("./2019-01-02.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  var content = JSON.parse(data);
  count = 0;
  try {
    content.events.map((item) => {
      let object = {};
      object.match_id = item.id;
      object.competition = item.tournament.category.name.concat(
        " - ",
        item.tournament.name
      );
      object.event_date = moment
        .unix(item.startTimestamp)
        .tz(timezone)
        .format(date_format);
      
      object.home_team = getValueWithKey(item.homeTeam, "name");
      object.away_team = getValueWithKey(item.awayTeam, "name");
      object.halftime_score =
        getValueWithKey(item.homeScore, "period1") +
        "-" +
        getValueWithKey(item.awayScore, "period1");
      object.secondhalf_score =
        getValueWithKey(item.homeScore, "period2") +
        "-" +
        getValueWithKey(item.awayScore, "period2");
      object.correct_score =
        getValueWithKey(item.homeScore, "normaltime") +
        "-" +
        getValueWithKey(item.awayScore, "normaltime");
      object.home_score = getValueWithKey(item.homeScore, "normaltime");
      object.away_score = getValueWithKey(item.awayScore, "normaltime");
      object.both_total = getTotalGoals(
        getValueWithKey(item.homeScore, "normaltime"),
        getValueWithKey(item.awayScore, "normaltime")
      );
      object.halfttime_result = getHalftimeWinner(
        getValueWithKey(item.homeScore, "period1"),
        getValueWithKey(item.awayScore, "period1")
      );
      object.home_record = JSON.stringify(getValueWithKey(item, "homeScore"));
      object.away_record = JSON.stringify(getValueWithKey(item, "awayScore"));
      object.result =
        getValueWithKey(item, "winnerCode") == 3
          ? "X"
          : getValueWithKey(item, "winnerCode");
        object.created_at = moment().format(date_format);
        object.updated_at = moment().format(date_format);
      if (odds_2[object.match_id] !== undefined) {
        object.home_change = odds_2[object.match_id].choices[0].change;
        object.draw_change = odds_2[object.match_id].choices[1].change;
        object.away_change = odds_2[object.match_id].choices[2].change;
        object.home_odd = convertFractionToDecimal(
          odds_2[object.match_id].choices[0].fractionalValue
        );
        object.draw_odd = convertFractionToDecimal(
          odds_2[object.match_id].choices[1].fractionalValue
        );
        object.away_odd = convertFractionToDecimal(
          odds_2[object.match_id].choices[2].fractionalValue
        );

        let insert_query_string = convertObjectToInsertQuery(object);
        pool.query(insert_query_string).then( res => {
            console.log("Match Id inserted successfully -->", object.match_id);
        }).catch(err => {
            console.log("Match id failed to insert --->", object.match_id);
        });
        // pool.query(insert_query_string, (err,res) => {
        //     if (err) {
        //         console.log("Error encountered while trying to insert values");
        //         console.log(err);
        //     }
        // });
      }
      // pool.end();
      
      
      //console.log(insert_query_string);
      //console.log(object);
    });

    pool.end();
  } catch (err) {
    console.log(err);
  }
});

var getValueWithKey = function (object, key) {
  if (_.has(object, key)) {
    return object[key];
  }

  return "";
};
var getHalftimeWinner = function (home_score, away_score) {
  let home_score_int = parseInt(home_score);
  let away_score_int = parseInt(away_score);
  if (home_score_int === away_score_int) return "X";
  if (home_score_int > away_score_int) return 1;
  if (home_score_int < away_score_int) return 2;

  return "-";
};

var getTotalGoals = function (home_score, away_score) {
  return parseInt(home_score) + parseInt(away_score);
};

var convertFractionToDecimal = function (number_to_convert) {
  let temp_numb = number_to_convert.split("/");

  return (
    Math.round((temp_numb[0] / temp_numb[1] / 1 + Number.EPSILON) * 100) / 100 +
    1
  );
};

var convertObjectToInsertQuery = function (object) {
  try {
    let object_keys = Object.keys(object);
    let insert_string = "INSERT INTO footballs(".concat(
      object_keys.toString(),
      ") VALUES ("
    );
    object_keys.map((item_o, index) => {
        if (object_keys.length - 1== index) {
            insert_string = insert_string + "'" + object[item_o].toString() + "')";
        } else {
            insert_string = insert_string + "'" + object[item_o].toString() + "',"
        }
    });
    return insert_string;
  } catch (error) {
    console.log("Error creating the insert query");
    console.log(error);
  }
};
