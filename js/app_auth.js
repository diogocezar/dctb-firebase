Oracle = {
	db : null,
	auth : null,
	json : null,
	user : {
		'email'    : '',
		'password' : ''
	},
	config : {
		apiKey            : "",
		authDomain        : "",
		databaseURL       : "",
		storageBucket     : "",
		messagingSenderId : ""
	},
	init: function(){
		firebase.initializeApp(Oracle.config);
		Oracle.db = firebase.database();
		Oracle.auth = firebase.auth();
		Oracle.setButtons();
		Oracle.load();
		Oracle.goAuth(Oracle.user.email, Oracle.user.password);
	},
	setButtons: function(){
		$("#save").on('click', function(e){
			e.preventDefault();
			Oracle.save();
		});
	},
	createUser: function(){
		var email    = "diogo@diogocezar.com";
		var password = "123456";
		Oracle.auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
			Oracle.consoleError([error.code, error.message]);
		});
	},
	goAuth: function(email, password){
		Oracle.auth.signInWithEmailAndPassword(email, password).catch(function(error) {
			Oracle.consoleError([error.code, error.message]);
		});
	},
	consoleError: function(errors){
		console.error(errors);
	},
	load: function(){
		$("#results").empty().append("Carregando...");
		Oracle.db.ref('mural').once('value').then(function(snapshot){
			Oracle.json = snapshot.val();
			Oracle.plot(Oracle.json);
		}).catch(function(error){
			Oracle.consoleError([error.code, error.message]);
		});
	},
	plot: function(json){
		var str = [];
		for(var i=0; i<json.length; i++){
			str.push("<p> Nome: " + json[i].nome + "</p>");
			str.push("<p> Mensagem: " + json[i].msg + "</p>");
			str.push("<hr/>");
		}
		$("#results").empty().append(str.join(''));
	},
	resetForm: function(id){
		$('#' + id).each(function(){ this.reset(); });
		$("#name").focus();
	},
	save: function(){
		data = {
			'nome' : $("#name").val(),
			'msg'  : $("#msg").val()
		};
		Oracle.db.ref('mural').once('value').then(function(snapshot){
			var max = parseInt(snapshot.numChildren());
			Oracle.db.ref('mural/' + (max++)).set(data);
			Oracle.load();
			Oracle.resetForm('form');
		}).catch(function(error){
			Oracle.consoleError([error.code, error.message]);
		});
	}
}

$(document).ready(function() {
	Oracle.init();
});