Oracle = {
	db : null,
	json : null,
	config : {
		apiKey: "",
		authDomain: "",
		databaseURL: "",
		storageBucket: "",
		messagingSenderId: ""
	},
	init: function(){
		firebase.initializeApp(Oracle.config);
		Oracle.db = firebase.database();
		Oracle.setButtons();
		Oracle.load();
	},
	setButtons: function(){
		$("#save").on('click', function(e){
			e.preventDefault();
			Oracle.save();
		});
	},
	load: function(){
		$("#results").empty().append("Carregando...");
		Oracle.db.ref('mural').once('value').then(function(snapshot){
			Oracle.json = snapshot.val();
			Oracle.plot(Oracle.json);
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
		});
	}
}

$(document).ready(function() {
	Oracle.init();
});