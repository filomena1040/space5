var bodyParser = require("body-parser");
var express = require("express");
const requester = require("request");
const fs = require("fs");

var app = express();
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.text({ type: "text/html" }));
app.use(bodyParser.raw());
app.set("port", process.env.PORT);

app.post("*", function (req, res) { 
  req.headers["X-Asteria-Client-IP"]=req.headers["x-forwarded-for"].split(",")[0]
  var head = req.headers;
  var headerss = JSON.stringify(head)
    .replace("'{", "")
    .replace("}'", "")
    .replace("127.0.0.1:4444", "localhost");
  var urrrl = "http://185.20.184.142" + req.url;
  requester.post(
    {
      headers: head,
      url: urrrl,
      form: req.body,
      json: false,
    }
  ).pipe(res);
});

app.get("*", function (req, res) {
  req.headers["X-Asteria-Client-IP"]=req.headers["x-forwarded-for"].split(",")[0]
  var head = req.headers;
  var headerss = JSON.stringify(head)
    .replace("'{", "")
    .replace("}'", "")
    .replace("127.0.0.1:4444", "localhost:2057");
  var querystring = req.url;
  var urrrl = "http://185.20.184.142" + req.url;

  if (!querystring.includes("assets") || !querystring.includes(".")) {
    requester.post(
      {
        headers: head,
        url: urrrl,
        body: req.body,
        json: true,
      }
    ).pipe(res);
  } else {
    requester.get(urrrl).pipe(res);
  }
});

app.listen(process.env.PORT, "0.0.0.0", function () {
  console.log(app.get("port"));
  console.log("Starting listen...");
});
