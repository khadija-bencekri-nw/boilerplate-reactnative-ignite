import { AuthenticationStoreModel } from "./AuthenticationStore"
import { PurchaseStoreModel } from "./PurchaseStore"
import { SignUpStoreModel } from "./SignUpStore"

import type { Instance, SnapshotOut } from "mobx-state-tree"
import { types } from "mobx-state-tree"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  signUpStore: types.optional(SignUpStoreModel, {}),
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
