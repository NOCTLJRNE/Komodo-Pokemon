<template>
  <v-card class="ms-1 mb-1" cols="12" max-width="370px">
    <!-- <div class="d-flex flex-wrap justify-space-between"> -->
    <v-container>
      <v-row>
        <v-col cols="12" sm="5" md="5">
          <v-avatar class="ma-3" size="140" tile>
            <v-img :src="myPokemonInfo[0].sprite"></v-img>
          </v-avatar>
        </v-col>

        <v-col cols="12" sm="2" md="2"></v-col>
        <v-col cols="12" sm="5" md="5">
          <v-card-title v-text="`#${myPokemonInfo[0].number}`"></v-card-title>
          <v-card-title class="mb-1" v-text="`${myPokemonInfo[0].name}`"></v-card-title>

          <!-- <v-card-subtitle v-text="tokenID"></v-card-subtitle> -->
          <!-- <v-card-text>Balance: {{myPokemonInfo.tokenBalance}}</v-card-text> -->
          <!-- <v-card-text :class="myPokemonInfo[0].types[0]">{{
            myPokemonInfo[0].types[0]
          }}</v-card-text>
          <p>
            <span :class="myPokemonInfo[0].types[0]">{{
              myPokemonInfo[0].types[0]
            }}</span>
          </p>-->

          <v-chip
            class="my-1"
            v-for="type in myPokemonInfo[0].types"
            :color="pokemonTypeColors[type]"
            :key="type"
          >{{ type }}</v-chip>

          <!-- <p>TESTING</p> -->
          <!-- <v-card-text>{{ myPokemonInfo[0].description }}</v-card-text> -->
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <v-card-subtitle v-text="`Token ID:`"></v-card-subtitle>
          <v-card-text>{{ tokenID }}</v-card-text>
          <v-card-subtitle v-text="`Description`"></v-card-subtitle>
          <v-card-text>{{ myPokemonInfo[0].description }}</v-card-text>
          <v-card-text>
            You have
            <span class="font-weight-bold" :class="[isMine ? green : orange]">
              {{
              balance
              }}
            </span>
            {{ myPokemonInfo[0].name }}.
            <span
              class="font-weight-bold"
              :class="[isMine ? green : orange]"
            >
              {{
              isMineText
              }}
            </span>
          </v-card-text>
        </v-col>
      </v-row>
      <v-row v-show="transferEnabled">
        <v-col cols="5" sm="5" md="5">
          <v-card-text>You will send</v-card-text>
        </v-col>
        <v-col cols="3" sm="3" md="3">
          <v-text-field
            background-color="grey darken-1"
            width
            v-model="quantity"
            label="0"
            solo
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="4" sm="4" md="4">
          <v-btn
            color="warning"
            v-on:click="transferTokenDialog = true"
            :disabled="!isMine"
          >Transfer</v-btn>
        </v-col>
      </v-row>
      <v-row v-show="placeOrderEnabled">
        <v-col class="py-0" cols="5" sm="5" md="5">
          <v-card-text>Quantity</v-card-text>
        </v-col>
        <v-col class="py-0" cols="3" sm="3" md="3">
          <v-text-field
            background-color="grey darken-1"
            width
            v-model="quantity"
            label="0"
            solo
            dense
          ></v-text-field>
        </v-col>
        <v-col class="py-0" cols="4" sm="4" md="4">
          <v-btn color="error" v-on:click="placeOrder('ask')" :disabled="!isMine">Ask</v-btn>
        </v-col>
      </v-row>
      <v-row v-show="placeOrderEnabled">
        <v-col class="py-0" cols="5" sm="5" md="5">
          <v-card-text class="py-0">Price per {{myPokemonInfo[0].name}}</v-card-text>
        </v-col>
        <v-col class="py-0" cols="3" sm="3" md="3">
          <v-text-field
            background-color="grey darken-1"
            width
            v-model="pricePerToken"
            label="0"
            solo
            dense
          ></v-text-field>
        </v-col>
        <v-col class="py-0" cols="4" sm="4" md="4">
          <v-btn color="success" v-on:click="placeOrder('bid')" :disabled="!isMine">Bid</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="transferTokenDialog" max-width="600">
      <v-card>
        <v-card-title class="headline d-flex justify-center">You're about to transfer your Pokémon !</v-card-title>
        <v-card-text class="d-flex justify-center">
          Please click on the button below to confirm sending {{ quantity }}
          {{ myPokemonInfo[0].name }} to {{ destPubkey }}.
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn color="warning" @click="transferToken">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="placeOrderDialog" max-width="600">
      <v-card>
        <v-card-title class="headline d-flex justify-center">You're about to trade your Pokémon !</v-card-title>
        <v-card-text class="d-flex justify-center">
          Please click on the button below to confirm your {{ action }} for
          {{ quantity }} {{myPokemonInfo[0].name}}, {{ pricePerToken }} each.
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn color="warning" @click="confirmOrder">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- </div> -->
  </v-card>
