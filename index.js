

var express = require('express');
var Request = require("request");
var pdfreader = require("pdfreader");
var app = express();

app.get('/', function(req, res){
//     Request.get("http://jsonplaceholder.typicode.com/posts", (error, response, body) => {
//     if(error) {
//         return console.dir(error);
//     }
//     console.dir(JSON.parse(body));
// });

var rows = {}; // indexed by y-position

 
function printRows() {
    var pdfToData=[];
     Object.keys(rows) // => array of y-positions (type: float)
    .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
    .forEach(y => {pdfToData.push((rows[y] || []).join(""));  console.log((rows[y] || []).join(""))});
    console.log('pdf read',pdfToData);
}

 
new pdfreader.PdfReader().parseFileItems("Firstone.pdf", function(
  err,
  item
) {
  if (!item || item.page) {
    // end of file, or page
    printRows();
    //console.log("PAGE:", item.page);
    rows = {}; // clear rows for next page
  } else if (item.text) {
    // accumulate text items into rows object, per line
    (rows[item.y] = rows[item.y] || []).push(item.text);
  }
});

var bodyData= {
    "name": "Blog Post",
    "fields": [
    {
    "id": "title",
    "name": "Title",
    "required": true,
    "localized": true,
    "type": "Text"
    },
    {
    "id": "body",
    "name": "Body",
    "required": true,
    "localized": true,
    "type": "Text"
    }
    ]
}

Request.post({
        "headers": {
            "Authorization": "Bearer CFPAT-TeZYzmlmwziA1uCgUlCYG9GL_BXgq6Zz66XnQRknguA",
            "Content-Type": "application/vnd.contentful.management.v1+json"
         },
    "url": "https://api.contentful.com/spaces/v0ygbun9dt33/environments/master/content_types",
    "body": JSON.stringify(bodyData)
}, (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    console.dir(JSON.parse(body));
});
   res.send("Hello world!");
});

app.listen(3000);