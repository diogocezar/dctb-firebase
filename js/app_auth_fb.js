Oracle = {
	db : null,
	auth : null,
	json : null,
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
		Oracle.goAuth();
	},
	setButtons: function(){
		$("#save").on('click', function(e){
			e.preventDefault();
			Oracle.save();
		});
	},
	goAuth: function(){
		firebase.auth().onAuthStateChanged(function(user){
		  if (!user){
			var provider = new firebase.auth.FacebookAuthProvider();
			provider.addScope('email');
			provider.addScope('user_about_me');
			firebase.auth().signInWithPopup(provider).then(function(result) {
				var token = result.credential.accessToken;
				var user = result.user;
				console.log(token);
				console.log(user);
			}).catch(function(error) {
				Oracle.consoleError([error.code, error.message]);
				Oracle.consoleError([error.email, error.credential]);
			});
		  }
		});
	},
	consoleError: function(errors){
		console.error(errors);
	},
	load: function(){
		$("#results").empty().append("Carregando...");
		var ref = Oracle.db.ref('mural');
		ref.on('value', function(snapshot){
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
	checkUser: function(callBack){
		firebase.auth().onAuthStateChanged(function(user) {
		  if (user){
		  	callBack();
		  }
		 else
		    alert('Você não está logado.');
		});
	},
	checkCurrentUser: function(){
		var user = firebase.auth().currentUser;
		if (user) {
			console.log(user);
		} else {
			console.log('not connected');
		}
	},
	save: function(){
		Oracle.checkUser(function(){
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
		});
	}
}

$(document).ready(function() {
	Oracle.init();
});