# komodo-pokemon

> Pokémon NFT created on Komodo

## Setting Up
Follow these instructions to install komodo on your local host [instructions](https://docs.komodoplatform.com/notary/setup-Komodo-Notary-Node.html#install-komodo-by-compiling-it-from-source)
``` bash
# launch MORTY chain
$ komodod -pubkey=$pubkey -ac_name=MORTY -ac_supply=90000000000 -ac_reward=100000000 -ac_cc=3 -ac_staked=10 -addnode=95.217.44.58 -addnode=138.201.136.145 &
# import your private key
$ komodo-cli -ac_name=MORTY importprivkey <your_priv_key>
```

Rename rpcConfig_sample.js into rpcConfig.js and 

## Build & Run

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
"# Komodo-Pokemon" 
