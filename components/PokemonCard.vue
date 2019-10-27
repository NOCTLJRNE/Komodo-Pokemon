<template>
  <v-card tile class="d-flex justify-center mb-3">
    <div class="d-flex flex-wrap justify-space-between">
      <div>
        <v-card-title
          class="headline"
          v-text="`#${myPokemonInfo[0].number}-${myPokemonInfo[0].name}`"
        ></v-card-title>

        <v-card-subtitle v-text="tokenID"></v-card-subtitle>
        <!-- <v-card-text>Balance: {{myPokemonInfo.tokenBalance}}</v-card-text> -->
        <v-card-text>{{myPokemonInfo[0].description}}</v-card-text>
        <v-card-text class>
          You have
          <span class="font-weight-bold" :class="[isMine ? green : orange]">{{balance}}</span>
          {{myPokemonInfo[0].name}}.
          <span
            class="font-weight-bold"
            :class="[isMine ? green : orange]"
          >{{isMineText}}</span>
        </v-card-text>
      </div>

      <v-avatar class="ma-3" size="140" tile>
        <v-img :src="myPokemonInfo[0].sprite"></v-img>
      </v-avatar>
    </div>
  </v-card>
</template>


<script>
import colors from "~/node_modules/vuetify/lib/util/colors";
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
    }
  },
  data() {
    return {
      green: "light-green--text text--accent-3",
      orange: "orange--text"
    };
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

<style>
</style>