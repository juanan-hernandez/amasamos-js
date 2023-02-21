const express = require("express");
const app = express();
const port = 3000;
var bodyParser = require("body-parser");
var fs = require("fs");

app.use(express.static("public"));
app.use("/static", express.static("public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", __dirname);

function getFileJson(fileName) {
	try {
		const data = fs.readFileSync(`${__dirname}/${fileName}`, "utf8");
		return JSON.parse(data);
	} catch (err) {
		console.error(err);
	}
}

function listFolderFiles(folder) {
	const dir = fs.opendirSync(folder);
	const data = {};
	let file;
	while ((file = dir.readSync()) !== null) {
		let fileName = file.name;
		const fileDicts = getFileJson(`${folder}/${fileName}`);
		data[fileName.split(".")[0]] = fileDicts;
	}
	dir.closeSync();
	return data;
}

app.get("/", (req, res) => {
	const data = listFolderFiles("recipes");
	res.render(__dirname + "/index.html", { data });
});

app.get("/:dough", (req, res) => {
	const doughName = req.params.dough;
	const dough = getFileJson(`recipes/${doughName}.json`);
	let lang = req.acceptsLanguages("en", "es");
	if (!lang) {
		lang = "en";
	}
	const translation = getFileJson(
		`public/translation/${lang}/${doughName}.json`
	);
	const translationCommon = getFileJson(
		`public/translation/${lang}/common.json`
	);

	if (dough) {
		res.render(__dirname + "/recipe-calculator.html", {
			dough,
			translation: { ...translation, ...translationCommon },
		});
	} else {
		res.redirect("/");
	}
});

app.listen(port, () => {
	console.log(`App running on http://localhost:${port}`);
});
