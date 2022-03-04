/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AddressInfo {
  /** @format uint256 */
  balance: string

  /** @format uint256 */
  lockedBalance: string
  txNumber: number
}

export interface BadRequest {
  detail: string
}

export interface ExplorerInfo {
  releaseVersion: string
  commit: string
}

export interface Hashrate {
  /** @format int64 */
  timestamp: number
  value: string
}

export interface Input {
  outputRef: Ref
  unlockScript?: string
  txHashRef: string
  address: string

  /** @format uint256 */
  amount: string
}

export interface InternalServerError {
  detail: string
}

export interface ListBlocks {
  total: number
  blocks?: Lite[]
}

export interface Lite {
  hash: string

  /** @format int64 */
  timestamp: number
  chainFrom: number
  chainTo: number
  height: number
  txNumber: number
  mainChain: boolean

  /** @format bigint */
  hashRate: string
}

export interface NotFound {
  detail: string
  resource: string
}

export interface Output {
  hint: number
  key: string

  /** @format uint256 */
  amount: string
  address: string

  /** @format int64 */
  lockTime?: number
  spent?: string
}

export interface PerChainValue {
  chainFrom: number
  chainTo: number
  value: number
}

export interface Ref {
  hint: number
  key: string
}

export interface ServiceUnavailable {
  detail: string
}

export interface TokenSupply {
  /** @format int64 */
  timestamp: number

  /** @format uint256 */
  total: string

  /** @format uint256 */
  circulating: string

  /** @format uint256 */
  maximum: string
}

export interface Transaction {
  hash: string
  blockHash: string

  /** @format int64 */
  timestamp: number
  inputs?: Input[]
  outputs?: Output[]
  gasAmount: number

  /** @format uint256 */
  gasPrice: string
}

export type TransactionLike = Transaction | UnconfirmedTx

export interface UInput {
  outputRef: Ref
  unlockScript?: string
}

export interface UOutput {
  /** @format uint256 */
  amount: string
  address: string

  /** @format int64 */
  lockTime?: number
}

export interface Unauthorized {
  detail: string
}

export interface UnconfirmedTx {
  hash: string
  chainFrom: number
  chainTo: number
  inputs?: UInput[]
  outputs?: UOutput[]
  gasAmount: number

  /** @format uint256 */
  gasPrice: string
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, ResponseType } from 'axios'

export type QueryParamsType = Record<string | number, any>

export interface FullRequestParams extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType
  /** request body */
  body?: unknown
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void
  secure?: boolean
  format?: ResponseType
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded'
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private secure?: boolean
  private format?: ResponseType

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '' })
    this.secure = secure
    this.format = format
    this.securityWorker = securityWorker
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  private mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.instance.defaults.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {})
      }
    }
  }

  private createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key]
      formData.append(
        key,
        property instanceof Blob
          ? property
          : typeof property === 'object' && property !== null
          ? JSON.stringify(property)
          : `${property}`
      )
      return formData
    }, new FormData())
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const responseFormat = (format && this.format) || void 0

    if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
      requestParams.headers.common = { Accept: '*/*' }
      requestParams.headers.post = {}
      requestParams.headers.put = {}

      body = this.createFormData(body as Record<string, unknown>)
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
        ...(requestParams.headers || {})
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path
    })
  }
}

