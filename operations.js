const fs = require("fs");
const fetch = require("node-fetch");

const moment = require("moment-timezone");
const _ = require("lodash");
const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const timezone = "Africa/Nairobi";
moment.locale("en");
const date_format = "YYYY-MM-DD HH:mm:ss";

const { Client } = require("pg");

const client = new Client();
client.connect();

const util = require("util");
const { query } = require("express");
const readFile = util.promisify(fs.readFile);

const getRecordDate = async (processed = 1) => {
  const q_response = await client.query(
    `SELECT id, event_date, number_of_records FROM public.sf_dates where processed = ${processed} ORDER BY id ASC LIMIT 1`
  );
  if (q_response.rowCount == 0) {
    return {
      event_date: false,
      id: false,
      number_of_records: false,
    };
  }
  return {
    event_date: q_response.rows[0].event_date,
    id: q_response.rows[0].id,
    number_of_records: q_response.rows[0].number_of_records,
  };
};

const updateRecordsWithoutScores = async (columns, values) => {
  let up_s = `UPDATE public.sofascores SET ${columns[0]} = '${values[0]}', ${columns[1]} = '${values[1]}', ${columns[2]} = '${values[2]}', ${columns[3]} = '${values[3]}', ${columns[4]} = '${values[4]}', ${columns[5]} = '${values[5]}', ${columns[6]} = '${values[6]}', ${columns[7]} = '${values[7]}' WHERE  id = ${values[8]};`;
  const update_string = await client.query(up_s);
  console.log(up_s);
  return update_string;
};

const updateNumberRecords = async (id, number_of_records, processed) => {
  const q_response_1 = await client.query(
    `UPDATE public.sf_dates SET number_of_records = ${number_of_records} WHERE id = ${id}`
  );
  const q_response_2 = await client.query(
    `UPDATE public.sf_dates SET processed = ${processed} WHERE id = ${id}`
  );

  return [q_response_1, q_response_2];
};

const insertNewRecord = async (query) => {
  const insert_record = await client.query(query);
  console.log("Insert a new record in db --->");
  return insert_record;
};

const updateRecord = async (query) => {
  const update_record = await client.query(query);
  console.log("Updating records for second half --->");
  return update_record;
};

const checkRecordExists = async (match_id) => {
  const q_response = await client.query(
    `SELECT id FROM public.footballs where match_id ilike '${match_id}' ORDER BY id ASC LIMIT 1`
  );
  return {
    event_count: q_response.rowCount,
  };
};

const getRecordsWithoutScores = async () => {
  const q_response = await client.query(
    `SELECT id, match_id from public.sofascores where updated_score = 0;`
  );

  return q_response;
};

const getEventsRecordsPerDate = async (event_date) => {
  let event_records = `/var/www/html/twitter-api/storage/app/${event_date}_base.json`;
  const event_record_list = await readFile(event_records);

  return { event: event_record_list.toString() };
};

const getRecordsPerDate = async (event_date) => {
  //   console.log(`./var/www/html/twitter-api/storage/app/${event_date}_base.json`);
  let event_links = `/var/www/html/twitter-api/storage/app/${event_date}_base.json`;
  let odd_link = `/var/www/html/twitter-api/storage/app/${event_date}_predict.json`;
  const event_records = await readFile(event_links);
  const odd_records = await readFile(odd_link);
  return {
    event: event_records.toString(),
    odd: odd_records.toString(),
  };
};

module.exports = {
  getRecordDate,
  getRecordsPerDate,
  checkRecordExists,
  insertNewRecord,
  updateNumberRecords,
  getEventsRecordsPerDate,
  updateRecord,
  getRecordsWithoutScores,
  updateRecordsWithoutScores
};
