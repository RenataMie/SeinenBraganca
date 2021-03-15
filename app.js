require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const Swal = require("sweetalert2");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
	secret: "Our little secret.",
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/seinenDB", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
mongoose.set("useCreateIndex", true);

const User = new mongoose.Schema ({
	username : String,
	password : String,
	nome: String,
	apel : String,
	nasc : String,
	tel1 : String,
	email : String,
	end : String,
	comp : String,
	cep : String,
	nomecont : String,
	tel2 : String
});

User.plugin(passportLocalMongoose);



const Users = new mongoose.model("Seinen", User);



passport.use(Users.createStrategy());


passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());



app.get("/", function(req, res){
	res.render("home");
});

app.get("/sobre", function(req, res){
	res.render("sobre");
});

app.get("/login", function(req, res){
	res.render("login");
});

app.get("/form", function(req, res){
	res.render("form");
});

app.get("/userpage", function(req, res){
	if (req.isAuthenticated()){
		res.render("userpage");
	} else {
		res.redirect("/login");
	}
});

app.post("/form", function(req, res){

	Users.register(new Users({username: req.body.username, 
	nome: req.body.Nomeform,
	apel: req.body.Apelidoform,
	nasc: req.body.Nascform,
	tel1: req.body.Tel1form,
	email: req.body.Emailform,
	end: req.body.Endform,
	comp: req.body.Compleform,
	cep: req.body.Cepform,
	nomecont: req.body.Nomecontform,
	tel2: req.body.Tel2form}), req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			res.redirect("/form");
		} else {
			
				passport.authenticate("local")(req, res, function() {
					console.log("user authenticated");
					
				});
			
		}		
				
	});
});
		

app.post("/login", function(req, res){

	const user = new Users({
		username: req.body.username,
		password: req.body.password
	});

	req.login(user, function(err){
		if(err) {
			console.log(err);
		} else {
			passport.authenticate("local")(req, res, function(){
				res.redirect("/userpage");
			});
		}
	});

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});