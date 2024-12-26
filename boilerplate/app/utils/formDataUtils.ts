import type { DropDownPickerNwRef } from "app/components"
import type { Brand, Store } from "app/services/api/api.types"
import type { MIMEType } from "util"

export const constructFormData = (data: {
  brand: string | null
  model: string
  store: string | null
  price: string
  userId: string
  files: any[] | null
}): FormData => {
  const formData = new FormData()
  formData.append("purchase", JSON.stringify(data))

  data.files?.forEach((file: { uri: string; mimeType: MIMEType }) => {
    const localUri = file.uri
    const filename = localUri.split("/").pop()
    const type = file.mimeType || "image"
    formData.append("files", { uri: localUri, name: filename, type })
  })

  return formData
}

export const getValueFromDropDown = (ref: React.RefObject<DropDownPickerNwRef>): string | null => {
  if (ref.current?.getValue !== undefined) {
    if (ref.current.getValue() !== null) {
      return ref.current.getValue()?.label ?? null
    }
  }
  return null
}

export const transformtpDropDownData = (
  data: Brand[] | Store[] | undefined,
): Array<{ name: string; id: string }> => {
  return data === undefined
    ? []
    : data.map((item) => ({
        name: item.name,
        id: item.id.toString(),
      }))
}
