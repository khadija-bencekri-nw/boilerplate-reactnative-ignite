import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { SignUpStoreModel } from "./SignUpStore"
import { AuthenticationStoreModel } from "./AuthenticationStore"
import { PurchaseStoreModel } from "./PurchaseStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  signUpStore: types.optional(SignUpStoreModel, {} as any),
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  purchaseStore: types.optional(PurchaseStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
