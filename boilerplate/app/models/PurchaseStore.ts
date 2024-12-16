import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { api } from "../services/api"
import { PurchaseModel } from "./Purchase"

/**
 * Model description here for TypeScript hints.
 */
export const PurchaseStoreModel = types
  .model("PurchaseStore")
  .props({
    purchases: types.array(PurchaseModel),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchPurchases() {
      const response = await api.getPurchases()
      if (response.kind === "ok") {
        store.setProp("purchases", response.purchases)
      } else {
        console.error(`Error fetching episodes: ${JSON.stringify(response)}`)
      }
    }
  }))
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface PurchaseStore extends Instance<typeof PurchaseStoreModel> {}
export interface PurchaseStoreSnapshotOut extends SnapshotOut<typeof PurchaseStoreModel> {}
export interface PurchaseStoreSnapshotIn extends SnapshotIn<typeof PurchaseStoreModel> {}
export const createPurchaseStoreDefaultModel = () => types.optional(PurchaseStoreModel, {})