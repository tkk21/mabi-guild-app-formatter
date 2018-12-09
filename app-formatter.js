const questions = require('./questions.json');
const lastRead = require('./data/lastReadRow.json').row;
const parse = require('csv-parse');
const fs = require('fs');

const fsReverse = require('fs-reverse');

const filename = process.argv[2];

let data = fs.readFileSync(filename);
const parser = parse(data, {}, (err, output) => {
	if (err){
		console.log(err);
		return;
	}
	for (let i = lastRead; i< output.length; i++){
		let formattedApp = formatGuildApplication(output[i]);
		let outputName = `./output/${output[i][1]}`;
		saveFormattedApp(formattedApp, outputName);
	}
});

function streamCsv(){
	// TODO implement stream implementation of this
	let rowsRead = 0;
	const csvStream = fsReverse(filename, {});
	csvStream.on('data', (chunk) => {
		if (rowsRead++ > lastRead){

		}
	});
}

function formatGuildApplication(answers){
	let result = {};
	let i = 1;
	questions.forEach((question) => {
		result[question] = answers[i++];
	});
	return result;
}

function formatQuestionAndAnswer(question, answer){
	return `
__**${question}**__
${answer}

	`;
}

function saveFormattedApp(formattedApp, baseOutputName){
	let buf = "";
	let fileCount = 0;
	for (let key in formattedApp){
		let item = formatQuestionAndAnswer(key, formattedApp[key]);
		// Give it more space than 2000 characters
		if (buf.length + item.length > 1800){
			saveFile(fileCount, baseOutputName, buf);
			buf = "";
			fileCount++;
		}
		buf += item;
	}
	saveFile(fileCount, baseOutputName, buf);
}

function saveFile(fileCount, baseOutputName, buf){
	let filename = fileCount > 0 ? `${baseOutputName}_${fileCount}.txt` : `${baseOutputName}.txt`
	fs.writeFile(filename, buf, 'utf8', (err) => {
		if (err){
			console.log(err);
		}
	});
}

function updateLastReadCount(lastRead, ){
	// TODO
}