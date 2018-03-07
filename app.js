var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
app.use(express.static('views/assets'));
/*
var Zendesk = require('zendesk-node-api');

var zendesk = new Zendesk({
  url: 'https://billmcpherson.zendesk.com',
  email: 'billmcpherson87@gmail.com', 
  token: 'PnqQEsITIETSXoN3xGcNruabkS5keKx5rqX2YhAn'
  });

zendesk.objects.list(
  // (Optional) URL params available for each object.
  // https://developer.zendesk.com/rest_api/docs/core/
).then(function(result){
    console.log(result);
});
*/

var zendesk = require('node-zendesk');

var client = zendesk.createClient({
  username:  'janiano@prosperworks.com',
  token:     'GTaiKLP52NFr0usK53Mo8whLM8cWblBcRFiyz4cm',
  remoteUri: 'https://d3v-prosperworksdev.zendesk.com/api/v2'
});

const Hubspot = require('hubspot');
const hubspot = new Hubspot({ apiKey: '53951da4-2214-491e-8987-8c441b4d9310' });

hubspot.contacts.get(function(err, results) {
  if (err) { console.error(err) }
  console.log('HUBSPOT: ' + JSON.stringify(results.contacts[0]));
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

router.get("/2",function(req,res){
  res.sendFile(path + "index2.html");
});

router.get("/assets",function(req,res){
  res.sendFile(path + "/assets");
});

router.get("/about",function(req,res){
  res.sendFile(path + "about.html");
});

router.get("/contact",function(req,res){
  res.sendFile(path + "contact.html");
});

router.get("/zeninfo",function(req,res){
	var custEmail = req.query.email;
	var query = "type:user email:" + custEmail;

	client.search.query(query, function (err, req, result) {
		var userId;
		if (err) {
			console.log(err);
			res.send(err);
			return;
		}
		
		if(result[0]) {
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
});

app.listen(8080,function(){
  console.log("Live at Port 8080");
});