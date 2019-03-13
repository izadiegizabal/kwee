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

const __url = 'https://www.kwee.ovh/api';
const url = 'http://localhost:3000';
const _url = 'http://h203.eps.ua.es/api';

let obj = 'No file';
let offers = 'No file';
let applicants = 'No file';

let totalOffers = 0;
let limit = null;
let applicationsDone = [];
let offersMap = new Map();


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

async function offerersAndOffers() {
	// offerers JSON
	obj = getFileJSON('./CreateOfferers.json');
	// offers JSON
	offers = getFileJSON('./tests/offers.json');

	// Testing query
		// await axios.get('/users')
		// .then( res => console.log(res.data));

	await asyncForEach( obj, limit, async (e,i) => {
			// sign up bussiness
			let offersCreated = [];
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
				log(" " + res.data.message);
				//console.log(res.data) 
				
				// login bussiness
				await instance.post('/login',{
					"email": e.email,
					"password": e.password
				})
				.then( async loginSuccess => {
					log(" " + success(loginSuccess.data.message))
					let token = loginSuccess.data.token;
					let id = loginSuccess.data.data.id;
					// create random number of offers
					let _limit = randomInt(0,10);

					await asyncForEach( offers, _limit, async (offerElement, index) => {
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
							log(" " + offerCreated.data.message);
							offersCreated.push(offerCreated.data.data.id);
							
						})
						.catch( offerError => {
							log(error("Error creating offer: ") + offerError.response.data.message);
						})

					})
					.then( allOffersCreated => {
						offersMap.set(id,offersCreated);
						offersCreated = [];
					});
					console.log(warning("-----"));
				})
				.catch(login => {
					log(error("Login error: ")+login.response.data.message)
				})

				
			})
			.catch(e => {
				log(error("SignUp error: "));
				if(e.response && e.response.data) {
					console.log(e.response.data);
				}
				else{
					console.log(e);
				}
				// console.log(e.response.data.message);
			});
			
	});

	// get total number of offers to apply
	await instance.get('/offers')
	.then( res => {
		totalOffers = res.data.total;
	});

	console.log(offersMap);

}

async function applicantsAndApplications() {
	applicants = getFileJSON('./tests/applicants.json');
	await asyncForEach( applicants, limit, async (element, i) => {
		// signUp applicant
		await instance.post('/applicant', {
			// body
			"name": element.name,
			"password": element.password,
			"email": element.email,
			"city": element.city,
			"dateBorn": element.dateBorn,
			"premium": element.premium,
			"rol": element.rol
		})
		.then( async signUpSuccess => {
			// signUp applicant successful
			log(" " + signUpSuccess.data.message);
			
			// login applicant
			await instance.post('/login', {
				"email": element.email,
				"password": element.password
			})
			.then( async loginSuccess => {
				log(" " + success(loginSuccess.data.message));
				// login successful
				let token = loginSuccess.data.token;

				let randomApplications = randomInt(0,4);
				let arrApplications = [];
				console.log("totalOffers: " + totalOffers);
				console.log("randomApplications: " + randomApplications);
				if(randomApplications > 0 ){
					for(let i=0;i<randomApplications;i++){
						// Apply to random Offers (until MAX totalOffers)
						arrApplications[i] = randomInt(0,totalOffers); 
					}
					console.log("arrAplications: "+arrApplications);
				}
				await asyncForEach(arrApplications, arrApplications.length, async (application) => {
					// apply to offer random
					await instance.post('/application', {
						// body
						"fk_offer": application
					},
					{
						// headers
						headers: {
							token,
							'Content-Type': 'application/json; charset=utf-8'
						}

					})
					.then( application => {
						log(" application success")//. ApplicantId:" + loginSuccess.data.data.id + " fk_offer:" + arrApplications);
						log( application.data)
					})
					.catch( err => {
						log(error("Error applying: "));
						console.log(err.response.data);
					})
				});
			});
		})
		.catch( signUpFailed => {
			log(error("SignUpFailed"));
			console.log(signUpFailed.response.data.message);
		})
	})
}

