/* eslint-disable complexity */
import type { ApiResponse } from "apisauce"

export type GeneralApiProblem =
  /**
   * The data we received is not in the expected format.
   */
  | { kind: "bad-data" }
  /**
   * Cannot connect to the server for some reason.
   */
  | { kind: "cannot-connect"; temporary: true }
  /**
   * We don't have access to perform that request. This is 403.
   */
  | { kind: "forbidden" }
  /**
   * Unable to find that resource.  This is a 404.
   */
  | { kind: "not-found" }
  /**
   * All other 4xx series errors.
   */
  | { kind: "rejected" }
  /**
   * The server experienced a problem. Any 5xx error.
   */
  | { kind: "server" }
  /**
   * Times up.
   */
  | { kind: "timeout"; temporary: true }
  /**
   * We're not allowed because we haven't identified ourself. This is 401.
   */
  | { kind: "unauthorized" }
  /**
   * Something truly unexpected happened. Most likely can try again. This is a catch all.
   */
  | { kind: "unknown"; temporary: true }
  /**
   * The user already exists.
   */
  | { kind: "user-already-exists" }

/**
 * Attempts to get a common cause of problems from an api response.
 *
 * @param response The api response.
 */
export function getGeneralApiProblem(response: ApiResponse<any>): GeneralApiProblem {
  switch (response.problem) {
    case "CONNECTION_ERROR":
    case "NETWORK_ERROR":
      return { kind: "cannot-connect", temporary: true }
    case "TIMEOUT_ERROR":
      return { kind: "timeout", temporary: true }
    case "SERVER_ERROR":
      return { kind: "server" }
    case "UNKNOWN_ERROR":
      return { kind: "unknown", temporary: true }
    case "CLIENT_ERROR":
      switch (response.status) {
        case 400:
          return { kind: "bad-data" }
        case 401:
          return { kind: "unauthorized" }
        case 403:
          return { kind: "forbidden" }
        case 404:
          return { kind: "not-found" }
        case 409:
          return { kind: "user-already-exists" }
        default:
          return { kind: "rejected" }
      }
    case "CANCEL_ERROR":
    case null:
      return { kind: "unknown", temporary: true }
    default:
      return { kind: "unknown", temporary: true }
  }
}
