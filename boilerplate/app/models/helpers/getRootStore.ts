import type { RootStore, RootStoreModel } from "../RootStore"

import type { IStateTreeNode } from "mobx-state-tree"
import { getRoot } from "mobx-state-tree"

/**
 * Returns a RootStore object in strongly typed way
 * for stores to access other stores.
 * @param {IStateTreeNode} self - The store instance.
 * @returns {RootStore} - The RootStore instance.
 */
export const getRootStore = (self: IStateTreeNode): RootStore => {
  return getRoot<typeof RootStoreModel>(self)
}
