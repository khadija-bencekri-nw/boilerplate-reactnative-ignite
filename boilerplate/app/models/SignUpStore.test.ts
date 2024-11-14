import { SignUpStoreModel } from "./SignUpStore"

test("can be created", () => {
  const instance = SignUpStoreModel.create({})

  expect(instance).toBeTruthy()
})
