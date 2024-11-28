import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { ListFormat } from "typescript";

/**
 * Model description here for TypeScript hints.
 */
export const SignUpStoreModel = types
  .model("SignUpStore")
  .props({
    name: "",
    email: "",
    password: "",
    joiningDate: new Date,
    amount: "",
    role:"",
  })
  .actions((store) => ({
    setName(value: string) {
      store.name = value;
    },
    setEmail(value: string) {
      store.email = value;
    },
    setPassword(value: string) {
      store.password = value;
    },
    setRole(value: string) {
      store.role = value;
    },
    setJoiningDate(value: Date) {
      store.joiningDate = value;
    },
    setAmount(value: string) {
      store.amount = value;
    },
    resetStore() {
      store.name = "";
      store.email = "";
      store.password = "";
      store.role = "";
      store.joiningDate = new Date;
      store.amount = "0";
    },
  }))
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface SignUpStore extends Instance<typeof SignUpStoreModel> {}
export interface SignUpStoreSnapshotOut extends SnapshotOut<typeof SignUpStoreModel> {}
export interface SignUpStoreSnapshotIn extends SnapshotIn<typeof SignUpStoreModel> {}
export const createSignUpStoreDefaultModel = () => types.optional(SignUpStoreModel, {})