</template>

<script>
import colors from "~/node_modules/vuetify/lib/util/colors";
import pokemonTypeColors from "~/static/pokemonTypeColors.js";
import axios from "axios";
export default {
  props: {
    tokenID: {
      required: true
    },
    myPokemonInfo: {
      required: true
    },
    balance: { required: true },
    isMine: {
      required: true
    },
    signed: {
      required: true
    },
    transferEnabled: {
      required: true
    },
    placeOrderEnabled: {
      required: true
    },
    localProxy: {
      required: true
    },
    destPubkey: {
      required: true
    }
  },
  mounted() {
    console.log(pokemonTypeColors.colours["Grass"]);
    console.log("LOCAL HOST", this.localProxy);
  },
  data() {
    return {
      green: "light-green--text text--accent-3",
      orange: "orange--text",
      pokemonTypeColors: { ...pokemonTypeColors.colours },
      quantity: 0,
      transferTokenDialog: false,
      pricePerToken: 0,
      placeOrderDialog: false,
      action: ""
    };
  },
  methods: {
    transferToken() {
      this.transferTokenDialog = false;
      let vm = this;
      axios
        .post(vm.localProxy, {
          method: "tokenTransfer",
          params: [vm.tokenID, vm.destPubkey, vm.quantity]
        })
        .then(function(response) {
          //   console.log(response.data.hex);
          let rawtx = response.data.hex;
          axios
            .post(vm.localProxy, {
              method: "sendRawTransaction",
              params: [rawtx]
            })
            .then(function(response) {
              // console.log(response.data);
              vm.$emit("orderConfirmed", response.data);
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    },
    placeOrder(order) {
      this.placeOrderDialog = true;
      this.action = order;
      let command = `token${order}`;

      // let vm = this;
      // axios
      //   .post(vm.localProxy, {
      //     method: command,
      //     params: [vm.quantity, vm.tokenID, vm.pricePerToken]
      //   })
      //   .then(function(response) {
      //     // console.log(response.data.hex);
      //     let rawtx = response.data.hex;
      //     axios
      //       .post(vm.localProxy, {
      //         method: "sendRawTransaction",
      //         params: [rawtx]
      //       })
      //       .then(function(response) {
      //         console.log(response.data);
      //       })
      //       .catch(error => console.error(error));
      //   })
      //   .catch(error => console.error(error));
    },
    confirmOrder() {
      let command = `token${this.action}`;
      // if (order == "ask") {
      //   console.log("ASK");
      //   command
      // } else {
      //   console.log("BID");
      // }
      let vm = this;
      this.placeOrderDialog = false;
      axios
        .post(vm.localProxy, {
          method: command,
          params: [vm.quantity, vm.tokenID, vm.pricePerToken]
        })
        .then(function(response) {
          // console.log(response.data.hex);
          let rawtx = response.data.hex;
          axios
            .post(vm.localProxy, {
              method: "sendRawTransaction",
              params: [rawtx]
            })
            .then(function(response) {
              // console.log(response.data);
              vm.$emit("orderConfirmed", response.data);
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    }
  },
  computed: {
    isMineText() {
      return this.isMine
        ? ""
        : "Please verify your signature to claim your Pokémon !";
    }
  }
};
</script>

<style scoped>
</style>
