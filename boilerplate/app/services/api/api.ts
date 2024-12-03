/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/Services.md)
 * documentation for more details.
 */
import {
  ApiResponse, 
  ApisauceInstance,
  create,
} from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem" 
import type {
  ApiConfig,
  ApiFeedResponse,
  User, 
} from "./api.types"
import type { EpisodeSnapshotIn } from "../../models/Episode" 
import { Purchase, PurchaseSnapshotIn } from "app/models/Purchase"
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
        "Content-Type": "application/json"
      },
    })

    // Add a request transform to inject the token dynamically
    this.apisauce.addAsyncRequestTransform(async (request) => {
      const token = await load("token"); 
      if (token) {
        request.headers.Authorization = token; // Inject the token
      }
    });
  }

  async login(email: string, password: string): Promise<{ kind: "ok"; authToken: string, user: object } | GeneralApiProblem> {
    this.apisauce.addRequestTransform((request) => {
      request.headers = request.headers || {};
      request.headers["Content-Type"] = "application/json";
    })
    const response: ApiResponse<{ token: string , user: object}> = await this.apisauce.post("auth/login", { email, password });
    if (!response.ok) {
      return getGeneralApiProblem(response);
    }

    const token  = response?.headers?.authorization;
    return { kind: "ok", authToken: token };
  }

  async signUp(data: { name: string; email: string; password: string; role: string; joiningDate: Date; amount: string }): Promise<{ kind: "ok"; message: string } | GeneralApiProblem> {
    
    const response: ApiResponse<{ message: string }> = await this.apisauce.post("auth/signup", data);
    
    if (!response.ok) {
      return getGeneralApiProblem(response);
    }
  
    return { kind: "ok", message: response.data ? response.data.message : ""};
  }

  async getUser(): Promise<{ kind: "ok"; user: User} | GeneralApiProblem> {
    
    const response: ApiResponse<{ user: User }> = await this.apisauce.get("users/iiiiii");
    
    if (!response.ok) {
      return getGeneralApiProblem(response);
    }
  
    return { kind: "ok", user: response.data};
  }

  async getPurchases(id: string): Promise<{ kind: "ok"; purchases: PurchaseSnapshotIn[] } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get("purchases", {"userId": id})

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
      response?.data.map((raw) => ({
          ...raw,
          images: Array.isArray(raw.images) && raw.images.length > 0 ? raw.images : [], // Ensure images is always an array
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
