
<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-model="configData.rpcHost"
            label="RPChost"
            placeholder="127.0.0.1 (localhost)"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-text-field v-model="configData.rpcPort" label="RPCport" placeholder="16348 (MORTY)"></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-model="configData.rpcUser"
            label="RPCuser"
            placeholder="your_RPC_username"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-model="configData.rpcPassword"
            label="RPCpassword"
            placeholder="your_super_secret_RPC_password"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field v-model="pubkeyData" label="Public Key" placeholder></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            readonly
            v-model="RaddressComputed"
            label="R-Address"
            placeholder="Your_R_address"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-btn color="primary" v-on:click="submitHandler">Submit</v-btn>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-btn color="success" v-on:click="verifySignature" :disabled="isMine">Verify</v-btn>
        </v-col>
        <!-- <v-col cols="12" sm="6" md="3">
          <v-btn color="warning" v-on:click="testHandler">Test</v-btn>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-btn color="warning" v-on:click="posttHandler">Post</v-btn>
        </v-col> -->
        <!-- <v-col cols="12" sm="6" md="6">
          <v-alert
            dense
            border="left"
            type="warning"
            v-show="!pubkeyRaddressMatched"
          >Your pubkey doesn't match with your R-address</v-alert>
        </v-col>-->
      </v-row>
      <!-- <li>
        <ul v-for="element in tokenInfoDataComp">{{element}}</ul>
      </li>
      <li>
        <ul v-for="element in balanceListDataComp">{{element}}</ul>
      </li>-->
      <!-- <li>
        <ul v-for="element in myPokemonAPIDataRaw">{{element}}</ul>
      </li>-->
      <h3 v-if="pokemonAPIDataLoaded && !totalBalanceComputed">
        You don't have any Pokémon yet, please catch some !
        <v-icon>mdi-emoticon-sad</v-icon>
      </h3>
      <!-- <PokemonCard
        v-if="pokemonAPIDataLoaded && totalBalance"
        v-for="element in myPokemonAPIDataRaw"
        v-bind:myPokemonInfo="element"
        v-bind:isMine="isMine"
        v-bind:signed="signed"
        v-bind:key="element.pokemonTokenData[0].number"
      ></PokemonCard>-->
      <!-- <PokemonCard
        v-if="balanceMapping[name]"
        v-for="(value, name) of myPokemonAPIDataRaw"
        v-bind:tokenID="name"
        v-bind:myPokemonInfo="value"
        v-bind:balance="balanceMapping[name]"
        v-bind:isMine="isMine"
        v-bind:signed="signed"
      ></PokemonCard>-->
      <v-alert
        dense
        border="left"
        type="warning"
        v-show="showWarning"
      >Please sign & verify with correct private/public keys pair</v-alert>
      <PokemonCard
        v-if="pokemonAPIDataLoaded && balanceMapping[name]"
        v-for="(value, name) of myPokemonAPIDataRaw"
        v-bind:tokenID="name"
        v-bind:myPokemonInfo="value"
        v-bind:balance="balanceMapping[name]"
        v-bind:isMine="isMine"
        v-bind:signed="signed"
        v-bind:key="name"
      ></PokemonCard>
    </v-container>
  </v-form>
</template>

