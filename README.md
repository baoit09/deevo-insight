# deevo-insight
- Clone fabric-sdk-node: https://github.com/hyperledger/fabric-sdk-node
- checkout branch release-1.1
deevo insight
- Install node v8.11.4 (nodejs v8.11.4)
- Install npm 5.6.0
- Install gulp cli 2.0.1: npm i -g gulp-cli
- Install gulp module local 3.9.1: npm i gulp
- Install tape-promise: npm i --save-dev tape-promise
- Install tape: npm i --save-dev tape
- Run gulp: gulp ca
- Run all testes:
  - node test/integration/e2e.js  
- Run Create channel: node test/integration/e2e/create-channel.js 
- Run Join_channel: node test/integration/e2e/join-channel.js
- Run Install chaincode: node test/integration/e2e/install-chaincode.js
- Run Instantiate chaincode: node test/integration/e2e/instantiate-chaincode.js
- Run Invoke transaction: node test/integration/e2e/invoke-transaction.js
- Run Query chaincode: node test/integration/e2e/query.js
- Run Upgrade: please ask Mr.DatLV for more information.      
