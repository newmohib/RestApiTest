

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
var pdfToData=[];
var postBodyFields=[];
var bodyData= {};

 
function printRows() {
    var pdfText='';
    // var fixedContent={
    //     "id": "title",
    //     "name": "Title",
    //     "required": true,
    //     "localized": true,
    //     "type": "Text"
    //     }

     Object.keys(rows) // => array of y-positions (type: float)
    .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
    .forEach(y =>
         { pdfToData.push((rows[y] || []).join("") )
         pdfText=(rows[y] || []).join("");

         var fixedContent={};

         fixedContent.id=pdfText.toLowerCase();
         fixedContent.name=pdfText;
         fixedContent.required=true;
         fixedContent.localized=true;
         fixedContent.type="Text";
         postBodyFields.push(fixedContent);
         
         });

         bodyData= {
            "name": "Blog Post",
            "fields": postBodyFields
        }
       // console.log(bodyData);

        if (postBodyFields.length !==0) {
        console.log('condition');
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
        }
    
}
 
new pdfreader.PdfReader().parseFileItems("Firstone.pdf", function(err,item)
 {
  if (!item || item.page) {
    
    printRows();
   // postToContentful()


    rows = {}; // clear rows for next page
  } else if (item.text) {
   
    (rows[item.y] = rows[item.y] || []).push(item.text);

  }
});


   res.send("Hello world!");
});

app.listen(3000);