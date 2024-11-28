import { PurchaseStoreModel } from "./PurchaseStore"

test("can be created", () => {
  const instance = PurchaseStoreModel.create({})

  expect(instance).toBeTruthy()
})
