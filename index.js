/* These variables initiate the server. The server uses a bunch of dependecies
like express and postgresql. The variables seen here don't make a whole lot of
sense but the packages running through node understand what they mean. */
const express = require('express');
const methodOverride  = require("method-override");
const path = require('path');
const PORT = process.env.PORT || 5000
const pgp = require('pg-promise');
const { Pool } = require('pg');
const router = express.Router({ mergeParams: true });
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true
});
let app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use( express.static( 'public' ) );

app.use(express.urlencoded({extended: true }));
//This is the main page that has links to the pages that do the fun stuff.
app.get('/main', async (req, res) => {
	try {
		const client = await pool.connect()
		res.render('pages/main');
		client.release();
	} catch (err) {
		console.error(err);
		res.send("Error " + err);
	}
});
/* This function finds the rank of each hero in relation to every other hero 
	for each different statistic. */
function calculateRanks(result) {
	/* This function searches through an array of objects (defined as 'array') 
	until it finds the index of the object with the property with a value 
	(defined as 'attr')equal to the value (defined as 'value') of the parameter 
	specified. */
	function findWithAttr(array, attr, value) {
		for (let j = 0; j < array.length; j++) {
			if (array[j][attr] === value) {
				return j;
			}
		}
		return -1;
	}
	/* We start by sorting the data based on the chosen property, in this case, 
	killspergame. the 'result' array contains 111 objects, one for each hero. */
	result.rows.sort(function(a, b) {
		return b.killspergame - a.killspergame;
	});
	/* Next we loop through the 'results' array and find the index of each hero 
	(specified by their property 'id'). For example, Pudge's id is 68. Let's say 
	his killspergame is 15 which would be let's say the third highest of all 
	heroes. The sort function above sorts all the heroes by their killspergame 
	property. Since Pudge has the third most killspergame, he would be at the 
	index of 2 in that array. So findWithAttr would search through the 'results' 
	array until it found the object with the 'id' property equal to 68. It would 
	find it at index 2 of the array. We add 1 to this to indicate that he is the 
	3rd highest hero and save this result as the property 'killrank' of Pudge's 
	object. Note that these ranks are not saved to the postgresql database. They
	are recalculated with this function each time the user makes a GET request.
	*/
	for (let i = 0; i < 111; i++) {
		result.rows[i].killrank = findWithAttr(result.rows, 'id', result.rows[i].id)+1;
	}
	//We repeat that process for every property of the hero objects.
	result.rows.sort(function(a, b) {
		return b.assistspergame - a.assistspergame;
	});
	for (let i = 0; i < 111; i++) {
		result.rows[i].assistrank = findWithAttr(result.rows, 'id', result.rows[i].id)+1;
	}
	result.rows.sort(function(a, b) {
		return a.deathspergame - b.deathspergame;
	});
	for (let i = 0; i < 111; i++) {
		result.rows[i].deathrank = findWithAttr(result.rows, 'id', result.rows[i].id)+1;
	}
	result.rows.sort(function(a, b) {
		return b.creeppergame - a.creeppergame;
	});
	for (let i = 0; i < 111; i++) {
		result.rows[i].creeprank = findWithAttr(result.rows, 'id', result.rows[i].id)+1;
	}
	result.rows.sort(function(a, b) {
		return a.neutralpergame - b.neutralpergame;
	});
	for (let i = 0; i < 111; i++) {
		result.rows[i].neutralrank = findWithAttr(result.rows, 'id', result.rows[i].id)+1;
	}
	result.rows.sort(function(a, b) {
		return b.kdratio - a.kdratio;
	});
	for (let i = 0; i < 111; i++) {
		result.rows[i].kdratiorank = findWithAttr(result.rows, 'id', result.rows[i].id)+1;
	}
	result.rows.sort(function(a, b) {
		return b.pvprating - a.pvprating;
	});
	for (let i = 0; i < 111; i++) {
		result.rows[i].pvpratingrank = findWithAttr(result.rows, 'id', result.rows[i].id)+1;
	}
	result.rows.sort(function(a, b) {
		return b.gamescore - a.gamescore;
	});
	for (let i = 0; i < 111; i++) {
		result.rows[i].gamescorerank = findWithAttr(result.rows, 'id', result.rows[i].id)+1;
	}
	result.rows.sort(function(a, b) {
		return b.efficiency - a.efficiency;
	});
	for (let i = 0; i < 111; i++) {
		result.rows[i].efficiencyrank = findWithAttr(result.rows, 'id', result.rows[i].id)+1;
	}
	result.rows.sort(function(a, b) {
		return b.games - a.games;
	});
	for (let i = 0; i < 111; i++) {
		result.rows[i].gamerank = findWithAttr(result.rows, 'id', result.rows[i].id)+1;
	}
	/* The property called 'overall' is the average of each hero's other ranks.
	We calculate it by adding up the other 9 ranks and dividing by 9. A for loop
	is used to do this for each hero. The 'result' array is then sorted by the
	property 'overall'. Each object is then assigned their 'overallrank' based
	on their index in that array. */
	for (let i = 0; i < 111; i++) {
		result.rows[i].overall = ((result.rows[i].killrank + result.rows[i].assistrank + result.rows[i].deathrank + result.rows[i].creeprank + result.rows[i].neutralrank + result.rows[i].kdratiorank + result.rows[i].pvpratingrank + result.rows[i].gamescorerank + result.rows[i].efficiencyrank)/9).toFixed(2);
	}
	result.rows.sort(function(a, b) {
		return a.overall - b.overall;
	});
	for (let i = 0; i < 111; i++) {
		result.rows[i].overallrank = findWithAttr(result.rows, 'id', result.rows[i].id)+1;
	}
	//Finally we sort the result array by the heroes' id.
	result.rows.sort(function(a, b) {
		return a.id - b.id;
	});
}
/* The leaderboard page displays a table with each hero accompanied by their
ranks in relation to every other hero in the 10 different statistical 
categories. The user is able to sort the table based on each category. I tried 
using client side javascript to implement a sort function but it was slow and
buggy. It's simpler and easier to have a different page for each category. So 
here is the function that creates and renders those pages. It takes in a 
parameter 'sortBy', which is the name of the category that the table will be 
sorted by. 'asc' and 'desc' which are at the end of the sortBy parameter 
determine if the order will be ascending or descending. Note that the 
calculateRanks function is called here, after the data is pulled from the sql 
database but before the data is rendered to the page. */
function leaderboardCreator(sortBy) {
	app.get('/leaderboard' + sortBy, async (req, res) => {
		try {
			const client = await pool.connect()
			let result = await client.query('SELECT * FROM dota_stats ORDER BY id');
			calculateRanks(result);
			let results = { 'results': (result) ? result.rows : null};
			//The strings are concatenated to give us the path of the page.
			res.render('pages/leaderboard' + sortBy, results );
			client.release();
		} catch (err) {
			console.error(err);
			res.send("Error " + err);
		}
	});
};
leaderboardCreator('');
leaderboardCreator('idasc');
leaderboardCreator('iddesc');
leaderboardCreator('killsasc');
leaderboardCreator('killsdesc');
leaderboardCreator('deathsasc');
leaderboardCreator('deathsdesc');
leaderboardCreator('assistsasc');
leaderboardCreator('assistsdesc');
leaderboardCreator('creepasc');
leaderboardCreator('creepdesc');
leaderboardCreator('neutralasc');
leaderboardCreator('neutraldesc');
leaderboardCreator('kdratioasc');
leaderboardCreator('kdratiodesc');
leaderboardCreator('pvpratingasc');
leaderboardCreator('pvpratingdesc');
leaderboardCreator('gamescoreasc');
leaderboardCreator('gamescoredesc');
leaderboardCreator('efficiencyasc');
leaderboardCreator('efficiencydesc');
leaderboardCreator('overallasc');
leaderboardCreator('overalldesc');

