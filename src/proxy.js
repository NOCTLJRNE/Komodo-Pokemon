// import "dotenv/config";
import RpcClient from "../modules/bitcoindrpc.js";
import axios from "axios";
import pokemontxList from "../static/pokemontxList";
import rpcConfig from "../rpcConfig.js";
var express = require("express");
var cors = require("cors");
// const rpcHost = process.env.RPCHOST;
// const rpcPort = process.env.RPCPORT;
// const rpcUser = process.env.RPCUSER;
// const rpcPassword = process.env.RPCPASSWORD;
// const rpcPubkey = process.env.RPCPUBKEY;

const rpcHost = rpcConfig.rpcHost;
const rpcPort = rpcConfig.rpcPort;
const rpcUser = rpcConfig.rpcUser;
const rpcPassword = rpcConfig.rpcPassword;
const rpcPubkey = rpcConfig.rpcPubkey;

var app = express();
app.use(express.json()); //using this solve the empty body issue
app.use(express.urlencoded({ extended: false }));
app.use(cors());
var config = {
  protocol: "http",
  user: rpcUser,
  pass: rpcPassword,
  host: rpcHost,
  port: rpcPort
};
var rpc = new RpcClient(config);

var tokenList = [];

//rpc.tokenList(function(err, ret) {
//  if (err) {
//    console.error(err);
//  } else {
//    console.log(ret.result);
//    tokenList = [...ret.result];
//  }
//});

//pokemontxList.forEach(element => {
//  console.log(element);
//});

console.log(pokemontxList);

Object.keys(pokemontxList).forEach(tokentxid => {
  let pokemonName = pokemontxList[tokentxid];
  let pokemonUrl = `https://pokeapi.glitch.me/v1/pokemon/${pokemonName}`;
  axios
    .get(pokemonUrl)
    .then(response => {
      //      console.log(response.data);
    })
    .catch(error => console.error(error));
});

//app.get('/', function (req, res, next) {
// var test = [{key1: "value1.1", key2: "value1.2"}, {key1: "value2.1", key2: "value2.2"}]
//res.send(test)
// res.send(tokenList);

// res.json({msg: 'This is CORS-enabled for all origins!'})
//})

app.get("/pokemon/:name", function(req, res, next) {
  //  console.log("request pokemon name: ", req.params.name);
  //  res.send(req.params.name);
  let pokemonUrl = `https://pokeapi.glitch.me/v1/pokemon/${req.params.name}`;
  axios
    .get(pokemonUrl)
    .then(reponse => {
      res.send(reponse.data);
    })
    .catch(error => console.log(error));
});

app.post("/calls", function(req, res, next) {
  //var test = [{key1: "value1.1", key2: "value1.2"}, {key1: "value2.1", key2: "value2.2"}]
  //res.send(test)
  //console.log("params:",req.params)
  //console.log("query:",req.query)
  console.log("body:", req.body);
  var method = req.body.method;
  var params = [...req.body.params];
  var data = [];
  const url = "https://pokeapi.glitch.me/v1/pokemon/Treecko";
  // axios.get(url)
  // .then(response=>{
  // console.log(response.data)
  // data = [...response.data]
  // })
  // .catch(error=>console.error(error))
  rpc[method](...params, function(err, ret) {
    if (err) {
      console.log("ERROR!");
      console.error(err);
      //     res.send(err);
      res.status(400);
      res.send(err);
    } else {
      //      axios.get(url)
      //      .then(response=>{
      //      console.log(response.data)
      //      data = [...response.data]
      //     res.send({result: ret.result, data: data});
      //     })
      //     .catch(error=>console.error(error))
      // console.log("SUCCESS!");
      console.log(ret.result);
      if (isNaN(ret.result)) {
        res.send(ret.result);
      } else {
        res.send(`${ret.result}`);
      }

      //     res.send({result: ret.result, data: data});
      //     tokenList = [...ret.result];
    }
  });
});

app.listen(3001, function() {
  console.log("CORS-enabled web server listening on port 3001");
});
