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
If you're planning to run this web app on a remote machine on the same local network with the local host (that has komodod running), then add this line rpcallowip=your_remote_ip and remove this line rpcbind=127.0.0.1 in .komodo/MORTY/MORTY.conf , then stop and restart MORTY.
 Then try to make a rpc call from your remote machine. For example:
 ``` bash
curl --user rpc_username:rpc_password --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getinfo", "params": [] }' -H 'content-type: text/plain;' http://<local_host_ip>:16348/
# and wait for the response
```
(For windows the command above only works in git bash or linux shell).

Clone Komodo-Pokemon repo
``` bash
$ git clone https://github.com/NOCTLJRNE/Komodo-Pokemon.git
```
Rename rpcConfig_sample.js into rpcConfig.js and edit its content 
```
  rpcHost: "", // 127.0.0.1 if you run the app & bakcground daemon are on the same host
  rpcPort: "", // 16348 for Morty
  rpcUser: "", //your_rpc_user_name
  rpcPassword: "", //your_rpc_user_password
  rpcPubkey: "", //your pubkey, if no pubkey is provided, the pubkey used to launch the daemon is the default
  rpcRaddress: "" //your Raddress corresponding to the pubkey, will be caculated from your pubkey, so leave it blank
```

## Build & Run
NodeJS & npm must be installed first [NodeJS](https://nodejs.org/en/)
``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000, you can skip this and build for production instead
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

```
I run into an issue related to "Access-Control-Allow-Origin" header (which I recently find out the solution, check out **test_proxy_integrated** branch), basically the web browser blocks any result returned by my rpc requests because I didn't properly set up my server-side application on the localhost, you can read about it [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSMissingAllowOrigi) . For now I use this work around [link](https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome).
On Ubuntu:
``` bash
# launch a google chrome window with --disable-web-security arguement
google-chrome --user-data-dir=/tmp --disable-web-security
````
On Windows:
Copy your Google Chrome shortcut into a new one, then edit its Properties/Shortcut/Target value: "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:/ChromeDevSession"
Then open a new windows with it. 
Don't use these windows to browse online websites btw
Browse to http://localhost:3000/pokedex (if you have succesfully run npm run start)
All text fields should be prefilled with the information you configured.
Click on SUBMIT.
You don't have any Pokémon ? Let me know in Komodo's Discord #cc-assets, I'll send you a starter Pokémon !
![stage1](https://raw.githubusercontent.com/NOCTLJRNE/Komodo-Pokemon/master/img/01.JPG)