/**
 * @title Alephium Explorer API
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  blocks = {
    /**
     * @description List blocks within time interval
     *
     * @tags Blocks
     * @name GetBlocks
     * @request GET:/blocks
     */
    getBlocks: (query?: { page?: number; limit?: number; reverse?: boolean }, params: RequestParams = {}) =>
      this.request<ListBlocks, BadRequest | Unauthorized | NotFound | InternalServerError | ServiceUnavailable>({
        path: `/blocks`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params
      }),

    /**
     * @description Get a block with hash
     *
     * @tags Blocks
     * @name GetBlocksBlockHash
     * @request GET:/blocks/{block-hash}
     */
    getBlocksBlockHash: (blockHash: string, params: RequestParams = {}) =>
      this.request<Lite, BadRequest | Unauthorized | NotFound | InternalServerError | ServiceUnavailable>({
        path: `/blocks/${blockHash}`,
        method: 'GET',
        format: 'json',
        ...params
      }),

    /**
     * @description Get block's transactions
     *
     * @tags Blocks
     * @name GetBlocksBlockHashTransactions
     * @request GET:/blocks/{block-hash}/transactions
     */
    getBlocksBlockHashTransactions: (
      blockHash: string,
      query?: { page?: number; limit?: number; reverse?: boolean },
      params: RequestParams = {}
    ) =>
      this.request<Transaction[], BadRequest | Unauthorized | NotFound | InternalServerError | ServiceUnavailable>({
        path: `/blocks/${blockHash}/transactions`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params
      })
  }
  transactions = {
    /**
     * @description Get a transaction with hash
     *
     * @tags Transactions
     * @name GetTransactionsTransactionHash
     * @request GET:/transactions/{transaction-hash}
     */
    getTransactionsTransactionHash: (transactionHash: string, params: RequestParams = {}) =>
      this.request<TransactionLike, BadRequest | Unauthorized | NotFound | InternalServerError | ServiceUnavailable>({
        path: `/transactions/${transactionHash}`,
        method: 'GET',
        format: 'json',
        ...params
      })
  }
  addresses = {
    /**
     * @description Get address informations
     *
     * @tags Addressess
     * @name GetAddressesAddress
     * @request GET:/addresses/{address}
     */
    getAddressesAddress: (address: string, params: RequestParams = {}) =>
      this.request<AddressInfo, BadRequest | Unauthorized | NotFound | InternalServerError | ServiceUnavailable>({
        path: `/addresses/${address}`,
        method: 'GET',
        format: 'json',
        ...params
      }),

    /**
     * @description List transactions of a given address
     *
     * @tags Addressess
     * @name GetAddressesAddressTransactions
     * @request GET:/addresses/{address}/transactions
     */
    getAddressesAddressTransactions: (
      address: string,
      query?: { page?: number; limit?: number; reverse?: boolean },
      params: RequestParams = {}
    ) =>
      this.request<Transaction[], BadRequest | Unauthorized | NotFound | InternalServerError | ServiceUnavailable>({
        path: `/addresses/${address}/transactions`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params
      })
  }
  infos = {
    /**
     * @description Get explorer informations
     *
     * @tags Infos
     * @name GetInfos
     * @request GET:/infos
     */
    getInfos: (params: RequestParams = {}) =>
      this.request<ExplorerInfo, BadRequest | Unauthorized | NotFound | InternalServerError | ServiceUnavailable>({
        path: `/infos`,
        method: 'GET',
        format: 'json',
        ...params
      }),

    /**
     * @description List latest height for each chain
     *
     * @tags Infos
     * @name GetInfosHeights
     * @request GET:/infos/heights
     */
    getInfosHeights: (params: RequestParams = {}) =>
      this.request<PerChainValue[], BadRequest | Unauthorized | NotFound | InternalServerError | ServiceUnavailable>({
        path: `/infos/heights`,
        method: 'GET',
        format: 'json',
        ...params
      }),

    /**
     * @description Get token supply list
     *
     * @tags Infos
     * @name GetInfosSupply
     * @request GET:/infos/supply
     */
    getInfosSupply: (query?: { page?: number; limit?: number; reverse?: boolean }, params: RequestParams = {}) =>
      this.request<TokenSupply[], BadRequest | Unauthorized | NotFound | InternalServerError | ServiceUnavailable>({
        path: `/infos/supply`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params
      }),

    /**
     * @description Get the ALPH total supply
     *
     * @tags Infos
     * @name GetInfosSupplyTotalAlph
     * @request GET:/infos/supply/total-alph
     */
    getInfosSupplyTotalAlph: (params: RequestParams = {}) =>
      this.request<string, BadRequest | Unauthorized | NotFound | InternalServerError | ServiceUnavailable>({
        path: `/infos/supply/total-alph`,
        method: 'GET',
        ...params
      }),

    /**
     * @description Get the ALPH circulating supply
     *
     * @tags Infos
     * @name GetInfosSupplyCirculatingAlph
     * @request GET:/infos/supply/circulating-alph
     */
    getInfosSupplyCirculatingAlph: (params: RequestParams = {}) =>
      this.request<string, BadRequest | Unauthorized | NotFound | InternalServerError | ServiceUnavailable>({
        path: `/infos/supply/circulating-alph`,
        method: 'GET',
        ...params
      })
  }
  charts = {
    /**
     * @description `interval` query param: 0 = 10 minutes, 1 = hourly, 2 = daily
     *
     * @tags Charts
     * @name GetChartsHashrates
     * @summary Get explorer informations.
     * @request GET:/charts/hashrates
     */
    getChartsHashrates: (query: { fromTs: number; toTs: number; interval: number }, params: RequestParams = {}) =>
      this.request<Hashrate[], BadRequest | Unauthorized | NotFound | InternalServerError | ServiceUnavailable>({
        path: `/charts/hashrates`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params
      })
  }
  utils = {
    /**
     * @description Perform a sanity check
     *
     * @tags Utils
     * @name PutUtilsSanityCheck
     * @request PUT:/utils/sanity-check
     */
    putUtilsSanityCheck: (params: RequestParams = {}) =>
      this.request<void, BadRequest | Unauthorized | NotFound | InternalServerError | ServiceUnavailable>({
        path: `/utils/sanity-check`,
        method: 'PUT',
        ...params
      })
  }
}