leaderboardCreator('idpergameasc');
leaderboardCreator('idpergamedesc');
leaderboardCreator('killspergameasc');
leaderboardCreator('killspergamedesc');
leaderboardCreator('deathspergameasc');
leaderboardCreator('deathspergamedesc');
leaderboardCreator('assistspergameasc');
leaderboardCreator('assistspergamedesc');
leaderboardCreator('creeppergameasc');
leaderboardCreator('creeppergamedesc');
leaderboardCreator('neutralpergameasc');
leaderboardCreator('neutralpergamedesc');
leaderboardCreator('kdratiopergameasc');
leaderboardCreator('kdratiopergamedesc');
leaderboardCreator('pvpratingpergameasc');
leaderboardCreator('pvpratingpergamedesc');
leaderboardCreator('gamescorepergameasc');
leaderboardCreator('gamescorepergamedesc');
leaderboardCreator('efficiencypergameasc');
leaderboardCreator('efficiencypergamedesc');
leaderboardCreator('overallpergameasc');
leaderboardCreator('overallpergamedesc');

leaderboardCreator('idtotalsasc');
leaderboardCreator('idtotalsdesc');
leaderboardCreator('gamestotalsasc');
leaderboardCreator('gamestotalsdesc');
leaderboardCreator('killstotalsasc');
leaderboardCreator('killstotalsdesc');
leaderboardCreator('deathstotalsasc');
leaderboardCreator('deathstotalsdesc');
leaderboardCreator('assiststotalsasc');
leaderboardCreator('assiststotalsdesc');
leaderboardCreator('creeptotalsasc');
leaderboardCreator('creeptotalsdesc');
leaderboardCreator('neutraltotalsasc');
leaderboardCreator('neutraltotalsdesc');
leaderboardCreator('kdratiototalsasc');
leaderboardCreator('kdratiototalsdesc');
leaderboardCreator('pvpratingtotalsasc');
leaderboardCreator('pvpratingtotalsdesc');
leaderboardCreator('gamescoretotalsasc');
leaderboardCreator('gamescoretotalsdesc');
leaderboardCreator('efficiencytotalsasc');
leaderboardCreator('efficiencytotalsdesc');
leaderboardCreator('overalltotalsasc');
leaderboardCreator('overalltotalsdesc');

