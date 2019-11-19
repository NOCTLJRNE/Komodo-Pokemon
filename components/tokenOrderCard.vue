<template>
  <v-card class="ms-1 mb-1" cols="12" max-width="370px">
    <!-- <div class="d-flex flex-wrap justify-space-between"> -->
    <v-container>
      <v-row>
        <v-col cols="12" sm="5" md="5">
          <v-avatar class="ma-3" size="140" tile>
            <v-img :src="sprite"></v-img>
          </v-avatar>
        </v-col>

        <v-col cols="12" sm="2" md="2"></v-col>
        <v-col cols="12" sm="5" md="5">
          <v-card-title v-text="`#${number}`"></v-card-title>
          <v-card-title class="mb-1" v-text="`${name}`"></v-card-title>

          <v-chip
            class="my-1"
            v-for="type in types"
            :color="pokemonTypeColors[type]"
            :key="type"
          >{{ type }}</v-chip>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <v-card-text class="py-2">TokenID: {{orderData.tokenid}}</v-card-text>
          <v-card-text class="py-2">txid: {{orderData.txid}}</v-card-text>
          <v-card-text class="py-2">
            Amount: &nbsp
            <span class="title">{{orderData.totalrequired}}</span>
          </v-card-text>
          <!-- <v-card-text>funcid: {{orderData.funcid}}</v-card-text> -->
          <v-card-text class="py-2">
            Price per {{name}}: &nbsp
            <span class="title">{{orderData.price}}</span>
          </v-card-text>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0" cols="5" sm="5" md="5">
          <v-card-text>to {{orderText}}:</v-card-text>
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
          <v-btn :color="orderColor" v-on:click="placeOrderDialog = true">{{orderText}}</v-btn>
        </v-col>
        <v-col class="py-0" cols="12" sm="12" md="12">
          <v-card-text class="py-2">
            Totals:
            <span class="title">{{totals}}</span>
          </v-card-text>
        </v-col>
      </v-row>
      <v-dialog v-model="placeOrderDialog" max-width="600">
        <v-card>
          <v-card-title
            class="headline d-flex justify-center"
          >You're about to {{orderText}} {{quantity}} {{name}} !</v-card-title>
          <v-card-text class="d-flex justify-center">
            Please click on the button below to {{ orderText }}:
            {{ quantity }} {{name}} for {{ totals }} MORTY in total.
          </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn color="warning" @click="confirmOrder(orderText)">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-card>
</template>

<script>
import axios from "axios";
import pokemonTypeColors from "~/static/pokemonTypeColors.js";
export default {
  props: {
    localProxy: {
      required: true
    },
    orderData: {
      required: true
    },
    name: {
      required: true
    },
    number: {
      required: true
    },
    types: {
      required: true
    },
    sprite: {
      required: true
    }
  },
  data() {
    return {
      pokemonTypeColors: { ...pokemonTypeColors.colours },
      placeOrderDialog: false,
      quantity: 0
    };
  },
  methods: {
    confirmOrder(text) {
      this.placeOrderDialog = false;
      let vm = this;
      let command = "";
      if (text == "Buy") {
        command = "tokenFillAsk";
      } else if (text == "Sell") {
        command = "tokenFillBid";
      }
      console.log("ORCDER", command);

      axios
        .post(vm.localProxy, {
          method: command,
          params: [vm.orderData.tokenid, vm.orderData.txid, vm.quantity]
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
              //   console.log(response.data);
              vm.$emit("orderConfirmed", response.data);
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    }
  },
  computed: {
    orderText() {
      if (this.orderData.funcid == "s" || this.orderData.funcid == "S") {
        return "Buy";
      } else if (this.orderData.funcid == "b" || this.orderData.funcid == "B") {
        return "Sell";
      }
    },
    orderColor() {
      if (this.orderData.funcid == "s" || this.orderData.funcid == "S") {
        return "success";
      } else if (this.orderData.funcid == "b" || this.orderData.funcid == "B") {
        return "error";
      }
    },
    totals() {
      let temp = parseFloat(this.orderData.price) * parseInt(this.quantity);
      return parseFloat(temp);
    }
  }
};
</script>

<style>
</style>