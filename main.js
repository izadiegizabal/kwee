/////////// AXIOS
/*



axios.get('https://kwee.ovh/offers/')
  .then(response => {
    log(response);
  })
  .catch(error => {
    log(error);
  });

*/
/////////// ALTERNATIVE TYPED REQUEST 
/*request.post(options, function(err, res, body) {//options not actually hard-coded, but for example sake
  if (err) {
   log(body);
   return;
 }
 log(body);
});*/
//////////////////////////////////////// imports
const request = require('request-promise-native');
const fs = require('fs');
const axios = require('axios');
////////////////////////////////////////

//////////////////////////////////////// colors
const chalk = require('chalk');
const log = console.log;
const nl = '\r';
const blue = chalk.blue;
const good = chalk.bold.green;
const success = chalk.bgGreen;
const wrong = chalk.bgRed;
const error = chalk.bold.red;
const warning = chalk.keyword('orange');
////////////////////////////////////////

const url = 'https://www.kwee.ovh/api';
const _url = 'http://localhost:3000';
const __url = 'http://h203.eps.ua.es/api';

let obj = 'No file';
let offers = 'No file';

let headersOP = {  
    "content-type": "application/json",
};
let options = {};

function getFileJSON(path){
	// './CreateCandidates.json'
	return JSON.parse(fs.readFileSync(path, 'utf8'));
}

async function asyncForEach(array, limit, callback) {
  for (let index = 0; index < limit; index++) {
    await callback(array[index], index, array);
  }
}
/////////////////////////////// ejemplo de for
const start = async () => {
  await asyncForEach([1, 2, 3], async (num) => {
    await waitFor(50);
    console.log(num);
  });
  log('Done');
}
/////////////////////////////// ejemplo de for


const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

