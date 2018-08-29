# deevo-insight
- Clone fabric-sdk-node: https://github.com/hyperledger/fabric-sdk-node
- checkout branch release-1.1
deevo insight
- Install node v8.11.4 (nodejs v8.11.4)
- Install npm 5.6.0
- Install gulp cli 2.0.1, gulp module local 3.9.1
- Install tape-promise: npm i --save-dev tape-promise
- Install tape: npm i --save-dev tape
Run gulp
- gulp ca
Run test each file:
- Node node test/integration/e2e.js
  ++ Create channel
  ++ Join_channel
  ++ Install chaincode
  ++ Instantiate chaincode
  ++ Invoke transaction
  ++ Query chaincode
  ++ Upgrade