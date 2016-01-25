import Router from 'koa-router';
const router = Router();
import {exec, fork} from 'child_process';
import path from 'path';
import async from 'async';

let child;

const childScript = __dirname + '/forkedChild/autotest.js';


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

let execScript2 = (obj, cb) => {
	//return (done) => {
		child = fork(childScript);
		child.send(obj);

		child.on('message', (msg) => {
			console.log('child send back:' + msg);
		});

		child.on('close', function (code) {
			console.log('child process exited with code', code);
			cb();
			//done(null, 'child close'); 
		});
	//}
};

let q = async.queue((task, cb) => {
	console.log(task);
	console.log('Executing task...');

	execScript2(task, cb);
	//cb();
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
	console.log ('execRouter start');
	//yield execScript(this.query);
	q.push(this.query, function (err) {
		console.log('Finished processing qoo');
		//return Promise.resolve('@@@@');
	});

	console.log ('execRouter end');
	this.status = 200;
});

module.exports = router;
