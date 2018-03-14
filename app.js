var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
app.use(express.static('views/assets'));

const Hubspot = require('hubspot');
const hubspot = new Hubspot({ apiKey: '0274058e-bbc5-479f-9979-c1d603554cd1'});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

router.get("/sidebar",function(req,res){
  res.sendFile(path + "index.html");
});

router.get("/2",function(req,res){
  res.sendFile(path + "index2.html");
});

router.get("/contactsbycompany", function(req, res) {
	var domain = req.query.domain;

	hubspot.companies.getByDomain(domain, function(err, result) {

		var companyId = result[0].companyId;

		hubspot.companies.getContactIds(companyId, function(err, result) {
			var ids = result.vids;
			hubspot.contacts.getByIdBatch(result.vids, function(err, result) {
				var c = [];
				ids.forEach(function(element) {
					c.push(result[element]);
				});
				res.send(c);
			});
		});
	});
});

router.get("/contactsforcontact", function(req, res) {
	var email = req.query.email;

	hubspot.contacts.getByEmail(email, function(err, result) {
		console.log('EMAIL: ' + email);
		console.log('RESULT: ' + JSON.stringify(result));
		res.send(result);
	});

});

router.get("/hsinfo",function(req,res){
	var custEmail = req.query.email;
	var query = "type:user email:" + custEmail;
	client.search.query(query, function (err, req, result) {
		console.log("debuginquery");
		var userId;
		if (err) {
			console.log("debugerror");
			console.log(err);
			res.send(err);
			return;
		}
		
		if(result[0]) {
			console.log("debugresult");
			console.log(result);

			userId = result[0].id;

			var ticks = client.tickets.listByUserRequested(userId, function (err, statusList, body, responseList, resultList) {
			if (err) {
				console.log(err);
				return;
			}
			res.send(body);
		});

		} else {
			res.send(result);
		}
	});	  
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
  console.log('Failed Request Made for: ' + req.baseUrl);
});

app.listen(8080,function(){
  console.log("Live at Port 8080");
});
