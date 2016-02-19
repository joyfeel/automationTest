//var router = require('koa-router')();
import Router from 'koa-router';
const router = Router();
import { exec } from 'child_process';
import zip from './util/compression';
import * as mail from './util/mail';

const parseBatchLog = (str) => {
	let result = false,
		parsedStr;

	parsedStr = str.split(/\r\n|\r|\n/);
	parsedStr.map((x, index) => {
		console.log(index + ' ' + x);
		if (x === 'OK') {
			result = true;
		}
	});	

	return result;
};

const myExec = (script) => {
	console.log(new Date());
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

const preScript = async () => {
	return new Promise (async (resolve, reject) => {
		console.log('======pre======');
		await myExec(__dirname + '/batScripts/preScript.bat');
		resolve('pre ok');
	});	
};

const MFCJunior = async () => {
	return new Promise(async (resolve, reject) => {
		let batLog,
			result = false;		

		//MFCJunior
		console.log('======MFCJunior======');
		batLog = await myExec(__dirname + '/batScripts/MFCJunior.bat');
		result = parseBatchLog (batLog);

		if (result === false) {
			reject('MFCJunior error');
		} else {
			resolve('MFCJunior ok');
		}
	});
};

const H2testw = async () => {
	return new Promise (async (resolve, reject) => {
		let batLog,
			result = false;

		//H2testw
		console.log('======H2testw======');
		batLog = await myExec(__dirname + '/batScripts/H2testw.bat');
		result = parseBatchLog (batLog);		

		//postH2testw
		console.log('======postH2testw======');
		await myExec(__dirname + '/batScripts/postH2testw.bat');

		if (result === false) {
			reject('H2testw error');
		} else {
			resolve('H2testw ok');
		}
	});	
};

const FLCC = async () => {
	return new Promise (async (resolve, reject) => {
		let batLog,
			result = false;

		//FLCC
		console.log('======FLCC======');
		batLog = await myExec(__dirname + '/batScripts/FLCC.bat');
		result = parseBatchLog (batLog);		

		if (result === false) {
			reject('FLCC error');
		} else {
			resolve('FLCC ok');
		}
	});	
};

const ATTO = async () => {
	return new Promise (async (resolve, reject) => {
		let batLog,
			result = false;

		//ATTO
		console.log('======ATTO======');
		batLog = await myExec(__dirname + '/batScripts/ATTO.bat');
		result = parseBatchLog (batLog);		

		if (result === false) {
			reject('ATTO error');
		} else {
			resolve('ATTO ok');
		}
	});	
};

const BurnIn = async () => {
	return new Promise (async (resolve, reject) => {
		let batLog,
			result = false;

		//BurnIn
		console.log('======BurnInTest======');
		batLog = await myExec(__dirname + '/batScripts/BurnIn.bat');
		result = parseBatchLog (batLog);		

		if (result === false) {
			reject('BurnIn error');
		} else {
			resolve('BurnIn ok');
		}
	});	
};

const CDM = async (log_type) => {
	return new Promise (async (resolve, reject) => {
		let batLog,
			result = false;

		//CDM
		console.log('======CDM======');
		batLog = await myExec(__dirname + '/batScripts/CDM.bat ' + log_type);
		result = parseBatchLog (batLog);		

		if (result === false) {
			reject('CDM error');
		} else {
			resolve('CDM ok');
		}
	});	
};

const Trim = async () => {
	return new Promise(async (resolve, reject) => {
		let batLog,
		result = false;

		console.log('======Trim======');
		batLog = await myExec(__dirname + '/batScripts/Trim.bat');
		result = parseBatchLog (batLog);
		if (result === false) {
			reject('Trim error');
		} else {
			resolve('Trim ok');
		}
	})
}

const FORMAT = async (formatType) => {
	return new Promise(async (resolve, reject) => {
		let batLog,
		result = false;

		console.log('======Format======');
		batLog = await myExec(__dirname + '/batScripts/Format.bat ' + formatType);
		result = parseBatchLog (batLog);
		if (result === false) {
			reject('Format error');
		} else {
			resolve('Format ok');
		}
	})
}

const PowerCycle = async () => {
	return new Promise(async (resolve, reject) => {
		let batLog,
		result = false;

		console.log('======PowerCycle======');
		batLog = await myExec(__dirname + '/batScripts/PowerCycle.bat');
		result = parseBatchLog (batLog);
		if (result === false) {
			reject('PowerCycle error');
		} else {
			resolve('PowerCycle ok');
		}
	})
}

const MPTOOL = async (firmwareFile, extcsdFile) => {
	return new Promise(async (resolve, reject) => {
		let batLog,
		result = false;

		console.log('======Mptool======');
		batLog = await myExec(__dirname + `/batScripts/Mptool.bat ${firmwareFile} ${extcsdFile}`);
		result = parseBatchLog (batLog);
		if (result === false) {
			reject('Mptool error');
		} else {
			resolve('Mptool ok');
		}
	})

}

/*
const MPTOOL = async (firmwareFile, extcsdFile) => {
	let batLog;

	console.log('======Mptool======');
	//batLog = await myExec(__dirname + '/batScripts/Mptool.bat ' +  + ' ' extcsdFile);
	batLog = await myExec(__dirname + `/batScripts/Mptool.bat ${firmwareFile} ${extcsdFile}`);
	console.log(batLog);	
}
*/

const testFull = async (msg) => {
	return new Promise(async (resolve, reject) => {
		let result;

		const {extcsdFile, firmwareFile, formatType} = msg;
		try {
			//pre clear
			await preScript();

			//1. MPTOOL
			result = await MPTOOL(firmwareFile, extcsdFile);
			console.log(result);

			//2. CDM test (clean)
			result = await FORMAT(formatType);
			console.log(result);
			result = await CDM('2_clean');
			console.log(result);

			//3. H2testw
			result = await Trim();
			console.log(result);			
			result = await FORMAT(formatType);
			console.log(result);
			result = await H2testw();
			console.log(result);	

			//4. CDM test (dirty)		
			result = await FORMAT(formatType);
			console.log(result);
			result = await CDM('4_dirty');
			console.log(result);

			//5. ATTO
			result = await Trim();
			console.log(result);			
			result = await FORMAT(formatType);
			console.log(result);
			result = await ATTO();
			console.log(result);	
			
			//6. FLCC
			//result = await FORMAT(formatType);
			//console.log(result);
			result = await FLCC();
			console.log(result);

			//7. MFCJunior
			//result = await FORMAT(formatType);
			//console.log(result);
			result = await MFCJunior();
			console.log(result);	
			
			//8. BurnIn test
			//result = await FORMAT(formatType);
			//console.log(result);
			result = await BurnIn();
			console.log(result);

			resolve('success!');
		} catch (err) {
			//Power Cycle
			console.log('ERROR happend: ' + err);
			result = await PowerCycle();
			console.log(result);			
			reject('fail!');
		}
	})
}

process.on('message', async (msg) => {
	let result;
	
	try {
		result = await testFull(msg);
	} catch(err) {
		result = err;
		console.log(err);
	}

	await zip();	
	await mail.init({
		toMail: msg.email,
		firmwareFile: msg.firmwareFile,
		extcsdFile: msg.extcsdFile,
		formatType: msg.formatType,
		result
	});
	await mail.send();

	process.exit(0);
})