<script>
import RpcClient from "~/modules/bitcoindrpc";
import pokemontxlist from "~/static/pokemontxList.js";
import axios from "axios";
import PokemonCard from "~/components/PokemonCard";
import rpcConfig from "~/rpcConfig";
import proxyConfig from "~/proxyConfig";
import SHA256 from "crypto-js/sha256";
import RIPEMD160 from "crypto-js/ripemd160";
import encHEX from "crypto-js/enc-hex";
import bs58 from "bs58";
// import dotenv from "dotenv";
//import RpcClient from "node-komodo-rpc";
//import simple from "~/modules/simple";
// import testfunction from "~/src/test";
// import coreApi from "~/src/api/coreApi";
export default {
  components: {
    PokemonCard
  },
  data: () => ({
    configData: {
      rpcHost: "",
      rpcPort: "",
      rpcUser: "",
      rpcPassword: ""
    },
    //     configData: {
    // ...rpcconfig
    //     },
    rpc: null,
    pubkeyData: "",
    RaddressData: "",
    tokenListDataRaw: [],
    tokenInfoDataRaw: [],
    // balanceListDataRaw: [],
    balanceMapping: {},
    totalBalance: 0,
    pokemonAPIDataLoaded: false,
    // myPokemonAPIDataRaw: [],
    myPokemonAPIDataRaw: {},
    isMine: false,
    signed: false,
    showWarning: false
  }),
  mounted() {
    // const testfunction = require("~/src/test");
    // testfunction.hello();
    // testfunction.goodbye();
    // console.log(pokemontxlist);
    // var text = '{"name":"John", "age":30, "city":"New York"}';
    // console.log("this is a text", text);
    // text = text.replace(/\\/g, "");
    // var obj = JSON.parse(text);
    // console.log("this is an object", obj);
    // dotenv.config();
    this.configData = { ...rpcConfig };
    this.pubkeyData = rpcConfig.rpcPubkey;
    this.RaddressData = rpcConfig.rpcRaddress;
  },
  destroyed() {
    clearInterval(this.interval);
  },
  watch: {
    pubkeyData: function(val) {
      this.isMine = false;
    }
  },
  methods: {
    submitHandler() {
      //   console.log(`host:${this.configdata.rpchost}, port:${this.configdata.rpcport}, user:${this.configdata.rpcuser}, password:${this.configdata.rpcpassword}`);
      //var RpcClient = require("bitcoind-rpc");
      //const RpcClient = require("node-komodo-rpc");
      const localHost = `http://${proxyConfig.proxyHost}:${proxyConfig.proxyPort}/calls`;
      var config = {
        protocol: "http",
        user: this.configData.rpcUser
          ? this.configData.rpcUser
          : rpcConfig.rpcUser,
        pass: this.configData.rpcPassword
          ? this.configData.rpcPassword
          : rpcConfig.rpcPassword,
        host: this.configData.rpcHost
          ? this.configData.rpcHost
          : rpcConfig.rpcHost,
        port: this.configData.rpcPort
          ? this.configData.rpcPort
          : rpcConfig.rpcPort
      };

      this.rpc = new RpcClient(config);

      //   this.rpc.getInfo(function(err, ret) {
      //     if (err) {
      //       console.error(err);
      //     } else {
      //       console.log(ret);
      //     }
      //   });
      var temp = [];
      let vm = this;
      // Get tokens List
      //   this.rpc.tokenList(function(err, ret) {
      //     if (err) {
      //       console.error(err);
      //     } else {
      //       //   console.log(ret.result);
      //       vm.tokenListDataRaw = [...ret.result];
      //       //   console.log("ret result", vm.tokenListDataRaw);
      //     }
      //   });

      //   axios
      //     .post(
      //       localHost,
      //       {
      //         method: "tokenList",
      //         params: []
      //       },
      //       {
      //         params: "searchTerm"
      //       }
      //     )
      //     .then(response => (vm.tokenListDataRaw = [...response.data]))
      //     .catch(error => console.error(error));

      //   Object.keys(pokemontxlist).forEach(tokenid => {
      //     vm.rpc.tokenInfo(tokenid, function(err, ret) {
      //       if (err) {
      //         console.error(err);
      //       } else {
      //         // vm.tokenInfoDataRaw.push(ret.result);
      //       }
      //     });
      //   });

      this.balanceChecking();
      if (!this.interval) {
        this.interval = setInterval(this.balanceChecking, 10000);
      }
      //   this.rpc.tokenBalance(pokemontxlist[0], testpubkey[1], function(err, ret) {
      //     if (err) {
      //       console.error(err);
      //     } else {
      //       console.log(ret.result);
      //     }
      //   });

      //   this.rpc.tokenInfo(pokemontxlist[0], function(err, ret) {
      //     if (err) {
      //       console.error(err);
      //     } else {
      //       console.log(ret.result);
      //     }
      //   });
    },
    balanceChecking() {
      console.log("checking balance");
      let vm = this;
      Object.keys(pokemontxlist).forEach(tokenid => {
        var arg = vm.pubkeyData ? [tokenid, vm.pubkeyData] : [tokenid];

        const localHost = `http://${proxyConfig.proxyHost}:${proxyConfig.proxyPort}/calls`;

        axios
          .post(
            localHost,
            {
              method: "tokenBalance",
              params: [...arg]
            },
            {
              params: "searchTerm"
            }
          )
          .then(function(response) {
            // console.log(response.data);
            let balance = response.data.balance;
            vm.totalBalance += balance;
            // vm.balanceListDataRaw.push(ret.result);
            // vm.balanceMapping[ret.result.tokenid] = ret.result.balance;
            vm.$set(vm.balanceMapping, response.data.tokenid, balance);
            if (!vm.pokemonAPIDataLoaded) {
              let pokemonName = pokemontxlist[tokenid];
              let pokemonUrl = `https://pokeapi.glitch.me/v1/pokemon/${pokemonName}`;
              let proxyAPI = `http://${proxyConfig.proxyHost}:${proxyConfig.proxyPort}/pokemon/${pokemonName}`;
              axios
                .get(proxyAPI)
                .then(reponse => {
                  console.log("axios called!");
                  vm.$set(vm.myPokemonAPIDataRaw, tokenid, reponse.data);
                })
                .catch(error => console.log(error))
                .finally(() => (vm.pokemonAPIDataLoaded = true));
            }
          })
          .catch(error => console.error(error));

        // vm.rpc.tokenBalance(...arg, function(err, ret) {
        //   if (err) {
        //     console.error(err);
        //   } else {
        //     let balance = ret.result.balance;
        //     vm.totalBalance += balance;
        //     // vm.balanceListDataRaw.push(ret.result);
        //     // vm.balanceMapping[ret.result.tokenid] = ret.result.balance;
        //     vm.$set(vm.balanceMapping, ret.result.tokenid, balance);
        //     if (!vm.pokemonAPIDataLoaded) {
        //       let pokemonName = pokemontxlist[tokenid];
        //       let pokemonUrl = `https://pokeapi.glitch.me/v1/pokemon/${pokemonName}`;
        //       axios
        //         .get(pokemonUrl)
        //         .then(reponse => {
        //           console.log("axios called!");
        //           vm.$set(vm.myPokemonAPIDataRaw, tokenid, reponse.data);
        //         })
        //         .catch(error => console.log(error))
        //         .finally(() => (vm.pokemonAPIDataLoaded = true));
        //     }
        //   }
        // });
      });
    },
    verifySignature() {
      console.log(rpcConfig.rpcRaddress);
      const localHost = `http://${proxyConfig.proxyHost}:${proxyConfig.proxyPort}/calls`;
      let vm = this;
      let address = this.RaddressComputed
        ? this.RaddressComputed
        : rpcConfig.rpcRaddress;
      axios
        .post(
          localHost,
          {
            method: "signMessage",
            params: [address, "Pokemon"]
          },
          {
            params: "searchTerm"
          }
        )
        .then(function(response) {
          console.log(response.data);
          let signature = response.data;
          axios
            .post(
              localHost,
              {
                method: "verifyMessage",
                params: [address, signature, "Pokemon"]
              },
              {
                params: "searchTerm"
              }
            )
            .then(function(response) {
              vm.isMine = response.data;
              console.log(response.data);
            })
            .catch(error => {
              console.error(error);
              vm.isMine = false;
              alert(
                "Please sign & verify with correct private/public keys pair !"
              );
            });
        })
        .catch(error => {
          console.error(error);
          vm.isMine = false;
          alert("Please sign & verify with correct private/public keys pair !");
        });

      //   this.rpc.signMessage(address, "Pokemon", function(err, ret) {
      //     if (err) {
      //       console.error(err);
      //       console.log("error is:", err.message);
      //       vm.isMine = false;
      //       alert("Please sign & verify with correct private/public keys pair !");
      //       //   vm.showWarning = true;
      //       //   setTimeout(() => (vm.showWarning = false), 4000);
      //     } else {
      //       //   console.log(ret.result);
      //       let signature = ret.result;
      //       vm.rpc.verifyMessage(address, signature, "Pokemon", function(
      //         err,
      //         ret
      //       ) {
      //         if (err) {
      //           console.error(err);
      //           vm.isMine = false;
      //         } else {
      //           console.log(ret.result);
      //           vm.isMine = ret.result;
      //         }
      //       });
      //     }
      //   });
    },
    // testHandler() {
    //   const localHost = `http://${proxyConfig.proxyHost}:${proxyConfig.proxyPort}`;
    //   console.log("testHandler called 2");
    //   axios
    //     .get(`${localHost}/pokemon/Mudkip`)
    //     .then(response => console.log(response.data))
    //     .catch(error => console.error(error));
    //   //   axios
    //   //     .get("https://pokeapi.glitch.me/v1/pokemon/Treecko")
    //   //     .then(response => console.log(response.data[0].species))
    //   //     .catch(error => console.error(error));
    // },
    // posttHandler() {
    //   const localHost = `http://${proxyConfig.proxyHost}:${proxyConfig.proxyPort}/calls`;
    //   console.log("postHandler called 2");
    //   axios
    //     .post(
    //       localHost,
    //       {
    //         method: "tokenBalance",
    //         params: [
    //           "4cef23ac268b6193f18d4f5fa6c610e2ae80b37162675feae07fdffdbbe4cfdc",
    //           "02dc98f064e3bf26a251a269893b280323c83f1a4d4e6ccd5e84986cc3244cb7c9"
    //         ]
    //       },
    //       {
    //         //work without headers settings
    //         // headers: {
    //         //   "Content-Type": "application/json",
    //         //   "Access-Control-Allow-Origin": "*"
    //         // },
    //         params: "searchTerm"
    //       }
    //     )
    //     .then(response => console.log(response.data))
    //     .catch(error => console.error(error));
    // }
  },
  computed: {
    // balanceListDataComp() {
    //   return this.balanceListDataRaw.map(element => {
    //     return { tokenid: element.tokenid, balance: element.balance };
    //   });
    // },

    // tokenInfoDataComp() {
    //   return this.tokenInfoDataRaw.map(element => {
    //     // console.log("text:", element.description);
    //     // var obj = JSON.parse(element.description);
    //     // console.log("object:", obj);
    //     return {
    //       tokenid: element.tokenid,
    //       creator: element.owner,
    //       name: element.name,
    //       supply: element.supply,
    //       description: JSON.parse(element.description)
    //     };
    //   });
    // },
    totalBalanceComputed() {
      return Object.values(this.balanceMapping).reduce(
        (accumulator, currentValue) => accumulator + currentValue
      );
    },
    RaddressComputed() {
      let sha256Hash = SHA256(encHEX.parse(this.pubkeyData));
      let ripemd160Hash = RIPEMD160(sha256Hash);
      let prefix = `3C${ripemd160Hash.toString()}`;
      let prefixHex = encHEX.parse(prefix);
      let checksum = SHA256(SHA256(prefixHex))
        .toString()
        .slice(0, 8);
      let decodedAddress = `${prefix}${checksum}`;
      let bytesAddress = Buffer.from(decodedAddress, "hex");
      let encodedAddress = bs58.encode(bytesAddress);
      return encodedAddress;
    },
    pubkeyRaddressMatched() {
      let sha256Hash = SHA256(encHEX.parse(this.pubkeyData));
      let ripemd160Hash = RIPEMD160(sha256Hash);
      let prefix = `3C${ripemd160Hash.toString()}`;
      let prefixHex = encHEX.parse(prefix);
      let checksum = SHA256(SHA256(prefixHex))
        .toString()
        .slice(0, 8);
      let decodedAddress = `${prefix}${checksum}`;
      let bytesAddress = Buffer.from(decodedAddress, "hex");
      let encodedAddress = bs58.encode(bytesAddress);
      // console.log("ripemd160Hash=", ripemd160Hash.toString());
      // console.log("ripemd160Hash=", ripemd160Hash);
      // console.log("prefix=", prefix);
      // console.log("prefixHex=", prefixHex);
      // console.log("checksum=", checksum);
      // console.log("decodedAddress=", decodedAddress);
      // console.log("bytesAddress=", bytesAddress);
      // console.log("encodedAddress=", encodedAddress);
      // console.log("parse data=", encHEX.parse(this.pubkeyData));
      return this.RaddressComputed == this.RaddressData;
    },

    tokenIDtoInfoMapping() {
      //this.myPokemonAPIDataRaw
      //balanceMapping
    }
    // tokenIDtoNameMapping(){
    //     return tokenInfoDataComp.map(element => {
    //         return {
    //             tokenid: tokenInfoDataComp.tokenid,

    //         }
    //     })
    // }
  }
};
</script>

<style>
</style>


