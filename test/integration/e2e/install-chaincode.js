/**
 Copyright Deevo Corp. All Rights Reserved.

 SPDX-License-Identifier: Apache-2.0
*/

// This is an end-to-end test that focuses on exercising all parts of the fabric APIs
// in a happy-path scenario
'use strict';

var utils = require('fabric-client/lib/utils.js');
var logger = utils.getLogger('E2E install-chaincode');

var tape = require('tape');
var _test = require('tape-promise');
var test = _test(tape);

var e2eUtils = require('./e2eUtils.js');
var testUtil = require('../../unit/util.js');

var version = 'v0';

test('\n\n***** End-to-end flow: chaincode install *****\n\n', (t) => {
	testUtil.setupChaincodeDeploy();

	e2eUtils.installChaincode('org1', testUtil.CHAINCODE_PATH, testUtil.METADATA_PATH, version, 'golang', t, true)
	.then(() => {
		t.pass('Successfully installed chaincode in peers of organization "org1"');
		return e2eUtils.installChaincode('org2', testUtil.CHAINCODE_PATH, testUtil.METADATA_PATH, version, 'golang', t, true);
	}, (err) => {
		t.fail('Failed to install chaincode in peers of organization "org1". ' + err.stack ? err.stack : err);
		logger.error('Failed to install chaincode in peers of organization "org1". ');
		//return e2eUtils.installChaincode('org2', testUtil.CHAINCODE_PATH, testUtil.METADATA_PATH, version, 'golang', t, true);
		return t.end();
	})
	.then(() => {
		t.pass('Successfully installed chaincode in peers of organization "org2"');
		return e2eUtils.installChaincode('org3', testUtil.CHAINCODE_PATH, testUtil.METADATA_PATH, version, 'golang', t, true);
	}, (err) => {
		t.fail('Failed to install chaincode in peers of organization "org2". ' + err.stack ? err.stack : err);
		logger.error('Failed to install chaincode in peers of organization "org2". ');
		//return e2eUtils.installChaincode('org2', testUtil.CHAINCODE_PATH, testUtil.METADATA_PATH, version, 'golang', t, true);
		return t.end();
	})
	.then(() => {
		t.pass('Successfully installed chaincode in peers of organization "org3"');
		return e2eUtils.installChaincode('org4', testUtil.CHAINCODE_PATH, testUtil.METADATA_PATH, version, 'golang', t, true);
	}, (err) => {
		t.fail('Failed to install chaincode in peers of organization "org3". ' + err.stack ? err.stack : err);
		logger.error('Failed to install chaincode in peers of organization "org3". ');
		//return e2eUtils.installChaincode('org2', testUtil.CHAINCODE_PATH, testUtil.METADATA_PATH, version, 'golang', t, true);
		return t.end();
	})
	.then(() => {
		t.pass('Successfully installed chaincode in peers of organization "org4"');
		return e2eUtils.installChaincode('org5', testUtil.CHAINCODE_PATH, testUtil.METADATA_PATH, version, 'golang', t, true);
	}, (err) => {
		t.fail('Failed to install chaincode in peers of organization "org4". ' + err.stack ? err.stack : err);
		logger.error('Failed to install chaincode in peers of organization "org4". ');
		//return e2eUtils.installChaincode('org2', testUtil.CHAINCODE_PATH, testUtil.METADATA_PATH, version, 'golang', t, true);
		return t.end();
	})
	.then(() => {
		t.pass('Successfully installed chaincode in peers of organization "org5"');
		return t.end();
	}, (err) => {
		t.fail('Failed to install chaincode in peers of organization "org5". ' + err.stack ? err.stack : err);
		logger.error('Failed to install chaincode in peers of organization "org5". ');
		//return e2eUtils.installChaincode('org2', testUtil.CHAINCODE_PATH, testUtil.METADATA_PATH, version, 'golang', t, true);
		t.end();
	})
	.then(() => {
		t.pass('Successfully installed chaincode in peers of organization "org1 org2 org3 org4 org5"');
		t.end();
	}, (err) => {
		t.fail('Failed to install chaincode in peers of organization "org1 org2 org3 org4 org5". ' + err.stack ? err.stack : err);
		logger.error('Failed to install chaincode in peers of organization "org1 org2 org3 org4 org5". ');
		t.end();
	}).catch((err) => {
		t.fail('Test failed due to unexpected reasons. ' + err.stack ? err.stack : err);
		t.end();
	});
});
