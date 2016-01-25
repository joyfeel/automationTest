'use strict';
//import async from 'async';

const async = require('async');


//(1) 在 push 時，會將task及cb傳給async.queue
//(2) 接著執行 console.log('Executing ' + task.name);
//(3) 做完事情後，執行cb()
//(4) cb()就是 console.log('Push the foo');

let q = async.queue((task, cb)=>{
	console.log('Executing ' + task.name);
    setTimeout(()=> {
    	cb();
    }, 5000);
}, 1);

//Fulled
q.saturated = () => console.log('All workers to be used');

//Before Finished
q.empty = () => console.log('No more tasks waiting');

//Finished
q.drain = () => console.log('All items have been processed');

q.push({name: 'foo'}, function (err) {
	console.log('Finished processing foo');
});
q.push({name: 'bar'}, function (err) {
	console.log('Finished processing bar');
});

q.push({name: 'qoo'}, function (err) {
	console.log('Finished processing qoo');
});

/*
    setTimeout(()=> {
    	console.log('finished processing foo');
    }, 1000);
*/

/*
let myArr = ['Joy', 'Dog', 'Cat', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

async.eachSeries(myArr, (element, complete) => {
	console.log('Processing ' + element)
	complete()
}, (err) => {
	console.log('Completed!')
})
*/

/*
const amqp = require('amqp');

let connection = amqp.createConnection({
	host: 'localhost'
});


connection.on('ready', () => {
	connection.publish('my', 'Hello lololololol');
});
*/