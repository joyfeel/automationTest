import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent';
import async from 'async';

import { Input, ButtonInput } from 'react-bootstrap';

//http://soraxism.com/soraxism/blog/html5%E3%81%AEfile-api%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6%E3%80%81%E3%83%89%E3%83%A9%E3%83%83%E3%82%B0%EF%BC%86%E3%83%89%E3%83%AD%E3%83%83%E3%83%97%E3%81%A7%E3%83%95%E3%82%A1%E3%82%A4
//https://gist.github.com/mderazon/76d6184e9353aadb8055
class App extends React.Component {
	constructor() {
		super();
		this.state = {
			file: '',
			formatType: 'fat32',
			email: '',
			resend: false,
			style: null,
			disabled: true
		};
		this.submit = this.submit.bind(this);
		this.handleChangeFile = this.handleChangeFile.bind(this);
		this.handleChangeSelect = this.handleChangeSelect.bind(this);
		this.handleChangeEmail = this.handleChangeEmail.bind(this);
	}
	submit() {
		const {file, formatType, email} = this.state;

		if (!file || !email) {
			return;
		}

		let retVal = confirm("Do you want to continue ?");
		if (retVal === false) {
			return;
		}

		//console.log(this.state);

		async.series([
			//Post => /upload => Upload the bin file
			(callback) => {
				console.log('Upload file');
				request
					.post('/upload')
					.attach('bin', file, file.name)
					.end(callback);
			},
			//Get => /execRouter => Execute batch files
			(callback) => {
				console.log('Execute batch file');
				request
					.get('/execRouter')
					.query({
						filename: file.name,
						formatType,
						email
					})
					.end(callback);
			}
		],
		(err, res) => {		// This is the 'callback'!
    		if (err) {
    			console.log(err);	
    		} else {
    			console.log(res)	
    		}
		});
	
	}
	handleChangeFile(e) {
		/*
		  (1) this.refs.file.files[0]
		  (2) e.target.files[0]
		  (3) bootstrap: this.refs.file.getValue()
		  (4) bootstrap: this.refs.file.getInputDOMNode().files[0]
		*/
		this.setState({
			file: this.refs.file.getInputDOMNode().files[0]
		});
	}
	handleChangeSelect() {
		//console.log(this.refs.format);
		//console.log(this.refs.format.getValue());
		this.setState({
			formatType: this.refs.formatType.getValue()
		});
	}
	validationEmail() {
		let email = this.refs.email.getValue(),
			re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    		style;
    	if (re.test(email)) {
    		style = 'success';
    	} else {
    		style = 'danger';
    	}

    	let disabled = style !== 'success';

		return { email, style, disabled };
	}
	handleChangeEmail() {
		this.setState(this.validationEmail);
	}
	resend() {
		this.setState({
			resend: !this.state.resend
		});		
	}
	render() {
		return (
			<div>
				<form>
					<Input type='email' label='Email Address (VIA only)' 
						placeholder='Enter email' 
						ref='email' 
						onChange={this.handleChangeEmail} />
					<Input type='file' label='Choose Firmware File' ref='file' onChange={this.handleChangeFile} />
				    <Input type='select' label="Select Format Type(Filesystem)" 
				    	defaultValue='fat32' ref='formatType' 
				    	onChange={this.handleChangeSelect} placeholder="select">
				    	{/*<option value="ntfs">NTFS (4k)</option>*/}
				      	<option value="fat32" >FAT32 (16k)</option>
				      	<option value="exfat">exFAT (32k)</option>
				    </Input>
				    {!this.state.resend
				    	? <ButtonInput value='Send file (Async)' 
				    		bsStyle={this.state.style} 
							disabled={this.state.disabled} 
							onClick={this.submit} />
				    	: null} 
				</form>
			</div>
		);
	}
}

/*

	uploadFiles(files) {
		let formData = new FormData();

		for (let i = 0; i < files.length; i++) {
			formData.append('file', files[i]);
		}
	}

*/

export default App;