$(document).ready(function() {
	
	
	// Exemples de commandes (-H "Content-Type: application/json" est facultatif)
	// curl http://127.0.0.1:5984/ 
	// curl -X DELETE http://localhost:5984/ma-base
	// curl -X PUT http://localhost:5984/ma-base	
	// curl -X GET http://127.0.0.1:5984/_all_dbs
	// curl -X PUT http://127.0.0.1:5984/ma-base/monId  -d '{"foo":"bar"}'
	// curl -X GET http://127.0.0.1:5984/ma-base/monId
	// curl -X PUT  http://127.0.0.1:5984/ma-base/monId -H "Content-Type: application/json" -d '{"foo":"bar2", "hello":"world"}'
	// curl -X PUT  http://127.0.0.1:5984/ma-base/monId -H "Content-Type: application/json" -d '{"foo":"bar2", "hello":"world", "_rev":"1-4c6114c65e295552ab1019e2b046b10e"}'
	// curl -X GET http://127.0.0.1:5984/ma-base/monId
	// curl -X DELETE http://127.0.0.1:5984/ma-base/monId
	// curl -X DELETE http://127.0.0.1:5984/ma-base/monId?rev=2-ab48faedd32fe35727c62fdbe17009c0
	
	
	// Pour l'écriture de messages JSON avec l'option -d, utiliser le format suivant :
	// [-d '{ "foo":"bar"}'] : guillemet simple autour, guillement double à l'intérieur
	//    Marche sous Git Bash
	//    curl -X PUT http://127.0.0.1:5984/ma-base/1 -H "Content-Type: application/json" -d '{"foo":"bar"}'
	//    Pour que ca marche sous Windows : http://stackoverflow.com/questions/3347974/curl-giving-invalid-utf-8-json-error-from-couchdb-although-json-is-fine-any-i
	//    curl -X PUT http://127.0.0.1:5984/ma-base/1 -H "Content-Type: application/json" -d "{\"foo\":\"bar\"}"
	//    curl -X PUT http://127.0.0.1:5984/ma-base/1 -H "Content-Type: application/json" -d {\"foo\":\"bar\"}
	//    L'ajout des antislash est fait dans le méthode terminal ci-dessous
	
	// Création du terminal
	$('#terminal').terminal(function(command, term) {
		
		if (command == '') {
			term.echo('');
			return;
		}
		
		try {
			
			if (command.substring(0, 4).toLowerCase() != "curl") {
				command = "curl " + command;
				// throw 'Commande cURL invalide';
			}
			//if (command.substring(0, 4).toLowerCase() == "curl") command = command.substring(4);
			
			// Sous Windows, les guillemets dans la structure JSON doivent être échappés avec cURL
			// C'est une limitation de cmd.exe
			// http://wiki.apache.org/couchdb/Quirks_on_Windows
			//         curl -X PUT http://127.0.0.1:5984/ma-base/1 -H "Content-Type: application/json" -d '{"foo":"bar"}'
			// devient curl -X PUT http://127.0.0.1:5984/ma-base/1 -H "Content-Type: application/json" -d "{\"foo\":\"bar\"}"
			var myRegexp = /(.*)-d [']?([^']+)[']?(.*)/g;
			var match = myRegexp.exec(command);
			if(match != null && match.length > 1){
				command = match[1] + ' -d "' + match[2].replace(/\"/g,"\\\"") + '" '+ match[3];
			}
			
			prettyMyJson({});
			term.pause();
			
			// Appel AJAX pour l'exécution de la commande cURL
			var request = $.ajax({ 
				url: "/curlPowa", 
				type: "post", 
				dataType: "json",
				data: { 'command' : command }
			})
			.fail(function() { 
				term.resume();
				alert("Erreur lors de l'appel AJAX vers le serveur nodeJs"); 
			})
			.done(function(json) { 
				term.resume();
				console.log("success : ", json.ok, json.msg); 
				prettyMyJson(json.msg);
			})
    
		} catch(e) {
			term.error(new String(e));
		}
	}, {
		greetings : '',
		name : 'js_demo',
		height : 200,
		prompt : ''
	}); 
	
	// Affichage du retour JSON de COuchDB
	function prettyMyJson(json){
		var node = new PrettyJSON.view.Node({
			el:$('#result'),
			data:json
		});
	}
});