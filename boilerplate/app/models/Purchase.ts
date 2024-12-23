import { translate } from "../i18n"

import { withSetPropAction } from "./helpers/withSetPropAction"

import type { Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree"
import { types } from "mobx-state-tree"

/**
 * This represents an Purchase of React Native Radio.
 */
export const PurchaseModel = types
  .model("Purchase")
  .props({
    id: types.identifier,
    brand: "",
    store: "",
    price: 0,
    purchaseDate: new Date(), // Ex: 2022-08-12 21:05:36
    rating: 0,
    model: "",
    userId: "",
    images: types.optional(types.array(types.string), []),
  })
  .actions(withSetPropAction)
  .views((purchase) => ({
    get parsedTitleAndSubtitle() {
      const defaultValue = { title: purchase.brand.trim(), subtitle: "" }

      if (defaultValue.title.length === 0) return defaultValue

      return { title: defaultValue.title, subtitle: defaultValue.title }
    },
    get datePublished() {
      try {
        return {
          textLabel: purchase.purchaseDate,
          accessibilityLabel: translate("productScreen.purchaseDate", {
            date: purchase.purchaseDate,
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
