import { Instance, SnapshotOut, types } from "mobx-state-tree"

interface User {
  id: string
  name: string
  email: string
  role: string
  position: string
  employementDate: Date
  shouldReceiveMailNotifications: boolean
  shouldReceiveApprovalNotifications: boolean
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
      return !!store.authToken
    },
    get validationError() {
      if (store.authEmail.length === 0) return "can't be blank"
      if (store.authEmail.length < 6) return "must be at least 6 characters"
      // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
      //   return "must be a valid email address"
      if(!/^[^\s@]+@theodo\.com$/.test(store.authEmail))
        return "must be a valid email address: test@theodo.com"
      return ""
    },
  }))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, "")
    },
    setUser(value?: User) {
      store.user = value
    },
    logout() {
      store.authToken = undefined
      store.authEmail = ""
      store.user = null
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