const signupOfferersAndOffers = async(path) => {
	// get the file
	getFileJSON(path);
	// set the offere signup options
	/*options = {
	  headers: headersOP,
	  uri: url+'/api/login',
	  method: 'POST',
	  json: true,
	  body: {
	    "email": "facebook@kwee.ovh",
	    "password": "Contrasena_1"
	  }
	};*/

	log(obj.length);

	await asyncForEach( obj,  async (e,i) => {
		log('Preparing offerer ' + blue(i));
		options = {
		  headers: {  
			    "content-type": "application/json",
			},
		  uri: url+'/api/offerer',
		  method: 'POST',
		  json: true,
		  body: {
		    "name": e.name,
			"password": e.password,
			"email": e.email,
			"cif": e.cif,
			"address": e.address,
			"workField": e.workField,
			"year": e.year,
			"premium": e.premium.toString(),
			"companySize": e.companySize,
			"bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed scelerisque tellus. Curabitur nec erat lacus. Fusce mollis rhoncus nunc ut elementum. Praesent lobortis consequat imperdiet. Mauris rutrum, purus non luctus tristique, eros urna volutpat magna, et posuere diam diam convallis lorem. In sed nunc tortor. Donec magna justo, commodo eu commodo vitae, vehicula et nisl. Nunc malesuada lobortis elit et pretium. Aliquam dignissim enim sit amet ante suscipit ornare. Aliquam sit amet vehicula tortor. Sed non sagittis erat, eget placerat nisl. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent ante massa, porta ac sapien et, aliquet consectetur felis. Suspendisse vestibulum commodo turpis. Etiam blandit erat nec erat tincidunt tincidunt. \n\nEtiam accumsan erat non tincidunt commodo. Proin pharetra eu turpis nec finibus. Mauris pharetra, leo ut pharetra porta, purus purus commodo diam, eget aliquam metus elit nec lorem. Sed mollis purus ligula, eget vestibulum lectus consectetur et. Maecenas finibus at lorem imperdiet aliquet. Integer aliquam purus vel lorem suscipit, ac iaculis neque euismod. Sed ultricies ac lorem et tempor. Integer lacinia sem sapien, vitae bibendum lorem posuere at. Maecenas urna est, mollis in congue sit amet, sagittis varius velit. Sed ac feugiat ex, quis dignissim dolor. Sed mauris mauris, varius ac arcu quis, ornare finibus diam. Sed ac quam odio.",
			"img": e.img,
			"status": e.status,
			"lon": e.lon,
			"lat": e.lat
		  }
		};

		optionss = {
			  headers: headersOP,
			  uri: url+'/api/login',
			  method: 'POST',
			  json: true,
			  body: {
				"password": e.password,
				"email": e.email,
			  }
			};

		let token = 0;


		if(i === 0){

		await request(options)
			.then(function (e) {
	         	log(good('Offerer created'));
		    })
		    .catch(function (err) {
		        log(error(err));
		    });
		
		//await waitFor(333);
		await request(optionss)
			.then(function (e) {
	         	log(good('Offerer created'));
	         	token = e.token;
		    })
		    .catch(function (err) {
		        log(error(err));
		    });
		//await waitFor(333);

	  	await asyncForEach(e.offers, async (ele,ii) => {
		  	options = {
			  headers: {  
				"content-type": "application/json",
				"token" : token
			  },
			  uri: url+'/api/offer',
			  method: 'POST',
			  json: true,
			  body: {
				"status": ele.status,
			    "title": ele.title,
			    "description": ele.description,
			    "datePublished": ele.datePublished,
			    "dateStart": ele.dateStart,
			    "dateEnd": ele.dateEnd,
			    "location": ele.location,
			    "salaryAmount": ele.salaryAmount,
			    "salaryFrecuency": ele.salaryFrecuency,
			    "salaryCurrency": ele.salaryCurrency,
			    "workLocation": ele.workLocation,
			    "seniority": ele.seniority,
			    "maxApplicants": ele.maxApplicants,
			    "duration": ele.duration,
			    "durationUnit": ele.durationUnit,
			    "contractType": ele.contractType,
			    "isIndefinite": ele.isIndefinite,
			    "currentApplications": ele.currentApplications,
			    "responsabilities": ele.responsabilities,
			    "requeriments": ele.requeriments,
			    "skills": ele.skills.join(','),
				"lon": ele.lon,
				"lat": ele.lat
			  }
			}

			await request(optionss)
			.then(function (e) {
	         	log(good('Offer Created'));
	         	token = e.token;
		    })
		    .catch(function (err) {
		        log(error(err));
		    });
	  	});

	  }






		// SIGNUP
		/*await request(options, async (err, res, body) => {
		  if (body === undefined body.ok === 'false') { return log(`${wrong('Error!:')} ${error(options.body.email)}`);}
		  else { 
		  	log(`${good('Offerer created')}`);
		  	options = {
			  headers: headersOP,
			  uri: url+'/api/login',
			  method: 'POST',
			  json: true,
			  body: {
				"password": e.password,
				"email": e.email,
			  }
			};
			// LOGIN
		  	await request(options, async (err, res, body) => {
			  if (body && body.ok === 'false') { return log(`${wrong('Error!:')} ${error(options.body)}`);}
			  else { 
			  	log(`${good('Offerer logged')}`);
			  	// CREATE OFFERS
			  	e.offers.forEach( async (ele,i) => {
				  	options = {
					  headers: {  
						"content-type": "application/json",
						"token" : 'kjjkn'//body.token
					  },
					  uri: url+'/api/offer',
					  method: 'POST',
					  json: true,
					  body: {
						"status": ele.status,
					    "title": ele.title,
					    "description": ele.description,
					    "datePublished": ele.datePublished,
					    "dateStart": ele.dateStart,
					    "dateEnd": ele.dateEnd,
					    "location": ele.location,
					    "salaryAmount": ele.salaryAmount,
					    "salaryFrecuency": ele.salaryFrecuency,
					    "salaryCurrency": ele.salaryCurrency,
					    "workLocation": ele.workLocation,
					    "seniority": ele.seniority,
					    "maxApplicants": ele.maxApplicants,
					    "duration": ele.duration,
					    "durationUnit": ele.durationUnit,
					    "contractType": ele.contractType,
					    "isIndefinite": ele.isIndefinite,
					    "currentApplications": ele.currentApplications,
					    "responsabilities": ele.responsabilities,
					    "requeriments": ele.requeriments,
					    "skills": ele.skills.join(','),
						"lon": ele.lon,
						"lat": ele.lat
					  }
					}
				  	await request(options, (err, res, body) => {
					  if (body && body.ok === 'false') { return log(`${wrong('Error!:')} ${error(options.body)}`);}
					  else { 
					  	log(`${good('Offer created')}`);
					  }
					});
			  	});
			  }
			});
		  }
		});*/



	});
}

