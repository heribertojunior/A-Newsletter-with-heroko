const express = require("express");
const bodyParser = require("body-parser");
const  request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.listen(process.env.PORT || 3000,function(){
  console.log("Servidor iniciado ");
});

app.get("/",function(req, res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const apiKey = "13df9b397a66e50c58fbba9f3820dd7d-us2";
  const listId = "2c8d2e7f0a";

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME:fname,
          LNAME:lname
        }

      }
    ]
  };

  var jsomData = JSON.stringify(data);

  const url = "https://us2.api.mailchimp.com/3.0/lists/"+listId;

  const options = {
    method: "POST",
    auth:"heriberto:"+apiKey
  };
  const request = https.request(url,options,function(resp){
    if(resp.statusCode===200){
      res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html")
    }
    resp.on("data",function(data){
      console.log(JSON.parse(data));
    });

  });
  request.write(jsomData);
  request.end();
});
