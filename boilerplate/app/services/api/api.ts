/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/Services.md)
 * documentation for more details.
 */
import {
  ApiResponse, // @demo remove-current-line
  ApisauceInstance,
  create,
} from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem" // @demo remove-current-line
import type {
  ApiConfig,
  ApiFeedResponse, // @demo remove-current-line
} from "./api.types"
import type { EpisodeSnapshotIn } from "../../models/Episode" // @demo remove-current-line
import { PurchaseSnapshotIn } from "app/models/Purchase"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  async login(email: string, password: string): Promise<{ kind: "ok"; authToken: string, user: object } | GeneralApiProblem> {
    const response: ApiResponse<{ token: string , user: object}> = await this.apisauce.post("auth/login", { email, password });
    if (!response.ok) {
      return getGeneralApiProblem(response);
    }
  
    const token  = response?.headers?.authorization;
    return { kind: "ok", authToken: token };
  }

  async signUp(data: { name: string; username: string; password: string; role: string; joiningDate: Date; amount: string }): Promise<{ kind: "ok"; message: string } | GeneralApiProblem> {
    
    const response: ApiResponse<{ message: string }> = await this.apisauce.post("auth/signup", data);
    
    if (!response.ok) {
      return getGeneralApiProblem(response);
    }
  
    return { kind: "ok", message: response.data ? response.data.message : ""};
  }

  async getPurchases(): Promise<{ kind: "ok"; purchases: PurchaseSnapshotIn[] } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get("purchases")

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data

      // This is where we transform the data into the shape we expect for our MST model.
      const purchases: PurchaseSnapshotIn[] =
        rawData?.items.map((raw) => ({
          ...raw,
        })) ?? []

      return { kind: "ok", purchases }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
