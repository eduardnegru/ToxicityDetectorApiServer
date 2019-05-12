const express = require("express");
const chalk = require("chalk");
const app = express();
const fs = require("fs");
let w2v = require('word2vector');
const tf = require('@tensorflow/tfjs');
const bodyParser = require('body-parser');
require('@tensorflow/tfjs-node');
let model;

function lstm_model_text_to_vector(text)
{
	/**input shape*/
	const maxAllowedWords = 30;
	const embeddingsLength = 300;

	let arrWords = text.split(" ");
	let arrEmbeddings = w2v.getVectors(arrWords);
	// console.log(arrEmbeddings);
	let arrVectors = [];

	for(let objWord of arrEmbeddings)
	{
		if(arrVectors.length < maxAllowedWords)
		{
			arrVectors.push(objWord["vector"]);
		}
	}

	if(arrVectors.length < maxAllowedWords)
	{
		let paddingRequired = maxAllowedWords - arrVectors.length;

		for(let i = 0; i < paddingRequired; i++)
		{
			arrVectors.push(new Array(embeddingsLength).fill(0))
		}
	}

	return arrVectors;
}

async function run_prediction(req, res)
{
	try
	{
		console.log(req.body);
		console.log(req.body["text"]);
		let strText = JSON.parse(Object.keys(req.body)[0])["text"];
		let arrVectors = lstm_model_text_to_vector(strText);
		let arrPrediction = await model.predict(tf.tensor([arrVectors])).array();
		let prediction = arrPrediction[0][0].toFixed(2);
		res.status(200);
		res.send({"prediction" : prediction});
	}
	catch(error)
	{
		console.error(error);
		res.status(500);
		res.send({"error": error});
	}

}

(async () => {

	w2v.load('./embeddings/wiki/wiki.vec', "utf-8")
	model = await tf.loadLayersModel('file://models/lstm/bidirectional_wiki_adam/model.json');

	app.use(bodyParser.json());

	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	app.get('/', (req, res) => res.send("It works!"));
	app.post('/predict', run_prediction);


	app.listen(3000, () => {
		console.log(chalk.yellow("server listening on 0.0.0.0:3000"));
	});
})();
