import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent';

class App extends React.Component {
	constructor () {
		super();
		this.send = this.send.bind(this);
	}
	send () {
		console.log('Send start');
		request
			.get('/execRouter')
			.end(function(err, res) {
				if (err) {
					console.log('Send fall');
				} else {
					console.log('Send end');
				}
			});
		
	}
	render () {
		return <button onClick={this.send}>Test</button>;
	}
}

export default App;