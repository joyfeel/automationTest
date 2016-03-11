import Router from 'koa-router';
const router = Router();
import {exec, fork} from 'child_process';
import path from 'path';
import async from 'async';

let child;

const childScript = __dirname + '/forkedChild/autotest.js';

/*
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
*/



//(1) 在 push 時，會將task及cb傳給async.queue
//(2) 接著執行 console.log('Executing ' + task.name);
//(3) 做完事情後，執行cb()
//(4) cb()就是 console.log('Push the foo');

let execScript = (obj, cb) => {
	child = fork(childScript);
	child.send(obj);

	child.on('message', (msg) => {
		console.log('child send back:' + msg);
	});

	child.on('close', function (code) {
		console.log('child process exited with code', code);
		cb();
	});
};

let q = async.queue((task, cb) => {
	console.log(task);
	console.log('Executing task...');

	execScript(task, cb);
}, 1);

//Fulled
q.saturated = () => console.log('All workers to be used');

//Before Finished
q.empty = () => console.log('No more tasks waiting');

//Finished
q.drain = () => console.log('All items have been processed');
/*
q.push({name: 'foo'}, function (err) {
	console.log('Finished processing foo');
});
*/
router.get('/', function *(next) {
	console.log ('/ start');

	q.push(this.query, function (err) {
		console.log('Finish process!');
	});

	console.log ('execRouter end');
	this.status = 200;
});

/*
router.get('/:sorting', function *(next) {
	console.log ('MPTool sorting start');

	q.push(this.query, function (err) {
		console.log('Finished processing qoo');
	});

	console.log ('MPTool sorting start end');
	this.status = 200;
});
*/

module.exports = router;
