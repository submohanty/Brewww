// Load the modules
var express = require('express'); //Express - a web application framework that provides useful utility functions like 'http'
var app = express();
var bodyParser = require('body-parser'); // Body-parser -- a library that provides functions for parsing incoming requests
app.use(bodyParser.json());              // Support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies
var pgp = require('pg-promise')(); // database stuff

const axios = require('axios');
const qs = require('query-string');

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));// Set the relative path; makes accessing the resource directory easier

// TODO: database
const dbConfig = { 
	host: 'db',
	port: 5432,
	database: 'breweries_db',
	user: 'postgres',
	password: 'pwd'
};

var db = pgp(dbConfig);
//

// Brewery code (the stuff that gets displayed)
app.get('/', function(req, res){ 
	res.render('pages/home',{
		my_title: "Brewww",
		items: '',
		error: false,
		message: ''
	});
});

app.get('/reviewpage', function(req, res){
	res.render('pages/reviewpage',{
		my_title: "BrewwwReviews",
		items:'',
		error: false,
		message: ''
	});
});

app.post('/', function (req, res){
	var title = req.body.title;
	var breweryName = req.body.breweryName;
	var breweryReview = req.body.breweryReview;
	var reviewDate = req.body.reviewDate;
	if(title){
		axios({
			url: `https://api.openbrewerydb.org/breweries?by_city=${title}`,
			method: 'GET',
			dataType: 'json',
		})
			.then(items => {
				console.log(items.data);
				res.render('pages/home', {
					my_title: "Breweries",
					items: items.data,
					error: false,
					message: ''
				})
			})
			.catch(error => {
				console.log("error");
			});
	}
});


//app.listen(3000);
const server = app.listen(process.env.PORT || 3000, () => {
	console.log(`Express running → PORT ${server.address().port}`);
  });
console.log("Open localhost://3000 on your browser!");
