import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent';

//http://soraxism.com/soraxism/blog/html5%E3%81%AEfile-api%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6%E3%80%81%E3%83%89%E3%83%A9%E3%83%83%E3%82%B0%EF%BC%86%E3%83%89%E3%83%AD%E3%83%83%E3%83%97%E3%81%A7%E3%83%95%E3%82%A1%E3%82%A4
//https://gist.github.com/mderazon/76d6184e9353aadb8055
class App extends React.Component {
	constructor() {
		super();
		this.state = {
			file: ''
		};
		this.testStart = this.testStart.bind(this);
		this.submit = this.submit.bind(this);
		this.handleChangeFile = this.handleChangeFile.bind(this);
	}
	testStart() {
		console.log('Test start');
		request
			.get('/execRouter')
			.end(function(err, res) {
				if (err) {
					console.log('Test fall');
				} else {
					console.log('Test end');
				}
			});
	}
	submit() {
		console.log('submit start');
		//let file = ReactDOM.findDOMNode(this.refs.file).files[0];
		let file = this.state.file;
		if (!file) {
			console.log('Nothing');
			return
		}

		console.log(file);
		console.log('FILE:' + file);
		console.dir(file);
		console.dir('FILE2' + file);

// .attach(name, [path], [filename])
// .attach(fieldname, file, originalname)
// .field(name, value)
/*

{ bin:
   { fieldname: 'bin',
     originalname: 'SikuliX-1.1.0-SetupLog.txt',
     name: 'SikuliX-1.1.0-SetupLog.txt', // nodejs modified
     encoding: '7bit',
     mimetype: 'text/plain',
     path: 'uploads\\SikuliX-1.1.0-SetupLog.txt',
     extension: 'txt',
     size: 10319,
     truncated: false,
     buffer: null } }
*/
		request
			.post('upload')
			.attach('bin', file, file.name)
			.end((err, res) => {
				if (err) {
					console.log('ERR' + err);
				}

				console.log('SUCCESS' + res);
			});

		
	}
	uploadFiles(files) {
		let formData = new FormData();

		for (let i = 0; i < files.length; i++) {
			formData.append('file', files[i]);
		}
	}
	handleChangeFile(e) {
		/*
		let files = e.target.files;
		console.log(files);

		this.uploadFiles(files);
		*/
		console.log(ReactDOM.findDOMNode(this.refs.file).files[0]);
		console.log(e.target.files[0]);
		if (ReactDOM.findDOMNode(this.refs.file).files[0] === e.target.files[0]) {
			console.log('SAME!!!');
		}

		this.setState({
			file: e.target.files[0]
		});
	}
	render() {
		return (
			<div>
				<button onClick={this.testStart}>Test</button>
				<input type='file' ref='file' onChange={this.handleChangeFile} />
				<button onClick={this.submit}>Send file</button>
			</div>
		);
		
	}
}

export default App;