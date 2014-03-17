// ========================================================================== \\
// |                                Prez NoSQL                              | \\
// -------------------------------------------------------------------------- \\
// |                                                             2013-03-14 | \\
// | Executions de commandes curl                                         ♥ | \\
// +========================================================================+ \\

var util    = require('util');
var exec    = require('child_process').exec;
var express = require('express');
var http = require('http');
var port = 1214;

// --------------------------------------------------------------------------
// Configuration des middlewares d'Express

const app = express();
// On définie les middlewares qui seront en charge de traiter toutes les requêtes
// L'ordre de définition des middlewares est important (middleware appelés les uns après les autres)
app.configure(function() {
	app.use(express.logger('dev'));						// Affichage des requêtes sur la console ('default', 'short', 'tiny', 'dev')
	app.use(express.bodyParser());      				// Recupération des messages envoyés par le client (req.body)
	app.use(app.router);                            	// Router (requetes app.VERB, VERB = GET, POST ...)
	app.use(express.static(__dirname)); 	// Répertoire des fichiers statiques (page HTML, CSS, etc)
	app.use(express.errorHandler({dumpExceptions: true, showStack: true})); // Si une erreur 500 intervient, Express retourne un rapport au format HTML
});


app.listen(port, '0.0.0.0', 511, function() {
  // Once the server is listening we automatically open up a browser
  console.log('+---------------------------------------------------+');
console.log('|                      Présentation No SQL          |');
console.log('+---------------------------------------------------+');
console.log('');
console.log('Serveur HTTP  : http://localhost:' + port + '/');
console.log('');
  
  // var open = require('open');
  // open('http://localhost:' + port + '/');
});

