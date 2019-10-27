<template>
  <v-card tile class="d-flex justify-center mb-3">
    <div class="d-flex flex-nowrap justify-space-between">
      <div>
        <v-card-title
          class="headline"
          v-text="`#${myPokemonInfo.pokemonTokenData[0].number}-${myPokemonInfo.pokemonTokenData[0].name}`"
        ></v-card-title>

        <v-card-subtitle v-text="myPokemonInfo.tokenID"></v-card-subtitle>
        <!-- <v-card-text>Balance: {{myPokemonInfo.tokenBalance}}</v-card-text> -->
        <v-card-text>{{myPokemonInfo.pokemonTokenData[0].description}}</v-card-text>
        <v-card-text>
          You have
          <span class="font-weight-bold">{{myPokemonInfo.tokenBalance}}</span>
          {{myPokemonInfo.pokemonTokenData[0].name}}. {{isMineText}}
        </v-card-text>
      </div>

      <v-avatar class="ma-3" size="140" tile>
        <v-img :src="myPokemonInfo.pokemonTokenData[0].sprite"></v-img>
      </v-avatar>
    </div>
  </v-card>
</template>


<script>
export default {
  props: {
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