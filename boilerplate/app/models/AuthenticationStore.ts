/* eslint-disable no-param-reassign */
import type { Instance, SnapshotOut } from "mobx-state-tree"
import { types } from "mobx-state-tree"

interface User {
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

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: "",
    user: types.frozen<User>(),
  })
  .views((store) => ({
    get isAuthenticated() {
      return Boolean(store.authToken)
    },
    get validationError() {
      if (store.authEmail.length === 0) return "can't be blank"
      if (store.authEmail.length < 6) return "must be at least 6 characters"
      if (!/^[^\s@]+@theodo\.com$/u.test(store.authEmail))
        return "must be a valid email address: test@theodo.com"
      return ""
    },
  }))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /gu, "")
    },
    setUser(value: User) {
      store.user = value
    },
    getUser() {
      return store.user
    },
    logout() {
      store.authToken = undefined
      store.authEmail = ""
      store.user = null
    },
  }))
export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
