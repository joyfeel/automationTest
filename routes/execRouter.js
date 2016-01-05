//var router = require('koa-router')();
import Router from 'koa-router';
const router = Router();
import {exec, fork} from 'child_process';
import path from 'path';


let child;

const childScript = __dirname + '/forkedChild/autotest.js'

/*
const execScript = async () => {
	try {
		let batLog;
		await MPTOOL();
		await FORMAT();
		await MFCJunior();
		await postMFCJunior();
		await FORMAT();	
		await H2testw();
		await postH2testw();
	} catch (err) {
		console.log('ERROR happend: ' + err);
	}
};
*/
let execScript = () => {
	//console.log ('XD')
	return (done) => {

		child = fork(childScript);
		child.send({
			testcase: 'QQQQA'
		});

		child.on('message', (msg) => {
			console.log('child send back:' + msg);
		});

		child.on('close', function (code) {
			console.log('child process exited with code', code);
			done(null, 'child close'); 
		});
	};
};

/*
let forkChild = () => {
	return functin (done) {
		child = fork (childScript);
	}
};
*/
/*
router.get('/', function *(next) {
  //this.body = 'this a users response!';
  console.log ('execRouter start');
  yield execScript();
  yield next;
  console.log ('execRouter end');
  this.status = 200;
});
*/

router.get('/', function *(next) {
  //this.body = 'this a users response!';
  console.log ('execRouter start');
  yield execScript();
  console.log ('execRouter end');
  this.status = 200;
});

module.exports = router;