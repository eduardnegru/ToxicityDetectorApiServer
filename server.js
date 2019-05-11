const express = require("express");
const chalk = require("chalk");
const app = express();
const childProcess = require("child_process");

function pull(res){
	childProcess.exec('cd /home/ToxicityDetectorApiServer && ./pull.sh', function(err, stdout, stderr){
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

app.get('/webhooks/pull', (req, res) => {

	let sender = req.body.sender;
	let branch = req.body.ref;

	if(branch.indexOf('master') > -1 && sender.login === "eduardnegru")
	{
		pull(res);
	}
});

app.listen(3000, () => {
	console.log(chalk.yellow("server listening on 0.0.0.0:3000"));
});