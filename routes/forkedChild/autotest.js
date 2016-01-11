//var router = require('koa-router')();
import Router from 'koa-router';
const router = Router();
import {exec} from 'child_process';

const parseBatchLog = (str) => {
	let result = false,
		parsedStr;

	parsedStr = str.split(/\r\n|\r|\n/);
	parsedStr.map((x, index) => {
		console.log(index + ' ' + x);
		if (x === 'OK') {
			result = true;
		}
	});	

	return result;
};

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

const preScript = async () => {
	return new Promise (async (resolve, reject) => {
		//pre
		console.log('======pre======');
		await myExec(__dirname + '/batScripts/preScript.bat');
		resolve('pre ok');
	});	
};

const MPTOOL = async () => {
	let batLog;

	console.log('======Mptool======');
	batLog = await myExec(__dirname + '/batScripts/Mptool.bat');
	console.log(batLog);	
};

const FORMAT = async () => {
	return new Promise(async (resolve, reject) => {
		let batLog,
		result = false;		
		
		console.log('======Format======');
		batLog = await myExec(__dirname + '/batScripts/Format.bat');
		result = parseBatchLog (batLog);
		if (result === false) {
			reject('Format error');
		} else {
			resolve('Format ok');
		}
	});
};

const MFCJunior = async () => {
	return new Promise(async (resolve, reject) => {
		let batLog,
			result = false;		

		//preMFCJunior
		//console.log('======preMFCJunior======');
		//await myExec(__dirname + '/batScripts/preMFCJunior.bat');

		//MFCJunior
		console.log('======MFCJunior======');
		batLog = await myExec(__dirname + '/batScripts/MFCJunior.bat');
		result = parseBatchLog (batLog);

		if (result === false) {
			reject('MFCJunior error');
		} else {
			resolve('MFCJunior ok');
		}
	});
};

const H2testw = async () => {
	return new Promise (async (resolve, reject) => {
		let batLog,
			result = false;

		//H2testw
		console.log('======H2testw======');
		batLog = await myExec(__dirname + '/batScripts/H2testw.bat');
		result = parseBatchLog (batLog);		

		//postH2testw
		console.log('======postH2testw======');
		await myExec(__dirname + '/batScripts/postH2testw.bat');

		if (result === false) {
			reject('H2testw error');
		} else {
			resolve('H2testw ok');
		}
	});	
};

const FLCC = async () => {
	return new Promise (async (resolve, reject) => {
		let batLog,
			result = false;

		//preFLCC
		//console.log('======preFLCC======');
		//await myExec(__dirname + '/batScripts/preFLCC.bat');

		//FLCC
		console.log('======FLCC======');
		batLog = await myExec(__dirname + '/batScripts/FLCC.bat');
		result = parseBatchLog (batLog);		

		if (result === false) {
			reject('FLCC error');
		} else {
			resolve('FLCC ok');
		}
	});	
};

const ATTO = async () => {
	return new Promise (async (resolve, reject) => {
		let batLog,
			result = false;

		//ATTO
		console.log('======ATTO======');
		batLog = await myExec(__dirname + '/batScripts/ATTO.bat');
		result = parseBatchLog (batLog);		

		if (result === false) {
			reject('ATTO error');
		} else {
			resolve('ATTO ok');
		}
	});	
};

const testAsync = async () => {
	let result;
	try {
		//pre clear
		await preScript();

		//MPTOOL
		//await MPTOOL();

		//MFCJunior
		result = await FORMAT();
		console.log(result);
		result = await MFCJunior();
		console.log(result);

		//H2testw
		result = await FORMAT();
		console.log(result);
		result = await H2testw();
		console.log(result);		

		//FLCC
		result = await FORMAT();
		console.log(result);
		result = await FLCC();
		console.log(result);

		//ATTO
		result = await FORMAT();
		console.log(result);
		result = await ATTO();
		console.log(result);

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