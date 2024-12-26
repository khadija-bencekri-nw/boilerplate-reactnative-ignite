/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/Services.md)
 * documentation for more details.
 */
import Config from "../../config"

import type { ApiConfig, ApiSaveResponse, FormDropDownData, PurchaseItem, User } from "./api.types"
import type { GeneralApiProblem } from "./apiProblem"
import { getGeneralApiProblem } from "./apiProblem"

import type { ApiResponse, ApisauceInstance } from "apisauce"
import { create } from "apisauce"
import type { PurchaseSnapshotIn } from "app/models/Purchase"
import { load } from "app/utils/secureStorage"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    })

    // Add a request transform to inject the token dynamically
    this.apisauce.addAsyncRequestTransform(async (request) => {
      const token = await load("token")
      if (token !== undefined && token !== null) {
        const { headers } = request
        if (headers !== undefined) headers.Authorization = token
      }
    })
  }

  async login(loginRequest: {
    mail?: string
    password?: string
    idToken?: string
  }): Promise<GeneralApiProblem | { kind: "ok"; authToken: string }> {
    this.apisauce.addRequestTransform((request) => {
      const { headers } = request
      if (headers !== undefined) {
        headers["Content-Type"] = "application/json"
        headers.Authorization = null
      }
    })
    const response: ApiResponse<{ token: string; user: User }> = await this.apisauce.post(
      "auth/login",
      loginRequest,
    )
    if (!response.ok) {
      return getGeneralApiProblem(response)
    }
    const token = response.headers?.authorization
    return { kind: "ok", authToken: token ?? "" }
  }

  async signUp(data: {
    name: string
    email: string
    password: string
    position: string
    joiningDate: Date
    amount: string
  }): Promise<GeneralApiProblem | { kind: "ok"; message: string }> {
    const response: ApiResponse<{ message: string }> = await this.apisauce.post("auth/signup", data)

    if (!response.ok) {
      return getGeneralApiProblem(response)
    }

    if (response.data !== undefined) {
      return { kind: "ok", message: response.data.message }
    }
    return { kind: "ok", message: "" }
  }

  async getUser(): Promise<GeneralApiProblem | { kind: "ok"; user: User }> {
    const response: ApiResponse<User> = await this.apisauce.get("users/iiiiii")

    if (!response.ok) {
      return getGeneralApiProblem(response)
    }

    if (response.data !== undefined) return { kind: "ok", user: response.data }
    return { kind: "unknown", temporary: true }
  }

  async updateUser(
    id: string,
    request: Partial<{ password: string; mailNotif: boolean; approvalNotif: boolean }>,
  ): Promise<GeneralApiProblem | { kind: "ok"; user: User }> {
    const response: ApiResponse<User> = await this.apisauce.put(`users/${id}`, request)
    if (!response.ok) return getGeneralApiProblem(response)
    if (response.data !== undefined) return { kind: "ok", user: response.data }
    return { kind: "unknown", temporary: true }
  }

  async getPurchases(
    id: string,
  ): Promise<GeneralApiProblem | { kind: "ok"; purchases: PurchaseSnapshotIn[] }> {
    const response: ApiResponse<PurchaseItem[]> = await this.apisauce.get("purchases", {
      userId: id,
    })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      return problem
    }

    let purchases: PurchaseSnapshotIn[]
    try {
      if (response.data === undefined) {
        purchases = []
      } else {
        purchases = response.data.map((raw) => ({
          ...raw,
          images: Array.isArray(raw.images) && raw.images.length > 0 ? raw.images : [],
        }))
      }

      return { kind: "ok", purchases }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async getCoworkerPurchases(
    id: string,
  ): Promise<GeneralApiProblem | { kind: "ok"; purchases: PurchaseSnapshotIn[] }> {
    const response: ApiResponse<PurchaseItem[]> = await this.apisauce.get(
      `purchases/coworker/${id}`,
      { userId: id },
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      return problem
    }

    let purchases: PurchaseSnapshotIn[]
    try {
      if (response.data === undefined) {
        purchases = []
      } else {
        purchases = response.data.map((raw) => ({
          ...raw,
          images: Array.isArray(raw.images) && raw.images.length > 0 ? raw.images : [], // Ensure images is always an array
        }))
      }

      return { kind: "ok", purchases }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  async savePurchase(
    purchaseRequest: FormData,
  ): Promise<GeneralApiProblem | { kind: "ok"; purchase: PurchaseItem }> {
    // make the api call
    this.apisauce.addRequestTransform((request) => {
      request.headers = request.headers ?? {}
      request.headers["Content-Type"] = "multipart/form-data"
    })
    const response: ApiResponse<PurchaseItem> = await this.apisauce.post(
      "purchases",
      purchaseRequest,
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      return problem
    }
    if (response.data !== undefined) {
      return { kind: "ok", purchase: response.data }
    }
    return { kind: "unknown", temporary: true }
  }

  async ratePurchase(
    rating: number,
    id: string,
    comment?: string,
  ): Promise<GeneralApiProblem | { kind: "ok"; purchase: PurchaseItem | undefined }> {
    const request: object = {
      rating,
      comment,
    }

    const response: ApiResponse<ApiSaveResponse> = await this.apisauce.put(
      `purchases/${id}`,
      request,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      return problem
    }

    return { kind: "ok", purchase: response.data?.item }
  }

  async getFormData(): Promise<GeneralApiProblem | { kind: "ok"; data: FormDropDownData }> {
    const response: ApiResponse<FormDropDownData> = await this.apisauce.get("purchases/form-data")

    if (!response.ok || response.data === undefined) {
      return getGeneralApiProblem(response)
    }

    return { kind: "ok", data: response.data }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