async function offerersAccepts(){
	const offerers = getFileJSON('./CreateOfferers.json');
	let closed = [];

	await asyncForEach( offerers, limit, async (element, index ) => {
		// login
		let token = null;
		await instance.post('/login',{
			"email": element.email,
			"password": element.password
		})
		.then( async loginOK => {
			token = loginOK.data.token;
			let offererId = loginOK.data.data.id; 
			closed = [];
			log(warning(" " + loginOK.data.data.id + " accepting applications"));
			
			// for each offer
			offersArray = offersMap.get(offererId);
			console.log("going to close: "+offersArray);
			await asyncForEach(offersArray, offersArray.length, async (offerElement, index ) => {
				await instance.get('/offer/' + offerElement + '/applications')
				.then( async _applications => {
					
					if(_applications.data && _applications.data.data && _applications.data.data.length > 0){
						console.log("Applications of offer " + offerElement + ": " + _applications.data.data.length);
						// console.log(_applications.data.data);
						// if exists applications
						let applications = _applications.data.data;
						console.log("applications: " + applications.length);
						//console.log(applications);
						
						// for each application in the offer
						await asyncForEach( applications, applications.length, async (applicationElement, index) => {
							 console.log("offerId: " + applicationElement.offerId);
							 console.log("applicantId: " + applicationElement.applicantId);

							await instance.put('/application/' + applicationElement.applicationId,{
								// "fk_offer": applicationElement.offerId,
								// "fk_applicant": applicationElement.applicantId, // checks on token
								"status": "0"
							},
							{
								headers:{token,'Content-Type': 'application/json; charset=utf-8'}
							})
							.then( applicationUpdated => { 
								console.log( success(" application accepted") + " offerId:" + applicationElement.offerId + " applicantId:" + applicationElement.applicantId);
								applicationsDone.push(applicationElement.applicationId);
							})
							.catch( e => { 
								log(error("PUT application/"+applicationElement.applicationId))
								log(error("application not accepted"));
								console.log(e.response.data);
							});
						});

					}
					log(warning("closing offer: " + offerElement))
					// close offer
					await instance.put('/offer/'+offerElement,
					{
						"status": 1
					},
					{
						headers:{token,'Content-Type': 'application/json; charset=utf-8'}
					})
					.then( offerClosed => {
						console.log(" offerClosed " + offerElement);
						closed.push(offerElement);
					})
					.catch( e => {
						//console.log(log(error("Error closing offer ")) + e)
						console.log("error closing offer");
					})

				});
			});
		})
		.then( x => {
			console.log("offers closed: " + closed);
		})
		.catch( e => {
			log( error("Problem login offerer:"));
			console.log(e);
		})

	});
}

async function ratings(type){
	if(type=="applicants"){
		await asyncForEach( applicationsDone, applicationsDone.length, async (application, index) => {
			await instance.post('/rating_applicant',{
				"fk_application": application,
				"efficiency": randomInt(0,5),
				"skills": randomInt(0,5),
				"punctuality": randomInt(0,5),
				"hygiene": randomInt(0,5),
				"teamwork": randomInt(0,5),
				"satisfaction": randomInt(0,5)
			})
			.then( done => log(" Rating applicant " + success("ok")) )
			.catch( x => {
				log(error("Problem rating applicant"))
				if(x && x.response && x.response.data!=undefined){
					console.log(x.response.data);	
				}
				else {
					console.log(x);
				}
			});
		});
	}
	else if(type=="offerers"){
		await asyncForEach( applicationsDone, applicationsDone.length, async (application, index) => {
			await instance.post('/rating_offerer',{
				"fk_application": application,
				"salary": randomInt(0,5),
				"environment": randomInt(0,5),
				"partners": randomInt(0,5),
				"services": randomInt(0,5),
				"installations": randomInt(0,5),
				"satisfaction": randomInt(0,5)
			})
			.then( done => log(" Rating offerer " + success("ok")) )
			.catch( x => log(error("Problem rating applicant")));
		});
		
	}
}

async function algorithm(){
	
	await asyncForEach( obj, limit, async (element,index) => {
		await instance.post('/login', {
			"email": element.email,
			"password": element.password
		})
		.then( async result => {
			console.log("login ok");
			// console.log(result.data);
			await instance.get('/experiences/index/'+result.data.data.id)
			.then( ok => {
				log(success("algorithm updated") + " offerer " + result.data.data.id);
			})
		})
		.catch( error => {
			console.log(error);
		})
	});

	await asyncForEach( applicants, limit, async (element,index) => {
		await instance.post('/login', {
			"email": element.email,
			"password": element.password
		})
		.then( async result => {
			// console.log(result.data);
			console.log("login ok");
			await instance.get('/experiences/index/'+result.data.data.id)
			.then( ok => {
				log(success("algorithm updated") + " applicant " + result.data.data.id);
			})
		})
		.catch( error => {
			console.log(error);
		})
	})
}

////////////////////////////////////////// EXECUTE CODE
var instance = axios.create({
  baseURL: url,
  timeout: 4000,
	headers: {
		'Content-Type': 'application/json; charset=utf-8'
	}
});
async function main() {
	//signupOfferersAndOffers('./CreateOfferers.json');
	limit = 10;
	// 1- SignUp Offerers and publish offers
	await offerersAndOffers();
	
	// 2- Applicants apply to random offers
	await applicantsAndApplications();
	
	// 3- Offerers accepts random applications
	log(warning("--"));
	log(warning("Offerers login"))
	await offerersAccepts();
	

	//////
	// ratings
	//////
	// --> when routes updated to require TOKEN ==>> update ratings functions too!!
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	console.log(applicationsDone);
	// 4- Rate offerers
	await ratings("offerers");
	
	// 5- Rate applicants
	await ratings("applicants");

	
	// console.log("doing algorithm things xd");
	// update algorithm (TO FIX in API and avoid doing here)
	await algorithm();

}	

main();



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