//Here we send data to and render the main pages for the sentinel and scourge.
app.get('/sentinel', async (req, res) => {
	try {
		const client = await pool.connect()
		const result = await client.query('SELECT * FROM dota_stats ORDER BY id');
		calculateRanks(result);
		const results = { 'results': (result) ? result.rows : null};
		res.render('pages/sentinel', results );
		client.release();
	} catch (err) {
		console.error(err);
		res.send("Error " + err);
	}
});

app.get('/scourge', async (req, res) => {
	try {
		const client = await pool.connect()
		const result = await client.query('SELECT * FROM dota_stats ORDER BY id');
		calculateRanks(result);
		const results = { 'results': (result) ? result.rows : null};
		res.render('pages/scourge', results );
		client.release();
	} catch (err) {
		console.error(err);
		res.send("Error " + err);
	}
});

app.get('/sentinelpicker', async (req, res) => {
	try {
		const client = await pool.connect()
		const result = await client.query('SELECT * FROM dota_stats ORDER BY id');
		calculateRanks(result);
		const results = { 'results': (result) ? result.rows : null};
		res.render('pages/sentinelpicker', results );
		client.release();
	} catch (err) {
		console.error(err);
		res.send("Error " + err);
	}
});

app.get('/scourgepicker', async (req, res) => {
	try {
		const client = await pool.connect()
		const result = await client.query('SELECT * FROM dota_stats ORDER BY id');
		calculateRanks(result);
		const results = { 'results': (result) ? result.rows : null};
		res.render('pages/scourgepicker', results );
		client.release();
	} catch (err) {
		console.error(err);
		res.send("Error " + err);
	}
});

