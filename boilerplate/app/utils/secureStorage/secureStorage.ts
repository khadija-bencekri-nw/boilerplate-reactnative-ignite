import * as SecureStore from "expo-secure-store"

/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export async function loadString(key: string): Promise<string | null> {
  try {
    const value = await SecureStore.getItemAsync(key)
    return value ?? null // Return value or null if it doesn't exist
  } catch (error) {
    console.error("Error loading string from secure storage:", error)
    return null
  }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export async function saveString(key: string, value: string): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(key, value)
    return true
  } catch (error) {
    console.error("Error saving string to secure storage:", error)
    return false
  }
}

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export async function load(key: string): Promise<unknown | null> {
  try {
    const value = await SecureStore.getItemAsync(key)
    // return value ? JSON.parse(value) : null;
    return value
  } catch (error) {
    console.error("Error loading JSON from secure storage:", error)
    return null
  }
}

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export async function save(key: string, value: unknown): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error("Error saving JSON to secure storage:", error)
    return false
  }
}

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export async function remove(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key)
  } catch (error) {
    console.error("Error removing item from secure storage:", error)
  }
}

/**
 * Burn it all to the ground.
 */
export async function clear(keys: string[]): Promise<void> {
  try {
    await Promise.all(keys.map(async (key) => SecureStore.deleteItemAsync(key)))
  } catch (error) {
    console.error("Error clearing secure storage:", error)
  }
}
