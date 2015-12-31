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

const testAsync = async () => {
	try {
		let batLog;
		await MPTOOL();
		await FORMAT();
		await MFCJunior();
		await postMFCJunior();		
		await H2testw();
		await postH2testw();

	} catch (err) {
		console.log('ERROR happend: ' + err);
	}
};

/*		
		//(1) Mptool
		batLog = await myExec(__dirname + '/batScripts/Mptool.bat');
		console.log('======Mptool======');
		console.log(batLog);

		//(2) Format E:/
		batLog = await myExec(__dirname + '/batScripts/Format.bat');
		console.log('======Format======');
		console.log(batLog);
		
		//(3) MFCJunior
		batLog = await myExec(__dirname + '/batScripts/MFCJunior.bat');
		console.log('======MFCJunior======');
		console.log(batLog);
		//(3.1) Post MFCJunior
		batLog = await myExec(__dirname + '/batScripts/postMFCJunior.bat');;
		console.log('======post MFCJunior======');
		console.log(batLog);

		//(4) H2testw
		batLog = await myExec(__dirname + '/batScripts/H2testw.bat');
		console.log('======H2testw======');
		console.log(batLog);
		//(4.1) Post H2testw
		batLog = await myExec(__dirname + '/batScripts/postH2testw.bat');;
		console.log('======post H2testw======');
		console.log(batLog);
*/

router.get('/', function *(next) {
  //this.body = 'this a users response!';
  console.log ('Send test A');
  yield testAsync();
  console.log ('Send test B');
  this.status = 200;
});

module.exports = router;