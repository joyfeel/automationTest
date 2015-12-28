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

const testAsync = async () => {
	try {
		let message;
		message = await myExec(__dirname + '/batScripts/Mptool.bat');
		console.log('ls: ' + message);
		//message = await myExec('pwd');
		//console.log('pwd: ' + message);	
	} catch (err) {
		console.log('ERROR happend: ' + err);
	}
};
//testAsync();

router.get('/', function *(next) {
  //this.body = 'this a users response!';
  console.log ('Send test A');
  yield testAsync();
  console.log ('Send test B');
  this.status = 200;
});

module.exports = router;