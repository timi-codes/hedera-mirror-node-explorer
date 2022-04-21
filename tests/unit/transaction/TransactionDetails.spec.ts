/*-
 *
 * Hedera Mirror Node Explorer
 *
 * Copyright (C) 2021 - 2022 Hedera Hashgraph, LLC
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

import {flushPromises, mount} from "@vue/test-utils"
import router from "@/router";
import TransactionDetails from "@/pages/TransactionDetails.vue";
import HbarTransferGraphF from "@/components/transfer_graphs/HbarTransferGraphF.vue";
import TokenTransferGraph from "@/components/transfer_graphs/TokenTransferGraphF.vue";
import NftTransferGraph from "@/components/transfer_graphs/NftTransferGraph.vue";
import axios from "axios";
import {SAMPLE_COINGECKO, SAMPLE_CONTRACTCALL_TRANSACTIONS, SAMPLE_TOKEN, SAMPLE_TRANSACTION, SAMPLE_TRANSACTIONS} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import {HMSF} from "@/utils/HMSF";
import {normalizeTransactionId} from "@/utils/TransactionID";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("TransactionDetails.vue", () => {

    it("Should display transaction details with token transfers and fee transfers", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios);

        const matcher1 = "/api/v1/transactions/" + SAMPLE_TRANSACTION.transaction_id
        mock.onGet(matcher1).reply(200, SAMPLE_TRANSACTIONS);

        const matcher2 = "/api/v1/tokens/" + SAMPLE_TOKEN.token_id
        mock.onGet(matcher2).reply(200, SAMPLE_TOKEN);

        const matcher3 = "https://api.coingecko.com/api/v3/coins/hedera-hashgraph"
        mock.onGet(matcher3).reply(200, SAMPLE_COINGECKO);

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router]
            },
            props: {
                transactionId: SAMPLE_TRANSACTION.transaction_id
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        expect(wrapper.text()).toMatch(RegExp("^Transaction " + normalizeTransactionId(SAMPLE_TRANSACTION.transaction_id, true)))

        expect(wrapper.get("#transactionType").text()).toBe("CRYPTO TRANSFER")
        expect(wrapper.get("#consensusAt").text()).toBe("5:12:31.6676 AMFeb 28, 2022") // UTC because of HMSF.forceUTC
        expect(wrapper.get("#transactionHash").text()).toBe("a012 9612 32ed 7d28 4283 6e95f7e9 c435 6fdf e2de 0819 9091701a 969c 1d1f d936 71d3 078ee83b 28fb 460a 88b4 cbd8 ecd2Copy to Clipboard")
        expect(wrapper.get("#netAmount").text()).toBe("0.00000000$0.0000")
        expect(wrapper.get("#chargedFee").text()).toBe("0.00470065$0.0012")
        expect(wrapper.get("#maxFee").text()).toBe("1.00000000$0.2460")

        expect(wrapper.get("#memo").text()).toBe("None")
        expect(wrapper.get("#operatorAccount").text()).toBe("0.0.29624024")
        expect(wrapper.get("#nodeAccount").text()).toBe("0.0.7Node 4 - Nomura - Tokyo, Japan")
        expect(wrapper.get("#duration").text()).toBe("120 seconds")
        expect(wrapper.get("#entityKV").text()).toBe("Account ID0.0.29662956")
        expect(wrapper.get("#scheduled").text()).toBe("false")

        expect(wrapper.findComponent(HbarTransferGraphF).exists()).toBe(true)
        expect(wrapper.findComponent(TokenTransferGraph).exists()).toBe(true)
        expect(wrapper.findComponent(NftTransferGraph).exists()).toBe(true)

        expect(wrapper.findComponent(HbarTransferGraphF).text()).toBe(
            "Fee TransfersAccountHbar AmountAccountHbar Amount0.0.29624024-0.00470065-$0.0012\n\n" +
            "0.0.70.00022028$0.0001Node 4 - Nomura - Tokyo, Japan\n\n" +
            "0.0.980.00448037$0.0011Hedera fee collection account")

        expect(wrapper.findComponent(TokenTransferGraph).text()).toBe(
            "Token TransfersAccountToken AmountAccountToken Amount0.0.29624024-123423\n\n" +
            "0.0.29693911123423Transfer")

        expect(wrapper.findComponent(NftTransferGraph).text()).toBe(
            "")

    });

    it("Should update when transaction id changes", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios);

        let matcher1 = "/api/v1/transactions/" + SAMPLE_TRANSACTION.transaction_id
        mock.onGet(matcher1).reply(200, SAMPLE_TRANSACTIONS);

        const matcher2 = "/api/v1/tokens/" + SAMPLE_TOKEN.token_id
        mock.onGet(matcher2).reply(200, SAMPLE_TOKEN);

        const matcher3 = "https://api.coingecko.com/api/v3/coins/hedera-hashgraph"
        mock.onGet(matcher3).reply(200, SAMPLE_COINGECKO);

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router]
            },
            props: {
                transactionId: SAMPLE_TRANSACTION.transaction_id
            },
        });

        await flushPromises()

        expect(wrapper.text()).toMatch(RegExp("^Transaction " + normalizeTransactionId(SAMPLE_TRANSACTION.transaction_id, true)))
        expect(wrapper.get("#transactionType").text()).toBe("CRYPTO TRANSFER")
        expect(wrapper.get("#memo").text()).toBe("None")

        expect(wrapper.findComponent(HbarTransferGraphF).exists()).toBe(true)
        expect(wrapper.findComponent(TokenTransferGraph).exists()).toBe(true)
        expect(wrapper.findComponent(NftTransferGraph).text()).toBe("")

        const transaction = SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[0]
        matcher1 = "/api/v1/transactions/" + transaction.transaction_id
        mock.onGet(matcher1).reply(200, SAMPLE_CONTRACTCALL_TRANSACTIONS);

        await wrapper.setProps({
            transactionId: transaction.transaction_id
        })
        await flushPromises()
        // console.log(wrapper.text())

        expect(wrapper.text()).toMatch(RegExp("^Transaction " + normalizeTransactionId(transaction.transaction_id, true)))
        expect(wrapper.get("#transactionType").text()).toBe("CONTRACT CALL")
        expect(wrapper.get("#memo").text()).toBe("Mirror Node acceptance test: 2022-03-07T15:09:26.066680977Z Execute contract")

        expect(wrapper.findComponent(HbarTransferGraphF).exists()).toBe(true)
        expect(wrapper.findComponent(TokenTransferGraph).text()).toBe("")
        expect(wrapper.findComponent(NftTransferGraph).text()).toBe("")

    });

});
