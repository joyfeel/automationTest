//var router = require('koa-router')();
import Router from 'koa-router';
const router = Router();
import {exec} from 'child_process';

const myExec = (script) => {
	return new Promise((resolve, reject) => {
		exec(script, (err, stdout, stderr) => {
			if (err !== null) {
				reject(stderr);
			} else {
				resolve(stdout);
			}
		});
	});
};

const FORMAT = async () => {
	let batLog;

	console.log('======Format======');
	batLog = await myExec(__dirname + '/batScripts/Format.bat');
	console.log(batLog);		
};

const MPTOOL = async () => {
	let batLog;

	console.log('======Mptool======');
	batLog = await myExec(__dirname + '/batScripts/Mptool.bat');
	console.log(batLog);		
};

const MFCJunior = async () => {
	let batLog;

	console.log('======MFCJunior======');
	batLog = await myExec(__dirname + '/batScripts/MFCJunior.bat');
	console.log(batLog);		
};

const postMFCJunior = async () => {
	let batLog;

	console.log('======postMFCJunior======');
	await myExec(__dirname + '/batScripts/postMFCJunior.bat');
	console.log(batLog);		
};

const H2testw = async () => {
	let batLog; 

	console.log('======H2testw======');
	batLog = await myExec(__dirname + '/batScripts/H2testw.bat');
	console.log(batLog);		
};

const postH2testw = async () => {
	let batLog; 

	console.log('======postH2testw======');
	batLog = await myExec(__dirname + '/batScripts/postH2testw.bat');
	console.log(batLog);		
};

const preFLCC = async () => {
	let batLog; 

	console.log('======preFLCC======');
	batLog = await myExec(__dirname + '/batScripts/preFLCC.bat');
	console.log(batLog);		
};

const FLCC = async () => {
	let batLog; 

	console.log('======FLCC======');
	batLog = await myExec(__dirname + '/batScripts/FLCC.bat');
	console.log(batLog);		
};

const ATTO = async () => {
	let batLog; 

	console.log('======ATTO======');
	batLog = await myExec(__dirname + '/batScripts/ATTO.bat');
	console.log(batLog);		
};

const testAsync = async () => {
	try {
		await MPTOOL();
/*
		await FORMAT();
		await MFCJunior();
		await postMFCJunior();

		await FORMAT();	
		await H2testw();
		await postH2testw();

		await FORMAT();
		await preFLCC();
		await FLCC();
*/
		await FORMAT();
		await ATTO();
	} catch (err) {
		console.log('ERROR happend: ' + err);
	}
};

const time = async () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(118)
		}, 1000);
	});
};

process.on('message', async (msg) => {
	console.log ('Send test AA');
	console.log ('Send test BB');
	try {
		await testAsync();
		//let a = await time();	
		//console.log(a);
	} catch(err) {
		console.log(err);
	}
	
	
	process.exit(0);
	console.log ('Send test ZZ');
});




//process.exit(0);

/*
router.get('/', function *(next) {
  //this.body = 'this a users response!';
  console.log ('Send test AA');
  //yield testAsync();
  console.log ('Send test BB');
  this.status = 200;
});

module.exports = router;
*/