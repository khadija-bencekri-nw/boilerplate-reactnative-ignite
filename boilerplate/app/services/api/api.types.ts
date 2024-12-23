/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export interface PurchaseItem {
  id: string
  brand: string
  store: string
  price: number
  purchaseDate: Date
  rating: number
  model: string
  userId: string
  images: string[]
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  position: string
  employmentDate: Date
  shouldReceiveMailNotifications: boolean
  shouldReceiveApprovalNotifications: boolean
  balance: number
  purchasesTotal: number
}

export interface Brand {
  id: number
  name: string
  description: string
  logoUrl: string
}

export interface Store {
  id: number
  name: string
  address: string
  city: string
  websiteUrl: string
}

export interface FormData {
  brands: Brand[]
  stores: Store[]
}

export interface ApiSaveResponse {
  status: string
  item: PurchaseItem
}

export interface ApiGetPurchaseResponse {
  status: string
  items: PurchaseItem[]
}

/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
