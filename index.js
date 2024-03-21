const bodyParser = require("body-parser");
const express = require("express");
const DB = require(__dirname + "/routes/db.js");
port = 3010;

app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("views"));

app.get('/',  function (req, res) {
    res.redirect("/login")
});

app.get('/login', function(req, res){
    res.render("login", {flag : 0})
});

app.post('/login', async function(req, res){
    const loginData= req.body;
    console.log(loginData);
    result=await DB.isLogin(loginData)
    if(result){
        res.redirect("/dashBoard")
    }
    else{
        res.render("login", {flag: 1})
    }
});

app.get("/dashBoard", (req, res) => {
    res.render('dashBoard');
})

app.get("/addExpense", (req, res) =>{ 
    res.render("homePage")
})

app.get('/register', function(req, res){
    res.render("register", {flag: 0});
});

app.get('/logout', function(req, res){
    res.redirect("/login");
});

app.post('/register', async function(req, res){
    const registerData = req.body;
    console.log(registerData)
    try{
        if(registerData.pass != registerData.confirm_pass){
            res.render("register", {flag: 2})
        }else{
            result = await DB.registerUser(registerData.email, registerData.pass);
            if(result){
                res.render("login", {flag: 2})
            }
            else{
                res.render("register", {flag: 1})
            }
        }
    }catch(err){
        res.render("register", {flag: 3})
        res.json("Internal server error");
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
});