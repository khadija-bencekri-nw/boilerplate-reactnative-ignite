import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { PurchaseStoreModel } from "./PurchaseStore"
import { SignUpStoreModel } from "./SignUpStore"
import { AuthenticationStoreModel } from "./AuthenticationStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  purchaseStore: types.optional(PurchaseStoreModel, {} as any),
  signUpStore: types.optional(SignUpStoreModel, {} as any),
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
