// require csvjson module
var express = require('express');
var app = express();
var fs = require('fs');
var csvjson = require('csvjson');
const path= require('path');
const port = 8080;



// converto il CSV al JSON
const data = fs.readFileSync(path.join(__dirname, 'flyers_data.csv'), { encoding : 'utf8'});



const flyersData = csvjson.toObject(data)



//handle inc. request

app.get('/api', paginateRes(flyersData), (req, res) => {
      res.status(200).json(res.paginateRes)
});

//Setto i files statici tramite la cartella public
app.use(express.static(path.join(__dirname, 'public')));
 




// function for pagination 

function paginateRes(model) {
  return (req, res, next) => {


const page = req.query.page
const limit = req.query.limit

const startIndex = (page - 1) * limit
const endIndex =  page * limit

const results = {}
/*
if(endIndex <  model.length) {
results.next = {

  page: page + 1,
  limit: limit
 }
}

if(startIndex > 0) { 
results.previous = {

  page: page - 1,
  limit: limit
 }
}
*/
// lho copiato dal mio codice..divide il numero di flyers diviso il limite di pagine e da un numero con la virgola. ho capichteo varrotondato
results.pages = Math.ceil(model.length / limit)
results.results =  model.slice(startIndex, endIndex)
res.paginateRes = results
next()
  }
}

//listening
app.listen(port, () => {
  console.log(`FullStack Ex app listening on port ${port}!`)
});