/* When the user clicks on a hero's name, they are sent to the 'updatesentinel' 
page. This page shows a table with each hero's raw statistics
in each category as well as their rank in relation to all other heroes in that
category. The ranks are sent from the 'sentinel' page as 'req.body'. These are 
the same ranks that were calulated in the above '/sentinel' get request. They 
are passed from 'index.js' to the '/sentinel' page back to 'index.js' and 
finally to the '/updatesentinel' page. They are also sent to the sql database in 
this function so that we can do a request to get the selected hero's rank. We do
this because the 'result' data that is being sent through the various pages 
contains the data for all heroes and for the '/updatesentinel' page, we just 
want the selected hero, as calculated by the 'idnumber' variable which is the 
same as 'req.body.identifier' which is derived from the id of the hero that the
user clicks on on the '/sentinel' page. Note that even though we are using 
UPDATE to write data to the sql server, the 'rank' values will be overwritten 
with the 'calculateRanks' function each time the user navigates to any of the 
pages. */
app.post('/updatesentinel', async (req, res) => {
	try {
		const client = await pool.connect();
		var idnumber = req.body.identifier;
		var gamerank  = req.body.gamerank;
		var killrank = req.body.killrank;
		var deathrank = req.body.deathrank;
		var assistrank = req.body.assistrank;
		var creeprank = req.body.creeprank;
		var neutralrank = req.body.neutralrank;
		var kdratiorank = req.body.kdratiorank;
		var pvpratingrank = req.body.pvpratingrank;
		var gamescorerank = req.body.gamescorerank;
		var efficiencyrank = req.body.efficiencyrank;
		var overallrank = req.body.overallrank;
		const setranks = await client.query('UPDATE dota_stats SET killrank = ' + killrank + ', deathrank = ' + deathrank + ', assistrank = ' + assistrank + ', creeprank = ' + creeprank + ', neutralrank = ' + neutralrank + ', kdratiorank = ' + kdratiorank + ', pvpratingrank = ' + pvpratingrank + ', gamescorerank = ' + gamescorerank + ', efficiencyrank = ' + efficiencyrank + ', overallrank = ' + overallrank + ', gamerank = ' + gamerank + ' WHERE id = ' + idnumber);
		const result = await client.query('SELECT * FROM dota_stats WHERE id = ' + idnumber);
		const results = { 'results': (result) ? result.rows : null};
		res.render('pages/updatesentinel', results );
	client.release();
	} catch (err) {
		console.error(err);
		res.send("Error " + err);
	}
});

//We do the same thing for the scourge heroes.
app.post('/updatescourge', async (req, res) => {
	try {
		const client = await pool.connect();
		var idnumber = req.body.identifier;
		var gamerank  = req.body.gamerank;
		var killrank = req.body.killrank;
		var deathrank = req.body.deathrank;
		var assistrank = req.body.assistrank;
		var creeprank = req.body.creeprank;
		var neutralrank = req.body.neutralrank;
		var kdratiorank = req.body.kdratiorank;
		var pvpratingrank = req.body.pvpratingrank;
		var gamescorerank = req.body.gamescorerank;
		var efficiencyrank = req.body.efficiencyrank;
		var overallrank = req.body.overallrank;
		const setranks = await client.query('UPDATE dota_stats SET killrank = ' + killrank + ', deathrank = ' + deathrank + ', assistrank = ' + assistrank + ', creeprank = ' + creeprank + ', neutralrank = ' + neutralrank + ', kdratiorank = ' + kdratiorank + ', pvpratingrank = ' + pvpratingrank + ', gamescorerank = ' + gamescorerank + ', efficiencyrank = ' + efficiencyrank + ', overallrank = ' + overallrank + ', gamerank = ' + gamerank + ' WHERE id = ' + idnumber);
		const result = await client.query('SELECT * FROM dota_stats WHERE id = ' + idnumber);

		const results = { 'results': (result) ? result.rows : null};
		res.render('pages/updatescourge', results );
	client.release();
	} catch (err) {
		console.error(err);
		res.send("Error " + err);
	}
});



/* Because we want to send data to the page but we don't know exactly which 
data to send until the user clicks on a hero, we need to use a POST request.
However, since we are sending data as 'req.body', we need to treat it as a PUT
request. We do this with the package called 'methodOverride'. The following line
calls that package as part of the express package.*/
app.use(methodOverride('_method'));

