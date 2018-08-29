/**
 * Copyright 2016 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';

var utils = require('fabric-client/lib/utils.js');
var logger = utils.getLogger('E2E create-channel');

var tape = require('tape');
var _test = require('tape-promise');
var test = _test(tape);

var Client = require('fabric-client');
var util = require('util');
var fs = require('fs');
var path = require('path');

var testUtil = require('../unit/util.js');
var e2eUtils = require('./e2e/e2eUtils.js');

var the_user = null;
var ORGS;

var channel_name = 'mychannel2';
//can use "channel=<name>" to control the channel name from command line
if (process.argv.length > 2) {
	if (process.argv[2].indexOf('channel=') === 0) {
		channel_name = process.argv[2].split('=')[1];
	}
}
//
//Attempt to send a request to the orderer with the createChannel method
//
test('\n\n***** Configtx Built config  create flow  *****\n\n', function(t) {
	testUtil.resetDefaults();
	Client.addConfigFile(path.join(__dirname, 'e2e', 'config.json'));
	ORGS = Client.getConfigSetting('test-network');

	//var channel_name = 'mychanneltx';
	Client.setConfigSetting('E2E_CONFIGTX_CHANNEL_NAME', channel_name);

	//
	// Create and configure the test channel
	//
	var client = new Client();

	var caRootsPath = ORGS.orderer.tls_cacerts;
	let data = fs.readFileSync(path.join(__dirname, '/test', caRootsPath));
	let caroots = Buffer.from(data).toString();

	var config = null;
	var signatures = [];
	var request = null;
	var orderer = null;
	var tlsInfo = null;

	// Acting as a client in org1 when creating the channel
	var org = ORGS.org1.name;

	utils.setConfigSetting('key-value-store', 'fabric-client/lib/impl/FileKeyValueStore.js');

	return e2eUtils.tlsEnroll('org1')
	.then((enrollment) => {
		t.pass('Successfully retrieved TLS certificate');
		tlsInfo = enrollment;
		
		return Client.newDefaultKeyValueStore({path: testUtil.storePathForOrg(org)});
	}).then((store) => {
		client.setStateStore(store);

		return testUtil.getSubmitter(client, t, true /*get the org admin*/, 'org1');
	}).then((admin) =>{
		t.pass('Successfully enrolled user \'admin\' for orderer (create-configtx-channel 1)');
		t.pass(tlsInfo.certificate);
		t.pass(readFile('../networkconfig/peer0.org1.deevo.com/tls/peer0.org1.deevo.com-client.crt').toString());
		orderer = client.newOrderer(
			ORGS.orderer.url,
			{
				'pem': caroots,
				'clientCert': tlsInfo.certificate,
				'clientKey': tlsInfo.key,
				'ssl-target-name-override': ORGS.orderer['server-hostname'],
				'grpc-max-send-message-length': 1024 * 1024 * 10,
				'grpc.max_send_message_length': 1024 * 1024 * 10,
				'grpc.max_receive_message_length': 8 * 1024 * 1024
			}
		);

		logger.info('\n\n***** Get the configtx config update configuration  *****\n\n');
		// use the config update created by the configtx tool
		let envelope_bytes = fs.readFileSync(path.join(__dirname, '../fixtures/channel/' + channel_name + '.tx'));
		config = client.extractChannelConfig(envelope_bytes);
		t.pass('Successfull extracted the config update from the configtx envelope');

		// sign the config
		var signature = client.signChannelConfig(config);
		t.pass('Successfully signed config update');
		// collect signature from org1 admin
		signatures.push(signature);

		// make sure we do not reuse the user
		client._userContext = null;
		return testUtil.getSubmitter(client, t, true /*get the org admin*/, 'org2');
	}).then((admin) => {
		t.pass('Successfully enrolled user \'admin\' for org2');

		// sign the config
		var signature = client.signChannelConfig(config);
		t.pass('Successfully signed config update');

		// collect signature from org2 admin
		signatures.push(signature);

		// make sure we do not reuse the user
		client._userContext = null;
		return testUtil.getSubmitter(client, t, true /*get the org admin*/, 'org3');
	})
	.then((admin) => {
		t.pass('Successfully enrolled user \'admin\' for org3');

		// sign the config
		var signature = client.signChannelConfig(config);
		t.pass('Successfully signed config update');

		// collect signature from org2 admin
		signatures.push(signature);

		// make sure we do not reuse the user
		client._userContext = null;
		return testUtil.getSubmitter(client, t, true /*get the org admin*/, 'org4');
	})
	.then((admin) => {
		t.pass('Successfully enrolled user \'admin\' for org4');

		// sign the config
		var signature = client.signChannelConfig(config);
		t.pass('Successfully signed config update');

		// collect signature from org2 admin
		signatures.push(signature);

		// make sure we do not reuse the user
		client._userContext = null;
		return testUtil.getSubmitter(client, t, true /*get the org admin*/, 'org5');
	})
	.then((admin) => {
		t.pass('Successfully enrolled user \'admin\' for org5');

		// sign the config
		var signature = client.signChannelConfig(config);
		t.pass('Successfully signed config update');

		// collect signature from org2 admin
		signatures.push(signature);

		// make sure we do not reuse the user
		client._userContext = null;
		return testUtil.getOrderAdminSubmitter(client, t);
	}).then((admin) => {
		t.pass('Successfully enrolled user \'admin\' for orderer (create-configtx-channel 2)');
		the_user = admin;

		// sign the config
		var signature = client.signChannelConfig(config);
		t.pass('Successfully signed config update');

		// collect signature from orderer org admin
		signatures.push(signature);

		logger.debug('\n***\n done signing \n***\n');

		// build up the create request
		let tx_id = client.newTransactionID();
		request = {
			config: config,
			signatures : signatures,
			name : channel_name,
			orderer : orderer,
			txId  : tx_id
		};

		// send to create request to orderer
		return client.createChannel(request);
	})
	.then((result) => {
		logger.debug('\n***\n completed the create \n***\n');

		logger.debug(' response ::%j',result);
		t.pass('Successfully created the channel.');
		if(result.status && result.status === 'SUCCESS') {
			return e2eUtils.sleep(5000);
		} else {
			t.fail('Failed to create the channel. ');
			t.end();
		}
	}, (err) => {
		t.fail('Failed to create the channel: ' + err.stack ? err.stack : err);
		t.end();
	})
	.then((nothing) => {
		t.pass('Successfully waited to make sure new channel was created.');

		logger.info('\n\n >>>>>>  Should fail to create the existing channel again with name :: %s <<<<<<< \n\n',channel_name);
		return client.createChannel(request);
	}, (err) => {
		t.fail('Failed to sleep due to error: ' + err.stack ? err.stack : err);
		t.end();
	})
	.then((result) => {
		logger.debug(' response ::%j',result);
		if(result && result.status && result.status.toString().indexOf('BAD_REQUEST') >= 0) {
			t.pass('Successfully received the error message due to the conflict of channel: ' + result.info);
		} else {
			t.fail('Failed to get error. response: ' + result.status);
		}
		t.end();
	}, (err) => {
		t.fail('Got unexpected error: ' + err.stack ? err.stack : err);
		t.end();
	});
});
function readFile(path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, (err, data) => {
			if (!!err)
				reject(new Error('Failed to read file ' + path + ' due to error: ' + err));
			else
				resolve(data);
		});
	});
}
