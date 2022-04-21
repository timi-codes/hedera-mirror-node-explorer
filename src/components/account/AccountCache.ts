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

import {EntityCache} from "@/utils/EntityCache";
import {AccountsResponse} from "@/schemas/HederaSchemas";
import axios, {AxiosResponse} from "axios";

const DESCENDING = 'desc'

export class AccountCache extends EntityCache<AccountsResponse> {

    private readonly limit: number
    private readonly sorting: string

    //
    // Public
    //

    public constructor() {
        super(5000, 10)
        this.limit = 100
        this.sorting = DESCENDING
    }

    //
    // EntityCache
    //

    protected load(): Promise<AxiosResponse<AccountsResponse>> {

        const params = {} as {
            limit: number
            order: string
        }
        params.limit = this.limit
        params.order = this.sorting

        return axios.get<AccountsResponse>("api/v1/accounts", { params: params} )
    }

}