<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-text-field v-model="rpchost" label="RPChost" placeholder="127.0.0.1"></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-text-field v-model="rpcport" label="RPCport" placeholder="29146"></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-text-field v-model="rpcuser" label="RPCuser" placeholder="your RPC username"></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-model="rpcpassword"
            label="RPCpassword"
            placeholder="your super secret RPC password"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <div class="my-2">
          <v-btn color="primary" v-on:click="validateHandler">Validate</v-btn>
        </div>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
//import RpcClient from "node-komodo-rpc";
export default {
  data: () => ({
    rpchost: "127.0.0.1",
    rpcport: "29146",
    rpcuser: "",
    rpcpassword: ""
  }),
  methods: {
    validateHandler() {
      console.log("host:", this.rpchost);
      console.log("port:", this.rpcport);
      console.log("user:", this.rpcuser);
      console.log("password:", this.rpcpassword);
      var RpcClient = require("bitcoind-rpc"); //const RpcClient = require("node-komodo-rpc");
      var config = {
        protocol: "http",
        user: "user3733460462",
        pass:
          "pass7d4aeedeb64d149a355a15079ece22255d9dca8cb17546487850decf7fd63ca6de",
        host: "192.168.1.12",
        port: "29146"
      };

      var rpc = new RpcClient(config);

      rpc.getInfo(function(err, ret) {
        if (err) {
          console.error(err);
        } else {
          console.log(ret);
        }
      });
    }
  },
  computed: {}
};
</script>

<style>
</style>