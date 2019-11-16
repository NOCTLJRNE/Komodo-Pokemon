<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="configData.rpcHost"
          label="RPChost"
          placeholder="127.0.0.1 (local Proxy)"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-text-field v-model="configData.rpcPort" label="RPCport" placeholder="16348 (MORTY)"></v-text-field>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-text-field v-model="configData.rpcUser" label="RPCuser" placeholder="your_RPC_username"></v-text-field>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-text-field
          v-model="configData.rpcPassword"
          label="RPCpassword"
          placeholder="your_super_secret_RPC_password"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field v-model="pubkeyData" label="Your Public Key" placeholder></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
          readonly
          v-model="RaddressComputed"
          label="Your R-Address"
          placeholder="Your_R_address"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="3" md="2">
        <v-btn color="primary" v-on:click="submitHandler">Load Orders</v-btn>
      </v-col>
      <!-- <v-col cols="12" sm="3" md="2">
          <v-btn color="success" v-on:click="verifySignature" :disabled="isMine"
            >Verify</v-btn
          >
      </v-col>-->
      <!-- <v-col cols="12" sm="3" md="2">
          <v-switch
            v-model="transferEnabled"
            label="transfer"
            color="warning"
            class="my-0"
          ></v-switch>
      </v-col>-->
      <!-- <v-col cols="12" sm="3" md="2">
          <v-btn
            color="warning"
            v-on:click="transferTokenDialog = true"
            :disabled="!isMine"
            >Transfer</v-btn
          >
      </v-col>-->
      <!-- <v-col cols="12" sm="6" md="3">
          <v-btn color="warning" v-on:click="testHandler">Test</v-btn>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-btn color="warning" v-on:click="posttHandler">Post</v-btn>
      </v-col>-->
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
    <!-- <v-alert dense border="left" type="warning" v-show="showWarning"
        >Please sign & verify with correct private/public keys pair</v-alert
    >-->
    <v-dialog v-model="showWarning" max-width="450">
      <v-card>
        <v-card-title class="headline d-flex justify-center">Signature verification failed !</v-card-title>
        <v-card-text
          class="d-flex justify-center"
        >Please sign & verify with correct private/public keys pair !</v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn color="warning" @click="showWarning = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <v-dialog v-model="transferTokenDialog" max-width="500">
        <v-card>
          <v-card-title class="headline d-flex justify-center"
            >You're about to transfer your Pokémon !</v-card-title
          >
          <v-card-text class="d-flex justify-center">
            Please click on the button below to confirm.
          </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn color="warning" @click="transferToken">
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>-->

    <!-- <div class="d-flex flex-row flex-wrap">
        <PokemonCard
          v-if="pokemonAPIDataLoaded && balanceMapping[name]"
          v-for="(value, name) of myPokemonAPIDataRaw"
          v-bind:tokenID="name"
          v-bind:myPokemonInfo="value"
          v-bind:balance="balanceMapping[name]"
          v-bind:isMine="isMine"
          v-bind:signed="signed"
          v-bind:key="name"
          :transferEnabled="transferEnabled"
          :localProxy="localProxy"
          :destPubkey="destPubkeyData"
        ></PokemonCard>
    </div>-->
    <div class="d-flex flex-row flex-wrap">
      <TokenOrderCard v-for="order in ordersData" :key="order.txid" :orderData="order"></TokenOrderCard>
    </div>
  </v-container>
</template>

<script>
// import RpcClient from "~/modules/bitcoindrpc";
import pokemontxlist from "~/static/pokemontxList.js";
import axios from "axios";
import TokenOrderCard from "~/components/tokenOrderCard";
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
    TokenOrderCard
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
    destPubkeyData: "",
    destRaddressData: "",
    tokenListDataRaw: [],
    tokenInfoDataRaw: [],
    // balanceListDataRaw: [],
    balanceMapping: {},
    // totalBalance: 0,
    pokemonAPIDataLoaded: false,
    // myPokemonAPIDataRaw: [],
    myPokemonAPIDataRaw: {},
    isMine: false,
    signed: false,
    showWarning: false,
    transferEnabled: false,
    transferTokenDialog: false,
    localProxy: "",
    ordersPerTokenData: [],
    ordersData: []
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
    this.destPubkeyData = rpcConfig.rpcPubkey;
    this.destRaddressData = rpcConfig.rpcRaddress;
    this.localProxy = `http://${proxyConfig.proxyHost}:${proxyConfig.proxyPort}/calls`;
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
      // const localProxy = `http://${proxyConfig.proxyHost}:${proxyConfig.proxyPort}/calls`;
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

      // this.rpc = new RpcClient(config);

      var temp = [];
      let vm = this;

      this.tokenOrdersLoading();
      // if (!this.interval) {
      //   this.interval = setInterval(this.balanceChecking, 10000);
      // }
    },
    tokenOrdersLoading() {
      console.log("Loading orders");
      this.ordersPerTokenData = [];
      this.ordersData = [];
      let vm = this;
      Object.keys(pokemontxlist).forEach(tokenid => {
        axios
          .post(vm.localProxy, { method: "tokenOrders", params: [tokenid] })
          .then(function(response) {
            console.log(response.data);
            // vm.tokenOrdersData.push(response.data);
            if (response.data) {
              vm.ordersPerTokenData.push(response.data);
              let temp = [...response.data];
              temp.forEach(order => vm.ordersData.push(order));
            }
          })
          .catch(error => console.error(error));
      });
    },
    balanceChecking() {
      console.log("checking balance");
      let vm = this;
      Object.keys(pokemontxlist).forEach(tokenid => {
        var arg = vm.pubkeyData ? [tokenid, vm.pubkeyData] : [tokenid];

        // const localProxy = `http://${proxyConfig.proxyHost}:${proxyConfig.proxyPort}/calls`;

        axios
          .post(
            vm.localProxy,
            {
              method: "tokenBalance",
              params: [...arg]
            }
            // {
            //   params: "searchTerm"
            // }
          )
          .then(function(response) {
            // console.log(response.data);
            let balance = response.data.balance;
            // vm.totalBalance += balance;
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
      });
    },
    verifySignature() {
      console.log(rpcConfig.rpcRaddress);
      // const localProxy = `http://${proxyConfig.proxyHost}:${proxyConfig.proxyPort}/calls`;
      let vm = this;
      let address = this.RaddressComputed
        ? this.RaddressComputed
        : rpcConfig.rpcRaddress;
      axios
        .post(vm.localProxy, {
          method: "signMessage",
          params: [address, "Pokemon"]
        })
        .then(function(response) {
          console.log(response.data);
          let signature = response.data;
          axios
            .post(vm.localProxy, {
              method: "verifyMessage",
              params: [address, signature, "Pokemon"]
            })
            .then(function(response) {
              vm.isMine = response.data;
              console.log(response.data);
            })
            .catch(error => {
              console.error(error);
              vm.isMine = false;
              vm.showWarning = true;
              // alert(
              //   "Please sign & verify with correct private/public keys pair !"
              // );
            });
        })
        .catch(error => {
          console.error(error);
          vm.isMine = false;
          vm.showWarning = true;
          // alert("Please sign & verify with correct private/public keys pair !");
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
    transferToken() {
      let vm = this;
      this.transferTokenDialog = false;
      axios.post(vm.localProxy, {
        method: "tokenTransfer",
        params: [address, vm.destPubkeyData, 1]
      });
    }
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
    destRaddressComputed() {
      let sha256Hash = SHA256(encHEX.parse(this.destPubkeyData));
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