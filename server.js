const express = require("express");
const chalk = require("chalk");
const app = express();

app.get('/', (req, res) => res.send("It works!"));

app.listen(3000, () => {
    console.log(chalk.yellow("server listening on 0.0.0.0:3000"));
});