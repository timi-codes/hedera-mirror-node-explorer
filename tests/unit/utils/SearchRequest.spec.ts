// noinspection DuplicatedCode

/*-
 *
 * Hedera Mirror Node Explorer
 *
 * Copyright (C) 2021 - 2024 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {describe, expect, test} from 'vitest'
import MockAdapter from "axios-mock-adapter";
import axios, {AxiosInstance} from "axios";
import {
    SAMPLE_ACCOUNT,
    SAMPLE_ACCOUNTS,
    SAMPLE_BLOCKSRESPONSE,
    SAMPLE_CONTRACT,
    SAMPLE_CONTRACT_RESULT_DETAILS,
    SAMPLE_TOKEN,
    SAMPLE_TOPIC,
    SAMPLE_TRANSACTION,
    SAMPLE_TRANSACTIONS
} from "../Mocks";
import {SearchRequest} from "@/utils/SearchRequest";
import {base32ToAlias, base64DecToArr, byteToHex, hexToByte} from "@/utils/B64Utils";
import {EntityID} from "@/utils/EntityID";
import {fetchGetURLs} from "../MockUtils";


const TEST_NETWORK = "mainnet"

describe("SearchRequest.ts", () => {

    //
    // Account
    //

    test("account", async () => {
        const mock = makeMockAdapter(axios)

        const r = new SearchRequest(SAMPLE_ACCOUNT.account ?? "", TEST_NETWORK)
        await r.run()

        expect(r.searchedId).toBe(SAMPLE_ACCOUNT.account)
        expect(r.network).toBe(TEST_NETWORK)
        expect(r.account).toStrictEqual(SAMPLE_ACCOUNT)
        expect(r.accountsWithKey).toStrictEqual([])
        expect(r.transactions).toStrictEqual([])
        expect(r.tokenInfo).toBeNull()
        expect(r.topic).toBeNull()
        expect(r.contract).toBeNull()
        expect(r.block).toBeNull()
        expect(r.ethereumAddress).toBeNull()
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account,
            "api/v1/contracts/" + SAMPLE_ACCOUNT.account,
            "api/v1/tokens/" + SAMPLE_ACCOUNT.account,
            "api/v1/topics/" + SAMPLE_ACCOUNT.account,
        ])

        mock.restore()
    })

    test("account (with eth address)", async () => {
        const mock = makeMockAdapter(axios)

        const r = new SearchRequest(SAMPLE_ACCOUNT_ADDRESS, TEST_NETWORK)
        await r.run()

        expect(r.searchedId).toBe(SAMPLE_ACCOUNT_ADDRESS)
        expect(r.network).toBe(TEST_NETWORK)
        expect(r.account).toStrictEqual(SAMPLE_ACCOUNT)
        expect(r.accountsWithKey).toStrictEqual([])
        expect(r.transactions).toStrictEqual([])
        expect(r.tokenInfo).toBeNull()
        expect(r.topic).toBeNull()
        expect(r.contract).toBeNull()
        expect(r.block).toBeNull()
        expect(r.ethereumAddress).toBe("0x" + SAMPLE_ACCOUNT_ADDRESS)
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + SAMPLE_ACCOUNT_ADDRESS,
            "api/v1/contracts/" + SAMPLE_ACCOUNT_ADDRESS,
            "api/v1/tokens/" + SAMPLE_ACCOUNT.account,
        ])

        mock.restore()
    })

    test("account (with public key)", async () => {
        const mock = makeMockAdapter(axios)

        const r = new SearchRequest(SAMPLE_ACCOUNT.key.key, TEST_NETWORK)
        await r.run()

        expect(r.searchedId).toBe(SAMPLE_ACCOUNT.key.key)
        expect(r.network).toBe(TEST_NETWORK)
        expect(r.account).toBeNull()
        expect(r.accountsWithKey).toStrictEqual([SAMPLE_ACCOUNT])
        expect(r.transactions).toStrictEqual([])
        expect(r.tokenInfo).toBeNull()
        expect(r.topic).toBeNull()
        expect(r.contract).toBeNull()
        expect(r.block).toBeNull()
        expect(r.ethereumAddress).toBeNull()
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/results/" + SAMPLE_ACCOUNT.key.key,
            "api/v1/blocks/" + SAMPLE_ACCOUNT.key.key,
            "api/v1/accounts/?account.publickey=" + SAMPLE_ACCOUNT.key.key + "&limit=2",
        ])

        mock.restore()
    })

    test("account (with alias)", async () => {
        const mock = makeMockAdapter(axios)

        const r = new SearchRequest(SAMPLE_ACCOUNT.alias, TEST_NETWORK)
        await r.run()

        expect(r.searchedId).toBe(SAMPLE_ACCOUNT.alias)
        expect(r.network).toBe(TEST_NETWORK)
        expect(r.account).toStrictEqual(SAMPLE_ACCOUNT)
        expect(r.accountsWithKey).toStrictEqual([])
        expect(r.transactions).toStrictEqual([])
        expect(r.tokenInfo).toBeNull()
        expect(r.topic).toBeNull()
        expect(r.contract).toBeNull()
        expect(r.block).toBeNull()
        expect(r.ethereumAddress).toBeNull()
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + SAMPLE_ACCOUNT.alias,
        ])

        mock.restore()
    })

    test("account (with alias expressed in hex)", async () => {
        const mock = makeMockAdapter(axios)

        const SAMPLE_ALIAS_HEX = byteToHex(base32ToAlias(SAMPLE_ACCOUNT.alias)!)
        const r = new SearchRequest(SAMPLE_ALIAS_HEX, TEST_NETWORK)
        await r.run()

        expect(r.searchedId).toBe(SAMPLE_ALIAS_HEX)
        expect(r.network).toBe(TEST_NETWORK)
        expect(r.account).toStrictEqual(SAMPLE_ACCOUNT)
        expect(r.accountsWithKey).toStrictEqual([])
        expect(r.transactions).toStrictEqual([])
        expect(r.tokenInfo).toBeNull()
        expect(r.topic).toBeNull()
        expect(r.contract).toBeNull()
        expect(r.block).toBeNull()
        expect(r.ethereumAddress).toBeNull()
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + SAMPLE_ACCOUNT.alias,
        ])

        mock.restore()
    })

    //
    // Transaction
    //

    test("transaction", async () => {
        const mock = makeMockAdapter(axios)

        const r = new SearchRequest(SAMPLE_TRANSACTION.transaction_id ?? "", TEST_NETWORK)
        await r.run()

        expect(r.searchedId).toBe(SAMPLE_TRANSACTION.transaction_id)
        expect(r.network).toBe(TEST_NETWORK)
        expect(r.account).toBeNull()
        expect(r.accountsWithKey).toStrictEqual([])
        expect(r.transactions).toStrictEqual([SAMPLE_TRANSACTION])
        expect(r.tokenInfo).toBeNull()
        expect(r.topic).toBeNull()
        expect(r.contract).toBeNull()
        expect(r.block).toBeNull()
        expect(r.ethereumAddress).toBeNull()
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/transactions/" + SAMPLE_TRANSACTION.transaction_id,
        ])

        mock.restore()
    })

    test("transaction (with hedera hash)", async () => {
        const mock = makeMockAdapter(axios)

        const r = new SearchRequest(TRANSACTION_HASH, TEST_NETWORK)
        await r.run()

        expect(r.searchedId).toBe(TRANSACTION_HASH)
        expect(r.network).toBe(TEST_NETWORK)
        expect(r.account).toBeNull()
        expect(r.accountsWithKey).toStrictEqual([])
        expect(r.transactions).toStrictEqual([SAMPLE_TRANSACTION])
        expect(r.tokenInfo).toBeNull()
        expect(r.topic).toBeNull()
        expect(r.contract).toBeNull()
        expect(r.block).toBeNull()
        expect(r.ethereumAddress).toBeNull()
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/transactions/" + TRANSACTION_HASH,
            "api/v1/blocks/" + TRANSACTION_HASH,
        ])

        mock.restore()
    })

    test("transaction (with evm hash)", async () => {
        const mock = makeMockAdapter(axios)

        const r = new SearchRequest(SAMPLE_CONTRACT_RESULT_DETAILS.hash, TEST_NETWORK)
        await r.run()

        expect(r.searchedId).toBe(SAMPLE_CONTRACT_RESULT_DETAILS.hash)
        expect(r.network).toBe(TEST_NETWORK)
        expect(r.account).toBeNull()
        expect(r.accountsWithKey).toStrictEqual([])
        expect(r.transactions).toStrictEqual([SAMPLE_TRANSACTION])
        expect(r.tokenInfo).toBeNull()
        expect(r.topic).toBeNull()
        expect(r.contract).toBeNull()
        expect(r.block).toBeNull()
        expect(r.ethereumAddress).toBeNull()
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/results/" + EVM_HASH,
            "api/v1/blocks/" + EVM_HASH,
            "api/v1/accounts/?account.publickey=" + EVM_HASH + "&limit=2",
            "api/v1/transactions?timestamp=" + SAMPLE_TRANSACTION.consensus_timestamp,
        ])

        mock.restore()
    })

    //
    // Block
    //

    test("block (with hash)", async () => {
        const mock = makeMockAdapter(axios)

        const r = new SearchRequest(BLOCK_HASH, TEST_NETWORK)
        await r.run()

        expect(r.searchedId).toBe(BLOCK_HASH)
        expect(r.network).toBe(TEST_NETWORK)
        expect(r.account).toBeNull()
        expect(r.accountsWithKey).toStrictEqual([])
        expect(r.transactions).toStrictEqual([])
        expect(r.tokenInfo).toBeNull()
        expect(r.topic).toBeNull()
        expect(r.contract).toBeNull()
        expect(r.block).toStrictEqual(SAMPLE_BLOCKSRESPONSE.blocks[0])
        expect(r.ethereumAddress).toBeNull()
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/transactions/" + BLOCK_HASH,
            "api/v1/blocks/" + BLOCK_HASH,
        ])
        mock.restore()
    })

    test("block (with hash prefix)", async () => {
        const mock = makeMockAdapter(axios)

        const r = new SearchRequest(BLOCK_HASH_PREFIX, TEST_NETWORK)
        await r.run()

        expect(r.searchedId).toBe(BLOCK_HASH_PREFIX)
        expect(r.network).toBe(TEST_NETWORK)
        expect(r.account).toBeNull()
        expect(r.accountsWithKey).toStrictEqual([])
        expect(r.transactions).toStrictEqual([])
        expect(r.tokenInfo).toBeNull()
        expect(r.topic).toBeNull()
        expect(r.contract).toBeNull()
        expect(r.block).toStrictEqual(SAMPLE_BLOCKSRESPONSE.blocks[0])
        expect(r.ethereumAddress).toBeNull()
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/results/" + BLOCK_HASH_PREFIX,
            "api/v1/blocks/" + BLOCK_HASH_PREFIX,
            "api/v1/accounts/?account.publickey=" + BLOCK_HASH_PREFIX + "&limit=2",
        ])
        mock.restore()
    })

    //
    // Token
    //

    test("token", async () => {
        const mock = makeMockAdapter(axios)

        const r = new SearchRequest(SAMPLE_TOKEN.token_id, TEST_NETWORK)
        await r.run()

        expect(r.searchedId).toBe(SAMPLE_TOKEN.token_id)
        expect(r.network).toBe(TEST_NETWORK)
        expect(r.account).toBeNull()
        expect(r.accountsWithKey).toStrictEqual([])
        expect(r.transactions).toStrictEqual([])
        expect(r.tokenInfo).toStrictEqual(SAMPLE_TOKEN)
        expect(r.topic).toBeNull()
        expect(r.contract).toBeNull()
        expect(r.block).toBeNull()
        expect(r.ethereumAddress).toBeNull()
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + SAMPLE_TOKEN.token_id,
            "api/v1/contracts/" + SAMPLE_TOKEN.token_id,
            "api/v1/tokens/" + SAMPLE_TOKEN.token_id,
            "api/v1/topics/" + SAMPLE_TOKEN.token_id,
        ])
        mock.restore()
    })

    test("token (with ethereum address)", async () => {
        const mock = makeMockAdapter(axios)

        const r = new SearchRequest(SAMPLE_TOKEN_ADDRESS, TEST_NETWORK)
        await r.run()

        expect(r.searchedId).toBe(SAMPLE_TOKEN_ADDRESS)
        expect(r.network).toBe(TEST_NETWORK)
        expect(r.account).toBeNull()
        expect(r.accountsWithKey).toStrictEqual([])
        expect(r.transactions).toStrictEqual([])
        expect(r.tokenInfo).toStrictEqual(SAMPLE_TOKEN)
        expect(r.topic).toBeNull()
        expect(r.contract).toBeNull()
        expect(r.block).toBeNull()
        expect(r.ethereumAddress).toBe("0x" + SAMPLE_TOKEN_ADDRESS)
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + SAMPLE_TOKEN_ADDRESS,
            "api/v1/contracts/" + SAMPLE_TOKEN_ADDRESS,
            "api/v1/tokens/" + SAMPLE_TOKEN.token_id,
        ])
        mock.restore()
    })

    //
    // Topic
    //

    test("topic", async () => {

        const mock = makeMockAdapter(axios)
        const r = new SearchRequest(SAMPLE_TOPIC.topic_id, TEST_NETWORK)
        await r.run()

        expect(r.searchedId).toBe(SAMPLE_TOPIC.topic_id)
        expect(r.network).toBe(TEST_NETWORK)
        expect(r.account).toBeNull()
        expect(r.accountsWithKey).toStrictEqual([])
        expect(r.transactions).toStrictEqual([])
        expect(r.tokenInfo).toBeNull()
        expect(r.topic).toStrictEqual(SAMPLE_TOPIC)
        expect(r.contract).toBeNull()
        expect(r.block).toBeNull()
        expect(r.ethereumAddress).toBeNull()
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + SAMPLE_TOPIC.topic_id,
            "api/v1/contracts/" + SAMPLE_TOPIC.topic_id,
            "api/v1/tokens/" + SAMPLE_TOPIC.topic_id,
            "api/v1/topics/" + SAMPLE_TOPIC.topic_id,
        ])
        mock.restore()
    })

    //
    // Contract
    //

    test("contract", async () => {
        const mock = makeMockAdapter(axios)

        const r = new SearchRequest(SAMPLE_CONTRACT.contract_id, TEST_NETWORK)
        await r.run()

        expect(r.searchedId).toBe(SAMPLE_CONTRACT.contract_id)
        expect(r.network).toBe(TEST_NETWORK)
        expect(r.account).toBeNull()
        expect(r.accountsWithKey).toStrictEqual([])
        expect(r.transactions).toStrictEqual([])
        expect(r.tokenInfo).toBeNull()
        expect(r.topic).toBeNull()
        expect(r.contract).toStrictEqual(SAMPLE_CONTRACT)
        expect(r.block).toBeNull()
        expect(r.ethereumAddress).toBeNull()
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + SAMPLE_CONTRACT.contract_id,
            "api/v1/contracts/" + SAMPLE_CONTRACT.contract_id,
            "api/v1/tokens/" + SAMPLE_CONTRACT.contract_id,
            "api/v1/topics/" + SAMPLE_CONTRACT.contract_id,
        ])
        mock.restore()
    })

    test("contract (with evm address)", async () => {
        const mock = makeMockAdapter(axios)

        const r = new SearchRequest(SAMPLE_CONTRACT.evm_address, TEST_NETWORK)
        await r.run()

        expect(r.searchedId).toBe(SAMPLE_CONTRACT.evm_address)
        expect(r.network).toBe(TEST_NETWORK)
        expect(r.account).toBeNull()
        expect(r.accountsWithKey).toStrictEqual([])
        expect(r.transactions).toStrictEqual([])
        expect(r.tokenInfo).toBeNull()
        expect(r.topic).toBeNull()
        expect(r.contract).toStrictEqual(SAMPLE_CONTRACT)
        expect(r.block).toBeNull()
        expect(r.ethereumAddress).toBe(SAMPLE_CONTRACT.evm_address)
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + SAMPLE_CONTRACT.evm_address.slice(2),
            "api/v1/contracts/" + SAMPLE_CONTRACT.evm_address.slice(2),
            "api/v1/tokens/" + SAMPLE_CONTRACT.contract_id,
        ])
        mock.restore()
    })

    test("unknown id", async () => {
        const mock = makeMockAdapter(axios)

        const UNKNOWN_ID = "1.2.3"
        const r = new SearchRequest(UNKNOWN_ID, TEST_NETWORK)
        await r.run()

        expect(r.searchedId).toBe(UNKNOWN_ID)
        expect(r.network).toBe(TEST_NETWORK)
        expect(r.account).toBeNull()
        expect(r.accountsWithKey).toStrictEqual([])
        expect(r.transactions).toStrictEqual([])
        expect(r.tokenInfo).toBeNull()
        expect(r.topic).toBeNull()
        expect(r.contract).toBeNull()
        expect(r.block).toBeNull()
        expect(r.ethereumAddress).toBeNull()
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + UNKNOWN_ID,
            "api/v1/contracts/" + UNKNOWN_ID,
            "api/v1/tokens/" + UNKNOWN_ID,
            "api/v1/topics/" + UNKNOWN_ID,
        ])
        mock.restore()
    })

    test("unknown account alias and invalid evm address", async () => {
        const mock = makeMockAdapter(axios)

        const r = new SearchRequest(INVALID_EVM_ADDRESS, TEST_NETWORK)
        await r.run()

        expect(r.searchedId).toBe(INVALID_EVM_ADDRESS)
        expect(r.network).toBe(TEST_NETWORK)
        expect(r.account).toBeNull()
        expect(r.accountsWithKey).toStrictEqual([])
        expect(r.transactions).toStrictEqual([])
        expect(r.tokenInfo).toBeNull()
        expect(r.topic).toBeNull()
        expect(r.contract).toBeNull()
        expect(r.block).toBeNull()
        expect(r.ethereumAddress).toBe("0x000000" + INVALID_EVM_ADDRESS)
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/AEBAGBAFAYDQQCIBAIBQIBIGA4EA",
            "api/v1/accounts/" + "000000" + INVALID_EVM_ADDRESS,
            "api/v1/contracts/" + "000000" + INVALID_EVM_ADDRESS,
        ])
        mock.restore()

        const aliasHex2 = "0x" + INVALID_EVM_ADDRESS
        const r2 = new SearchRequest(aliasHex2, TEST_NETWORK)
        await r2.run()

        expect(r2.searchedId).toBe(aliasHex2)
        expect(r2.network).toBe(TEST_NETWORK)
        expect(r2.account).toBeNull()
        expect(r2.accountsWithKey).toStrictEqual([])
        expect(r2.transactions).toStrictEqual([])
        expect(r2.tokenInfo).toBeNull()
        expect(r2.topic).toBeNull()
        expect(r2.contract).toBeNull()
        expect(r.block).toBeNull()
        expect(r.ethereumAddress).toBe("0x000000" + INVALID_EVM_ADDRESS)
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/AEBAGBAFAYDQQCIBAIBQIBIGA4EA",
            "api/v1/accounts/" + "000000" + INVALID_EVM_ADDRESS,
            "api/v1/contracts/" + "000000" + INVALID_EVM_ADDRESS,
        ])

        mock.restore()
    })

    test("invalid id", async () => {
        const mock = makeMockAdapter(axios)

        const INVAlID_ID = "a.b.c"
        const r = new SearchRequest(INVAlID_ID, TEST_NETWORK)
        await r.run()

        expect(r.searchedId).toBe(INVAlID_ID)
        expect(r.network).toBe(TEST_NETWORK)
        expect(r.account).toBeNull()
        expect(r.accountsWithKey).toStrictEqual([])
        expect(r.transactions).toStrictEqual([])
        expect(r.tokenInfo).toBeNull()
        expect(r.topic).toBeNull()
        expect(r.contract).toBeNull()
        expect(r.block).toBeNull()
        expect(r.ethereumAddress).toBeNull()
        expect(r.getErrorCount()).toBe(0)

        expect(fetchGetURLs(mock)).toStrictEqual([])

        mock.restore()
    }, 50 * 1000)

})

const SAMPLE_ACCOUNT_ADDRESS = EntityID.parse(SAMPLE_ACCOUNT.account)!.toAddress()
const EVM_HASH = SAMPLE_CONTRACT_RESULT_DETAILS.hash.slice(2) // To remove 0x
const TRANSACTION_HASH = byteToHex(base64DecToArr(SAMPLE_TRANSACTION.transaction_hash))
const BLOCK_HASH = byteToHex(hexToByte(SAMPLE_BLOCKSRESPONSE.blocks[0].hash) ?? new Uint8Array(0))
const BLOCK_HASH_PREFIX = byteToHex(hexToByte(SAMPLE_BLOCKSRESPONSE.blocks[0].hash)?.slice(0, 32) ?? new Uint8Array(0))
const SAMPLE_TOKEN_ADDRESS = EntityID.parse(SAMPLE_TOKEN.token_id)!.toAddress()
const INVALID_EVM_ADDRESS = "0102030405060708090102030405060708"; // 19 bytes : should be 20


function makeMockAdapter(axiosInstance: AxiosInstance): MockAdapter {

    const mock = new MockAdapter(axiosInstance)

// Account

    const matcher_account = "/api/v1/accounts/" + SAMPLE_ACCOUNT.account
    mock.onGet(matcher_account).reply(200, SAMPLE_ACCOUNT)

    const matcher_account_with_alias = "/api/v1/accounts/" + SAMPLE_ACCOUNT.alias
    mock.onGet(matcher_account_with_alias).reply(200, SAMPLE_ACCOUNT)

    const matcher_account_with_address = "/api/v1/accounts/" + SAMPLE_ACCOUNT_ADDRESS
    mock.onGet(matcher_account_with_address).reply(200, SAMPLE_ACCOUNT)

    const matcher_account_with_public_key = "/api/v1/accounts/?account.publickey="
        + SAMPLE_ACCOUNTS.accounts[0].key.key + "&limit=2"
    mock.onGet(matcher_account_with_public_key).reply(200, SAMPLE_ACCOUNTS)


// Transaction

    const matcher_transaction = "/api/v1/transactions/" + SAMPLE_TRANSACTION.transaction_id
    mock.onGet(matcher_transaction).reply(200, SAMPLE_TRANSACTIONS)

    const matcher_transaction_with_hash = "/api/v1/transactions/" + TRANSACTION_HASH
    mock.onGet(matcher_transaction_with_hash).reply(200, SAMPLE_TRANSACTIONS)

    const matcher_contract_result = "/api/v1/contracts/results/" + EVM_HASH
    mock.onGet(matcher_contract_result).reply(200, SAMPLE_CONTRACT_RESULT_DETAILS)

    const matcher_transaction_with_timestamp = "/api/v1/transactions?timestamp=" + SAMPLE_CONTRACT_RESULT_DETAILS.timestamp
    mock.onGet(matcher_transaction_with_timestamp).reply(200, SAMPLE_TRANSACTIONS)

// Block

    const matcher_block_with_hash = "/api/v1/blocks/" + BLOCK_HASH
    mock.onGet(matcher_block_with_hash).reply(200, SAMPLE_BLOCKSRESPONSE.blocks[0])
    const matcher_block_with_hash_prefix = "/api/v1/blocks/" + BLOCK_HASH_PREFIX
    mock.onGet(matcher_block_with_hash_prefix).reply(200, SAMPLE_BLOCKSRESPONSE.blocks[0])

// Token

    const matcher_token = "/api/v1/tokens/" + SAMPLE_TOKEN.token_id
    mock.onGet(matcher_token).reply(200, SAMPLE_TOKEN)

// Topic
    const matcher_topic = "/api/v1/topics/" + SAMPLE_TOPIC.topic_id
    mock.onGet(matcher_topic).reply(200, SAMPLE_TOPIC)

// Contract
    const matcher_contracts = "/api/v1/contracts/" + SAMPLE_CONTRACT.contract_id
    mock.onGet(matcher_contracts).reply(200, SAMPLE_CONTRACT)

    const matcher_contracts_with_evm_address = "/api/v1/contracts/" + SAMPLE_CONTRACT.evm_address.slice(2)
    mock.onGet(matcher_contracts_with_evm_address).reply(200, SAMPLE_CONTRACT)

    const matcher_contracts_with_invalid_evm_address = "/api/v1/contracts/" + INVALID_EVM_ADDRESS
    mock.onGet(matcher_contracts_with_invalid_evm_address).reply(400)

    return mock
}
