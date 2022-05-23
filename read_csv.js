const fs = require("fs");
const { parse } = require("csv-parse");
var moment = require('moment');
let id = 524859;
fs.createReadStream("/home/daniel/Downloads/TRA_DATA_Combined.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
        const date_1 = moment(row[6], 'DD-MM-YYYY h:mm:ss').format('YYYY-MM-DD h:mm:ss');
        const date_2 = moment(row[7], 'DD-MM-YYYY h:mm:ss').format('YYYY-MM-DD h:mm:ss');
        const date_3 = moment(row[8], 'DD-MM-YYYY h:mm:ss').format('YYYY-MM-DD h:mm:ss');
        const date_4 = moment(row[15], 'DD-MM-YYYY h:mm:ss').format('YYYY-MM-DD h:mm:ss');
        const date_5 = moment(row[17], 'DD-MM-YYYY h:mm:ss').format('YYYY-MM-DD h:mm:ss');
        let data = `INSERT INTO public.tra_data VALUES(${id}, '${row[0]}','${row[1]}','${row[2]}','${row[3]}','${row[4]}','${row[5]}','${date_1}','${date_2}','${date_3}','${row[9]}','${row[10]}','${row[11]}','${row[12]}','${row[13]}','${row[14]}','${date_4}','${row[16]}','${date_5}','${row[18]}');`;
        data += "\n";
        fs.appendFileSync('/home/daniel/Downloads/live_tra_data.sql', data);
        data = '';
        id += 1;
    });

    