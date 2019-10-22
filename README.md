# dota-1
This app is cloned from my Heroku app at https://dota-1.herokuapp.com/sentinel

This is an entirely browser based program that I use to track my matches in the game called Dota.
It uses Heroku to host the program itself as well as a PostreSQL database to hold the SQL data.
The program works through HTTP POST requests to send data to the database with Node.js.
The /pages directory containts all of the ejs files which function as html pages.

The heart of the program is the index.js file, which connects the ejs code with the SQL database.
For a better explanation of how everything works together, see the comments in that file.
