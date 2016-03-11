import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent';
import async from 'async';

import { Input, ButtonInput, Grid, Row, Col } from 'react-bootstrap';

//http://soraxism.com/soraxism/blog/html5%E3%81%AEfile-api%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6%E3%80%81%E3%83%89%E3%83%A9%E3%83%83%E3%82%B0%EF%BC%86%E3%83%89%E3%83%AD%E3%83%83%E3%83%97%E3%81%A7%E3%83%95%E3%82%A1%E3%82%A4
//https://gist.github.com/mderazon/76d6184e9353aadb8055
class App extends React.Component {
	constructor() {
		super();
		this.state = {
			file: null,
			extcsdFile: null,
			formatType: 'fat32',
			email: '',
			resend: false,
			style: null,
			disabled: true,
			sortingChecked: false,
			fwCE: null,
			extcsdCE: null
		};
		this.submit = this.submit.bind(this);
		this.handleChangeExtCsdFile = this.handleChangeExtCsdFile.bind(this);
		this.handleChangeFile = this.handleChangeFile.bind(this);
		this.handleChangeSelect = this.handleChangeSelect.bind(this);
		this.handleChangeEmail = this.handleChangeEmail.bind(this);
		this.toggleChangeSorting = this.toggleChangeSorting.bind(this);
	}
	submit() {
		let originalFirmware, 
			timestampFirmware;
		const {extcsdFile, file, formatType, email, sortingChecked} = this.state;

		//Empty
		if (!extcsdFile || !file) {
			alert('檔名不正確');
			return;
		}

		if (!email) {
			alert('email 資料不齊全');
			return;
		}		

		//extcsd===512
		if (extcsdFile.size !== 512) {
			alert('ext_csd file !== 512 bytes');
			return;
		} else if (file.size < 200000 || file.size > 300000) {
			alert('firmware bin < 200000  or > 300000 bytes');
			return;
		}

		console.log(extcsdFile)
		console.log(file)

		let retVal = confirm("Do you want to test?");
		if (retVal === false) {
			return;
		} else {
			originalFirmware = file.name;
			timestampFirmware = file.name
									.replace('.bin', '-' + Date.now())
									.concat('.bin');			
		}
		async.series([
/*
			(callback) => {
				//console.log('Upload file');
				request
					.get('/execRouter/sorting')
					.end(callback);
			},
*/
			//Post => /upload => Upload the bin file
			(callback) => {
				//console.log('Upload file');
				request
					.post('/upload')
					.attach('bin', file, timestampFirmware)
					.attach('jnr', extcsdFile, extcsdFile.name)
					.end(callback);
			},
			//Get => /execRouter => Execute batch files
			(callback) => {
				request
					.get('/execRouter')
					.query({
						originalFirmware,
						timestampFirmware,
						extcsdFile: extcsdFile.name,
						formatType,
						email,
						sortingChecked
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
	//FW
	handleChangeFile(e) {
		/*
		  (1) this.refs.file.files[0]
		  (2) e.target.files[0]
		  (3) bootstrap: this.refs.file.getValue()
		  (4) bootstrap: this.refs.file.getInputDOMNode().files[0]
		*/

		let file = this.refs.file.getInputDOMNode().files[0];
		console.log(`filename: ${file.name}`);
		let regex = /([1,2,4])(CE)/g,
			count = (file.name.match(regex) || []).length;
		
		if (count !== 1) {
			alert(`請更改 fw 檔名，須包含CE數。ex: fw_2CE_0301`);
			this.setState({
				file: null,
				fwCE: null
			});			
			return;
		}

		if (file.size < 100000 || file.size > 300000) {
			alert('fw bin < 100000 or > 300000 bytes');
			this.setState({
				file: null,
				fwCE: null
			});				
			return;
		}

		this.setState({
			file: this.refs.file.getInputDOMNode().files[0],
			fwCE: RegExp.$1
		});		


		console.log(`count: ${count}`)
		console.log(typeof count)
/*
			fwCE: null,
			extcsdCE: null
*/

	}
	//EXT_CSD
	handleChangeExtCsdFile(e) {

		this.setState({
			extcsdFile: this.refs.extcsdfile.getInputDOMNode().files[0]
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
	toggleChangeSorting() {
		this.setState({
			sortingChecked: !this.state.sortingChecked
		});
	}
	resend() {
		this.setState({
			resend: !this.state.resend
		});		
	}
	render() {
		return (
			<Grid>
				<Row className="show-grid">
					<Col xs={12} md={6}>
						<Input 
							type='email' 
							label='Email Address (VIA only)' 
							placeholder='Enter email' 
							ref='email' 
							onChange={this.handleChangeEmail} 
						/>
					</Col>
				</Row>
				<Row className="show-grid">
					<Col xs={12} md={8}>
						<Input 
							type='file' 
							label='Choose Firmware File' 
							ref='file' 
							onChange={this.handleChangeFile} 
						/>
					</Col>												
					<Col xs={12} md={4}>
						<Input 
							type='file' 
							label='Choose EXT_CSD File' 
							ref='extcsdfile' 
							onChange={this.handleChangeExtCsdFile} 
						/>
					</Col>		
					<Col xs={8} md={4}>
					    <Input type='select' label="Select Format Type(Filesystem)" 
					    	defaultValue='fat32' ref='formatType' 
					    	onChange={this.handleChangeSelect} placeholder="select">
					    	{/*<option value="ntfs">NTFS (4k)</option>*/}
					      	<option value="fat32" >FAT32 (16k)</option>
					      	<option value="exfat">exFAT (32k)</option>
					    </Input>
					</Col>					
				</Row>
				<Row className="show-grid">
					<Col xs={6} md={2}>
					    {!this.state.resend ?
					    	<ButtonInput 
					    		value="Test firmware bin"
					    		bsStyle={this.state.style} 
								disabled={this.state.disabled} 
								onClick={this.submit}/> :
					    	null}
					</Col>
					<Col xs={6} md={2}>
					  <div class="checkbox">
					    <label>
					      <Input 
					      	type="checkbox" 
					      	checked={this.state.sortingChecked}
					      	onChange={this.toggleChangeSorting}> 
					      	Do Flash Sorting
					      </Input>
					    </label>
					  </div>
					</Col>
				</Row>
			</Grid>
		);
	}
}

export default App;