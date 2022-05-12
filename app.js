var express = require('express');
var app = express();
const fs = require("fs");
const path = require("path");


app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// console.log("server listening");


// app.use('/assets', express.static(__dirname + '/public'));
// app.set('view engine', 'ejs')

// app.get('/', function(req, res){
//     res.render('index');
// })

// app.get('/person/:id', function(req, res){
//     res.render('person', {id: req.params.id, Qstr: req.query.limit})
// })

// app.get('/', function(req, res){
//     res.send(`
//     <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta http-equiv="X-UA-Compatible" content="IE=edge">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Document</title>
//     <link rel="stylesheet" href="assets/style.css">
// </head>
// <body>
//     <h1>Hello from GET</h1>
// </body>
// </html>`)
// })
app.post('/signup', function(req, res){
    let params = req.body;
    let isExists = false;
    let data = fs.readFileSync("./db.json", {
        encoding: "utf8",
        flag: "r",
      });
      let dbData = JSON.parse(data);
      for (let item of dbData) {
        if (item[params.email]) {
          isExists = true;
          break;
        }
      }
      if (isExists) {
        res.status(408).send({
            error: "Email already exists",
          })
      } else {
        dataToPush = {
          [params.email]: {
            password: params.password,
            username: params.username,
          },
        };
        try {
          dbData.push(dataToPush);
          fs.writeFileSync("./db.json", JSON.stringify(dbData));
        //   res.writeHead(200, {'Content-Type': 'application/json'});
          res.status(200).send({ message :'Signed up successfully!'});
          
        } catch (error) {
        //   res.writeHead(505, {'Content-Type': 'application/json'});
        res.status(500).send('Server Error')
        }
}
})

app.post('/login', function(req, res){
    let params = req.body;
    let data = fs.readFileSync("./db.json", {
        encoding: "utf8",
        flag: "r",
      });
    let dbData = JSON.parse(data);
    for (let item of dbData) {
        if (item[params.email]) {
    //   isExists = true;
            if(item[params.email].password === params.password){
            res.status(200).send('Logged in successfully!');
            } else {
            res.status(403).send("Wrong Password!")
            }
         return;
        }
    }
    res.status(404).send("User not found!")
})



app.listen(3000);