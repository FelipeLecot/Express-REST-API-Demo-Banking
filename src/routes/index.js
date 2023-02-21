import express from 'express';
import * as v1 from '../v1/index.js';

const router = express.Router();

let api = {
	"v1": v1
}

router.get('/:version(v[0-9]+)/:function', 
	async (req, res, next) => {
		let attemptAuth = await api.v1.auth(req);
		if (attemptAuth.status == "ok") {
			next();
		}
		else {
			res.send({"status": "error", "errorCode": "403"});
		}
	},
	async (req, res) => {
		let requestedFunction = req.params["function"];
		let functionVersion = req.params["version"];

		try {
			let apiFunction = api[functionVersion][requestedFunction];

			res.json(await apiFunction(req));
		}
		catch (e){
			res.send(e);
			console.error(e);
		}
	}
);

router.post('/auth/login', async (req, res) => {
	try {
		let apiFunction = api['v1']['login'];

		res.send(await apiFunction(req));
	}
	catch (e){
		res.send(e);
		console.error(e);
	}
});

router.get('/error/:error', async (req, res) => {
	let errorCode = req.params["error"];

	let allowedErrorCodes = ["403", "404", "500", "501", "503"];

	if (!allowedErrorCodes.includes(errorCode)) {
		errorCode = "404";
	}
	
	res.status(200).send({status: "error", errorCode: errorCode});
});

export default router;
