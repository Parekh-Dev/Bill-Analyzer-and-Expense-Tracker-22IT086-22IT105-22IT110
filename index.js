const bodyParser = require("body-parser");
const express = require("express");
const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
const DB = require(__dirname + "/routes/db.js");
const { exec } = require('child_process');
const multer = require("multer");
const fs = require("fs");
const PDFDocument = require('pdfkit');
 
// Create a document
const doc = new PDFDocument();

port = 3010;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("views"));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/bills");
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname}`);
    },
});
const upload = multer({ storage: storage });

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

app.get('/dashboard', async function(req, res){
    const expenses = await DB.getExpenses();
    res.render("dashboard", {expenses: expenses})
});

function runPythonScript(scriptPath, imgPath) {
    return new Promise((resolve, reject) => {
        // Command to run the Python script
        const pythonScript = `python ${scriptPath} ${imgPath}`;

        // Execute the Python script
        const pythonProcess = exec(pythonScript);

        let output = '';

        // Capture stdout from the Python script
        pythonProcess.stdout.on('data', (data) => {
            output += data;
        });

        // Capture stderr from the Python script
        pythonProcess.stderr.on('data', (data) => {
            reject(`Error executing Python script: ${data}`);
        });

        // Handle completion of the Python script
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve(output.trim());
            } else {
                reject(`Python script exited with non-zero exit code: ${code}`);
            }
        });
    });
}

app.get("/addExpense", (req, res) =>{ 
    res.render("homePage")
})
app.get('/register', function(req, res){
    res.render("register", {flag: 0});
});

app.get('/logout', function(req, res){
    res.redirect("/login");
});


app.get('/download', async function(req, res) {
    const expenses = await DB.getExpenses(); // Fetch your expenses data here
    const doc = new PDFDocument;

    const stream = doc.pipe(fs.createWriteStream('example.pdf'));

    expenses.forEach((expense, index) => {
        doc
            .fontSize(27)
            .text(`Name: ${expense.name}, Total: ${expense.total}, Date: ${new Date(expense.date).toLocaleDateString()}`, 100, 100 + index * 50);
    });

    doc.end();

    stream.on('finish', function() {
        res.redirect('/dashboard');
    });
});

app.post("/extractAmount", upload.single("image"), async function (req, res) {
    const userData = req.body; //student_id, firstname, lastname, phone_no, department, github, linkedin, resume
    // Write a code which changes the name of the file uploaded by the user to his/her studentID using fs
    const pythonScriptPath = './testing.py'; // Change this to the path of your Python script
    const imgPath = "D:\\Bill-Analyzer-and-Expense-Tracker-22IT086-22IT105-22IT110\\" +req.file.path;
    // console.log(imgPath)
    runPythonScript(pythonScriptPath, imgPath)
        .then((output) => {
            console.log(output.split(":"));
            const total = output.split(":")[0].trim();
            const date = output.split(":")[2].trim();
            const name = output.split(":")[1].trim();
            DB.addExpense(name,total, date)
                .then((result) => {
                    if(result){
                        res.redirect("/dashBoard");
                    }
                    else{
                        res.render("homePage", {flag: 2});
                    }
                })
        })
        .catch((error) => {
            console.error('Error:', error);
        });
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