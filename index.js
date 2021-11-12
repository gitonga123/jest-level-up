const express = require('express');
const app = express();

const port = 3000;

app.get('/', (req, res) => {
	res.status(200).send({
		success: true,
		value: {
		},
		message: "Initial Setup"
	});
});

app.listen(port, () => console.log(`Hello World app listening on port ${port}`));
