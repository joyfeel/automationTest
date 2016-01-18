import Router from 'koa-router';
const router = Router();
import {exec, fork} from 'child_process';
import path from 'path';

let child;

const childScript = __dirname + '/forkedChild/autotest.js'

let execScript = (obj) => {
	return (done) => {
		child = fork(childScript);
		child.send(obj);

		child.on('message', (msg) => {
			console.log('child send back:' + msg);
		});

		child.on('close', function (code) {
			console.log('child process exited with code', code);
			done(null, 'child close'); 
		});
	};
};

router.get('/', function *(next) {
  console.log ('execRouter start');
  yield execScript(this.query);
  console.log ('execRouter end');
  this.status = 200;
});

module.exports = router;