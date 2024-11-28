import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { formatDate } from "../utils/formatDate"
import { translate } from "../i18n"

interface Enclosure {
  id: string
  brand: string
  model: string
  store: string
  price: number
  purchaseDate: Date
  rating: Object
  userId: string
  images: Array<string>
}

/**
 * This represents an Purchase of React Native Radio.
 */
export const PurchaseModel = types
  .model("Purchase")
  .props({
    id: types.identifier,
    brand: "",
    purchaseDate: new Date(), // Ex: 2022-08-12 21:05:36
    model: "",
    store: "",
    price: 0,
    rating: types.model({
      stars: types.optional(types.number, 0), // Default stars: 0
      reviews: types.optional(types.number, 0), // Default reviews: 0
    }),
    userId: "",
    images: types.optional(types.array(types.string), []),
  })
  .actions(withSetPropAction)
  .views((Purchase) => ({
    get parsedTitleAndSubtitle() {
      const defaultValue = { title: Purchase.brand?.trim(), subtitle: "" }

      if (!defaultValue.title) return defaultValue

      const titleMatches = defaultValue.title.match(/^(RNR.*\d)(?: - )(.*$)/)

      if (!titleMatches || titleMatches.length !== 3) return defaultValue

      return { title: titleMatches[1], subtitle: titleMatches[2] }
    },
    get datePublished() {
      try {
        const formatted = formatDate(Purchase.purchaseDate)
        return {
          textLabel: formatted,
          accessibilityLabel: translate("demoPodcastListScreen.accessibility.publishLabel", {
            date: formatted,
          }),
        }
      } catch (error) {
        return { textLabel: "", accessibilityLabel: "" }
      }
    },
  }))

export interface Purchase extends Instance<typeof PurchaseModel> {}
export interface PurchaseSnapshotOut extends SnapshotOut<typeof PurchaseModel> {}
export interface PurchaseSnapshotIn extends SnapshotIn<typeof PurchaseModel> {}