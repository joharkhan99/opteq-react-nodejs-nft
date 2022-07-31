const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const firebase = require("firebase");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASURE_ID,
};
firebase.initializeApp(firebaseConfig);
let database = firebase.database();
var data;
database
  .ref("data")
  .once("value")
  .then(function (snapshot) {
    data = snapshot.val();
  });

// API ENDPOINTS

// - get data by wallet address
app.get("/get/walletaddress/:walletaddress", (req, res) => {
  var walletAddress = req.params.walletaddress;
  var output = [];

  Object.entries(data).forEach(([key, value]) => {
    value["description"] = value["description"].replace(/___.*___/, "");
    if (value.walletAddress == walletAddress) {
      output.push(value);
    }
  });
  res.send(output);
});

// - get data using a term/word
app.get("/search/term/:term", (req, res) => {
  var term = req.params.term;
  var output = [];

  Object.entries(data).forEach(([key, value]) => {
    value["description"] = value["description"].replace(/___.*___/, "");
    if (value.item.toLowerCase().includes(term.toLowerCase())) {
      output.push(value);
    }
  });
  res.send(output);
});

// - get data using description
app.get("/search/description/:description", (req, res) => {
  let words = req.params.description.split(" ");
  var output = [];

  Object.entries(data).forEach(([key, value]) => {
    value["description"] = value["description"].replace(/___.*___/, "");

    let foundDescp = words.every((item) =>
      value["description"].toLowerCase().includes(item.toLowerCase())
    );
    if (foundDescp) {
      output.push(value);
    }
  });
  res.send(output);
});

// - get data using nft hash
app.get("/search/nfthash/:nfthash", (req, res) => {
  var nfthash = req.params.nfthash;
  var output = [];

  Object.entries(data).forEach(([key, value]) => {
    value["description"] = value["description"].replace(/___.*___/, "");
    if (value.nft_hash == nfthash) {
      output.push(value);
    }
  });
  res.send(output);
});

// - get data using unique id
app.get("/search/uniqueid/:uniqueid", (req, res) => {
  var uniqueid = req.params.uniqueid;
  var output = [];

  Object.entries(data).forEach(([key, value]) => {
    value["description"] = value["description"].replace(/___.*___/, "");
    if (value.unique_id == uniqueid) {
      output.push(value);
    }
  });
  res.send(output);
});

//
app.post("/addrecord", (req, res) => {
  // console.log(req.body);
  var response = "";
  if (typeof req.body.description == "undefined") {
    response = "description missing";
  } else if (typeof req.body.image_url == "undefined") {
    response = "image_url missing";
  } else if (typeof req.body.item == "undefined") {
    response = "item missing";
  } else if (typeof req.body.nft_hash == "undefined") {
    response = "nft_hash missing";
  } else if (typeof req.body.url == "undefined") {
    response = "url missing";
  } else if (typeof req.body.walletAddress == "undefined") {
    response = "walletAddress missing";
  } else if (
    req.body.description.trim() == null ||
    req.body.description.trim() == ""
  ) {
    response = "description empty";
  } else if (
    req.body.image_url.trim() == null ||
    req.body.image_url.trim() == ""
  ) {
    response = "image_url empty";
  } else if (req.body.item.trim() == null || req.body.item.trim() == "") {
    response = "item/word/title empty";
  } else if (
    req.body.nft_hash.trim() == null ||
    req.body.nft_hash.trim() == ""
  ) {
    response = "nft_hash empty";
  } else if (req.body.url.trim() == null || req.body.url.trim() == "") {
    response = "url empty";
  } else if (
    req.body.walletAddress.trim() == null ||
    req.body.walletAddress.trim() == ""
  ) {
    response = "walletAddress empty";
  } else {
    let unique_id = uuidv4();
    // database.set(database.ref(database, `/data/${unique_id}`), {
    //   unique_id,
    //   item: req.body.item,
    //   description: "___" + req.body.item + "___" + req.body.description,
    //   walletAddress: req.body.walletAddress,
    //   date: new Date().toLocaleString(),
    //   nft_hash: req.body.nft_hash,
    //   url: req.body.url,
    //   image_url: req.body.image_url,
    // });

    database.ref(`/data/${unique_id}`).set(
      {
        unique_id,
        item: req.body.item,
        description: "___" + req.body.item + "___" + req.body.description,
        walletAddress: req.body.walletAddress,
        date: new Date().toLocaleString(),
        nft_hash: req.body.nft_hash,
        url: req.body.url,
        image_url: req.body.image_url,
      },
      function (error) {
        if (error) {
          response = "Failed with error: " + error;
        } else {
          response = "Added Successfully";
        }
      }
    );
    response = "Added Successfully";
  }

  res.send({ response });
});

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