// The following PUT request send the data to the sql server with UPDATE.
app.put('/resourcesentinel', async (req, res) => {
	const client = await pool.connect();
	//We add the hero's new data to the old data and convert to integers.
	var totalgames = parseInt(req.body.games) + parseInt(req.body.oldgames);
	var totalkills = parseInt(req.body.kills) + parseInt(req.body.oldkills);
	var totaldeaths = parseInt(req.body.deaths) + parseInt(req.body.olddeaths);
	var totalassists = parseInt(req.body.assists) + parseInt(req.body.oldassists);
	var totalcreep = parseInt(req.body.creep) + parseInt(req.body.oldcreep);
	var totalneutral = parseInt(req.body.neutral) + parseInt(req.body.oldneutral);
	
	var killspergame = totalkills/totalgames;
	var deathspergame = totaldeaths/totalgames;
	var assistspergame = totalassists/totalgames;
	var creeppergame = totalcreep/totalgames;
	var neutralpergame = totalneutral/totalgames;
	/*Pergame data is divided by the 'games' property. To avoid divide by 0 
	errors, we add a bit of code in the case of 'games' being equal to 0. */
	if (totaldeaths === 0) {
		/* Finally the derived categories 'kdratio', 'pvprating',
		'gamescore' and 'efficiency' are calculated. */
		var kdratio = totalkills;
		var pvprating = (totalkills+(totalassists/2));
		var efficiency = ((totalkills*10)+(totalassists*5)+(totalcreep-totalneutral));
	} else{
		var kdratio = totalkills/totaldeaths;
		var pvprating = (totalkills+(totalassists/2))/totaldeaths;
		var efficiency = ((totalkills*10)+(totalassists*5)+(totalcreep-totalneutral))/totaldeaths;	
	};
	var gamescore = ((totalkills*10)+(totalassists*5)+(totalcreep-totalneutral)-(totaldeaths*10))/totalgames;

	const result = await client.query('UPDATE dota_stats SET games = ' + totalgames + ', kills = ' + totalkills + ', deaths = ' + totaldeaths + ', assists = ' + totalassists + ', creep = ' + totalcreep + ', neutral = ' + totalneutral + ', kdratio = ' + kdratio + ', pvprating = ' + pvprating + ', gamescore = ' + gamescore + ', efficiency = ' + efficiency + ', killspergame = ' + killspergame + ', deathspergame = ' + deathspergame + ', assistspergame = ' + assistspergame + ', creeppergame = ' + creeppergame + ', neutralpergame = ' + neutralpergame + ' WHERE id = ' + req.body.id);

	const results = { 'results': (result) ? result.rows : null};
	//User is sent back to the '/sentinel' page.
	res.redirect('/sentinel');
	client.release();
});


//We do the same thing for the scourge heroes.
app.put('/resourcescourge', async (req, res) => {
	const client = await pool.connect();

	var totalgames = parseInt(req.body.games) + parseInt(req.body.oldgames);
	var totalkills = parseInt(req.body.kills) + parseInt(req.body.oldkills);
	var totaldeaths = parseInt(req.body.deaths) + parseInt(req.body.olddeaths);
	var totalassists = parseInt(req.body.assists) + parseInt(req.body.oldassists);
	var totalcreep = parseInt(req.body.creep) + parseInt(req.body.oldcreep);
	var totalneutral = parseInt(req.body.neutral) + parseInt(req.body.oldneutral);
	
	var killspergame = totalkills/totalgames;
	var deathspergame = totaldeaths/totalgames;
	var assistspergame = totalassists/totalgames;
	var creeppergame = totalcreep/totalgames;
	var neutralpergame = totalneutral/totalgames;
	if (totaldeaths === 0) {
		var kdratio = totalkills;
		var pvprating = (totalkills+(totalassists/2));
		var efficiency = ((totalkills*10)+(totalassists*5)+(totalcreep-totalneutral));
	} else{
		var kdratio = totalkills/totaldeaths;
		var pvprating = (totalkills+(totalassists/2))/totaldeaths;
		var efficiency = ((totalkills*10)+(totalassists*5)+(totalcreep-totalneutral))/totaldeaths;	
	};
	var gamescore = ((totalkills*10)+(totalassists*5)+(totalcreep-totalneutral)-(totaldeaths*10))/totalgames;
	const result = await client.query('UPDATE dota_stats SET games = ' + totalgames + ', kills = ' + totalkills + ', deaths = ' + totaldeaths + ', assists = ' + totalassists + ', creep = ' + totalcreep + ', neutral = ' + totalneutral + ', kdratio = ' + kdratio + ', pvprating = ' + pvprating + ', gamescore = ' + gamescore + ', efficiency = ' + efficiency + ', killspergame = ' + killspergame + ', deathspergame = ' + deathspergame + ', assistspergame = ' + assistspergame + ', creeppergame = ' + creeppergame + ', neutralpergame = ' + neutralpergame + ' WHERE id = ' + req.body.id);

	const results = { 'results': (result) ? result.rows : null};
	res.redirect('/scourge');
	client.release();
});



app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
