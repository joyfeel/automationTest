'use strict';
//#!/usr/bin/env node
/*
var amqp = require('amqplib');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'hello';

    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
    }, {noAck: true});
  });
});
*/

const amqp = require('amqp');

let connection = amqp.createConnection({
	host: 'localhost'
});

connection.on('ready', () => {
	console.log('ready...');
	connection.queue('my', (q) => {
		console.log('queued...');
		q.bind('#');
		q.subscribe((message) => {
			console.log(message);
		});
	})
});