function randomInt(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

async function offerersAndOffers( path ) {
	// offerers JSON
	obj = getFileJSON('./CreateOfferers.json');
	// offers JSON
	offers = getFileJSON('./tests/offers.json');

	// Testing query
		// await axios.get('/users')
		// .then( res => console.log(res.data));

	await asyncForEach( obj, 2, async (e,i) => {
			// sign up bussiness
			await instance.post('/offerer', {
				"name": e.name,
				"password": e.password,
				"email": e.email,
				"cif": e.cif,
				"address": e.address,
				"workField": e.workField,
				"year": e.year,
				"premium": e.premium.toString(),
				"companySize": e.companySize,
				"bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed scelerisque tellus. Curabitur nec erat lacus. Fusce mollis rhoncus nunc ut elementum. Praesent lobortis consequat imperdiet. Mauris rutrum, purus non luctus tristique, eros urna volutpat magna, et posuere diam diam convallis lorem. In sed nunc tortor. Donec magna justo, commodo eu commodo vitae, vehicula et nisl. Nunc malesuada lobortis elit et pretium. Aliquam dignissim enim sit amet ante suscipit ornare. Aliquam sit amet vehicula tortor. Sed non sagittis erat, eget placerat nisl. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent ante massa, porta ac sapien et, aliquet consectetur felis. Suspendisse vestibulum commodo turpis. Etiam blandit erat nec erat tincidunt tincidunt. \n\nEtiam accumsan erat non tincidunt commodo. Proin pharetra eu turpis nec finibus. Mauris pharetra, leo ut pharetra porta, purus purus commodo diam, eget aliquam metus elit nec lorem. Sed mollis purus ligula, eget vestibulum lectus consectetur et. Maecenas finibus at lorem imperdiet aliquet. Integer aliquam purus vel lorem suscipit, ac iaculis neque euismod. Sed ultricies ac lorem et tempor. Integer lacinia sem sapien, vitae bibendum lorem posuere at. Maecenas urna est, mollis in congue sit amet, sagittis varius velit. Sed ac feugiat ex, quis dignissim dolor. Sed mauris mauris, varius ac arcu quis, ornare finibus diam. Sed ac quam odio.",
				"img": e.img,
				"status": e.status,
				"lon": e.lon,
				"lat": e.lat
	
			})
			.then( async res => { 
				log(i + " " +success("SignUp Success"));
				console.log(res.data) 
				
				// login bussiness
				await instance.post('/login',{
					"email": e.email,
					"password": e.password
				})
				.then( async loginSuccess => {
					log(" " + success("Login Success"))
					let token = loginSuccess.data.token;

					// create random number of offers
					let limit = randomInt(0,10);

					await asyncForEach( offers, limit, async (offerElement, index) => {
						await instance.post("/offer", {
							// body
							"status": offerElement.status,
							"title": offerElement.title,
							"description": offerElement.description,
							"datePublished": offerElement.datePublished,
							"dateStart": offerElement.dateStart,
							"dateEnd": offerElement.dateEnd,
							"location": offerElement.location,
							"salaryAmount": offerElement.salaryAmount,
							"salaryFrequency": offerElement.salaryFrequency,
							"salaryCurrency": offerElement.salaryCurrency,
							"workLocation": offerElement.workLocation,
							"seniority": offerElement.seniority,
							"maxApplicants": offerElement.maxApplicants,
							"duration": offerElement.duration,
							"durationUnit": offerElement.durationUnit,
							"contractType": offerElement.contractType,
							"isIndefinite": offerElement.isIndefinite,
							"currentApplications": offerElement.currentApplications,
							"responsabilities": offerElement.responsabilities,
							"requeriments": offerElement.requeriments,
							"skills": offerElement.skills,
						},
						{
							// headers
							headers: { 
								token, 
								'Content-Type': 'application/json; charset=utf-8'
							}
						})
						.then( offerCreated => {
							log(" " + success("Offer created"));
							// console.log(offerCreated);
						})
						.catch( offerError => {
							log(error("Error creating offer: ") + offerError.message);
						})

					});
					console.log(warning("-----"));
				})
				.catch(login => {
					log(error("Login error: ")+login.message)
				})

				
			})
			.catch(e => {
				log(error("SignUp error: ")+e.message);
			});
	

		
	});



}

////////////////////////////////////////// EXECUTE CODE
var instance = axios.create({
  baseURL: url,
  timeout: 4000,
	headers: {
		'Content-Type': 'application/json; charset=utf-8'
	}
});
//signupOfferersAndOffers('./CreateOfferers.json');

// 1- SignUp Offerers and publish offers
offerersAndOffers();

// 2- Applicants apply to random offers
// applicantsAndApplications();

// 3- Offerers accepts random applications
// offerersAccepts();

// 4- Rate offerers
// ratings();

// 5- Rate applicants
// ratings();




////////////////////////////////////////// IMAGES

/*var glob = require("glob")
 

 var files = 0;
// options is optional
files = glob.sync("*.png");


var base64Img = require('base64-img');

for (var i = 0; i < files.length; i++) {
	files[i] = base64Img.base64Sync(files[i]);
}*/

//fs.writeFileSync('candidateImages.json', JSON.stringify({ img: files}, null, 4));



////////////////////////////////////////// COLORS

/*log(chalk.bgGreen('Hello world!'));
log(chalk`
CPU: ${chalk.red('90%')}
RAM: ${chalk.green('40%')}
DISK: {rgb(255,131,0) ${'disk.used / disk.total * 100'}%}
`);

log(chalk`err: ${chalk.red('options.body.email')}`);

log(error('Error!'));
log(warning('Warning!'));*/
