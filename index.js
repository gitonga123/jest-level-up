const express = require("express");
const app = express();
const db = require("./operations");
const port = 3033;
const moment = require("moment-timezone");
const timezone = "Africa/Nairobi";
moment.locale("en");
const date_format = "YYYY-MM-DD HH:mm:ss";
const _ = require("lodash");
const fs = require("fs");
const util = require("util");
const { result } = require("lodash");
const readFile = util.promisify(fs.readFile);

// app.get("/", async (req, res) => {
//   const _dates = await db.getRecordDate();
//   try {
//     if (_dates.event_date == false) {
//       res.status(404).send({
//         success: false,
//         value: {},
//         message: "Records not found",
//       });
//     }
//     const records = await db.getRecordsPerDate(_dates.event_date);
//     const insert_record = await mapEventToValue(
//       records["event"],
//       records["odd"]
//     );
//     await db.updateNumberRecords(
//       _dates.id,
//       _dates.number_of_records + insert_record,
//       4
//     );
//     console.log("Insert records --->", insert_record);
//     res.status(200).send({
//       success: true,
//       value: insert_record,
//       message: "Initial Insert",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(400).send({
//       success: false,
//       value: {
//         error,
//       },
//       message: "Initial Insert error",
//     });
//   }
// });

app.get("/update/second_half/details", async (req, res) => {
  const _dates = await db.getRecordDate(4);
  try {
    const records = await db.getEventsRecordsPerDate(_dates.event_date);
    const insert_record = await updateSecondHalfRecords(records["event"]);
    console.log("Update records --->", insert_record);
    await db.updateNumberRecords(_dates.id, _dates.number_of_records, 5);
    res.status(200).send({
      success: true,
      value: insert_record,
      message: "Second Half Updates",
    });
  } catch (error) {
    console.error(error);
    await db.updateNumberRecords(_dates.id, _dates.number_of_records, 5);
    res.status(500).send({
      success: false,
      value: {},
      message: "Second Half Updates errors",
    });
  }
});

const updateSecondHalfRecords = async (event) => {
  const events = JSON.parse(event);
  let count = 0;
  const event_updating = events.events.map(async (item) => {
    let record_exists = await db.checkRecordExists(item.id);
    if (record_exists.event_count === 1) {
      if (
        _.has(item.homeScore, "period2") &&
        _.has(item.awayScore, "period2")
      ) {
        let second_half_score =
          item.homeScore["period2"] + "-" + item.awayScore["period2"];
        let update_query = `UPDATE public.footballs SET secondhalf_score = '${second_half_score}' where match_id ilike '${item.id}';`;
        await db.updateRecord(update_query);
        count = count + 1;
      }
    }
  });

  await Promise.all(event_updating);
  return count;
};
const mapEventToValue = async (event, odd) => {
  let object = {};
  const events = JSON.parse(event);
  const odd_r = JSON.parse(odd);
  const odds_2 = odd_r["odds"];
  let count = 0;
  const events_processing = events.events.map(async (item) => {
    let record_exists = await db.checkRecordExists(item.id);
    if (
      record_exists.event_count == 0 &&
      odds_2[item.id] !== undefined &&
      item.result != 0
    ) {
      object.match_id = item.id;
      object.competition = item.tournament.category.name
        .concat(" - ", item.tournament.name)
        .replace("'", " ");
      object.event_date = moment
        .unix(item.startTimestamp)
        .tz(timezone)
        .format(date_format);
      object.home_team = getValueWithKey(item.homeTeam, "name").replace(
        "'",
        " "
      );
      object.away_team = getValueWithKey(item.awayTeam, "name").replace(
        "'",
        " "
      );
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
      object.home_change = getValueWithKey(
        odds_2[object.match_id].choices[0],
        "change"
      );
      object.draw_change = getValueWithKey(
        odds_2[object.match_id].choices[1],
        "change"
      );
      object.away_change = getValueWithKey(
        odds_2[object.match_id].choices[2],
        "change"
      );
      object.home_odd = convertFractionToDecimal(
        getValueWithKey(odds_2[object.match_id].choices[0], "fractionalValue")
      );
      object.draw_odd = convertFractionToDecimal(
        getValueWithKey(odds_2[object.match_id].choices[1], "fractionalValue")
      );
      object.away_odd = convertFractionToDecimal(
        getValueWithKey(odds_2[object.match_id].choices[2], "fractionalValue")
      );
      if (object.both_total !== false && _.size(object.home_record) >= 64) {
        let insert_query_string = convertObjectToInsertQuery(object);
        count = count + 1;
        let insert_query_resulting = db.insertNewRecord(insert_query_string);
        if (!_.isNil(insert_query_resulting)) {
          return insert_query_string;
        }
      }
      //
    }
    return count;
  });
  await Promise.all(events_processing);
  return count;
};

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
  let total = parseInt(home_score) + parseInt(away_score);
  return Number.isNaN(total) ? "" : total;
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
      if (object_keys.length - 1 == index) {
        insert_string =
          insert_string + "'" + object[item_o].toString().trim() + "')";
      } else {
        insert_string =
          insert_string + "'" + object[item_o].toString().trim() + "',";
      }
    });
    return insert_string + ";";
  } catch (error) {
    console.log("Error creating the insert query");
    console.log(error);
  }
};
// /home/ncttca/OBR_TTCANC_2021.csv
// COPY obr_burundi.north_corridor_data FROM '/home/ncttca/OBR_TTCANC_2021_2.csv' DELIMITER ',' CSV;

