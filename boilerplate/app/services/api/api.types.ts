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
  // rating: { scheme: string; value: string }
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

export interface ApiFeedResponse {
  status: string
  feed: {
    url: string
    title: string
    link: string
    author: string
    description: string
    image: string
  }
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
