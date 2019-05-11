const express = require("express");
const chalk = require("chalk");
const app = express();
const childProcess = require("child_process");

function pull(res){
	childProcess.exec('ls', function(error, stdout, stderr){
		cout(stdout);
		if (error)
		{
			console.error(error);
			return res.send(500);
		}
		else
		{
			res.send(200);
		}
	});
}

app.get('/', (req, res) => res.send("It works!"));

app.post('/webhooks/pull', (req, res) => {
		pull(res);
});

app.listen(3000, () => {
	console.log(chalk.yellow("server listening on 0.0.0.0:3000"));
});