app.get("/api/update/tt/results", async (req, res) => {
  let results_link = `/var/www/html/jest-level-up/upload/25_jan_2022.json`;
  const results_record = JSON.parse(await readFile(results_link));

  //const data = results_record["data"]["tournaments"][0]["events"];
  const temp_data = results_record['data']['tournaments'].map(item => item['events']);
  const data = _.flatten(temp_data);
  const data_r = {};
  data.map((item) => {
    let scores = getScores(item["regularTimeScore"]);
    let results = getWinner(item["setScore"]);
    data_r[item["eventId"]] = {
      event_date: item["estimateStartTime"],
      correct_score: item["setScore"],
      result: results[0],
      home_total: scores[0],
      away_total: scores[1],
      both_total: scores[0] + scores[1],
      home_score: results[1],
      away_score: results[2],
      scores: JSON.stringify(item["gameScore"]),
    };
  });
  let data_tuple = `('${Object.keys(data_r).join("','")}')`;
  const matches = await db.getRecordsWithoutScores(data_tuple);
  let count_updates = 0;
  if (matches.rowCount > 0) {
    const update_r = matches.rows.map(async (item) => {
      let insert_v = data_r[item["match_id"]];
      if (!_.isUndefined(insert_v)) {
        await db.updateRecordsWithoutScores(
          [
            "correct_score",
            "result",
            "home_total",
            "away_total",
            "both_total",
            "home_score",
            "away_score",
            "updated_score",
            "scores",
          ],
          [
            insert_v.correct_score,
            insert_v.result,
            insert_v.home_total,
            insert_v.away_total,
            insert_v.both_total,
            insert_v.home_score,
            insert_v.away_score,
            "1",
            insert_v.scores,
            item["id"],
          ]
        );
        count_updates = count_updates + 1;
      }
    });
    await Promise.all(update_r);
  }

  let msg = `<div class="alert alert-info alert-dismissible fade show" role="alert">
  <strong>Niiiice!</strong> Number of records ${count_updates}.
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
  return res.status(200).send({ success: true, number_of_records: msg });
});

const getScores = function (item) {
  if (_.isUndefined(item) || item.length == 0) return ["c", "c", "c"];
  let r = { h: 0, a: 0 };
  item.map((i) => {
    rl = i.split(":");
    r["h"] = r["h"] + parseInt(rl[0]);
    r["a"] = r["a"] + parseInt(rl[1]);
  });
  return [r["h"], r["a"]];
};

const getWinner = function (item) {
  if (_.isUndefined(item) || item.length == 0) return ["c", "c", "c"];
  let str_s = item.split(":");
  let result = getHalftimeWinner(str_s[0], str_s[1]);
  return [result, str_s[0], str_s[1]];
};

app.listen(port, () =>
  console.log(`Hello World app listening on port ${port}`)
);
