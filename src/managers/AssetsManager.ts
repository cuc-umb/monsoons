import { Loader } from "three"

export class AssetsLoader {
  loader: Loader
  constructor(loader: Loader) {
    this.loader = loader
  }
  async load<T extends Record<string, string>, TReturn>(assetsObject: T) {
    const assetsURLs = Object.values(assetsObject)
    const assetsKeys = Object.keys(assetsObject)
    const modelsPromises = assetsURLs.map(url => this.loader.loadAsync(url) as Promise<TReturn>)
    const loadedModels = await Promise.allSettled(modelsPromises)
    const loadedAssetsObject: Record<keyof T, TReturn> = {} as Record<keyof T, TReturn>

    assetsKeys.forEach((key, index) => {
      const result = loadedModels[index]
      if (result.status === 'rejected') {
        console.warn(result.reason)
      } else {
        loadedAssetsObject[key as keyof T] = result.value
      }
    })

    return loadedAssetsObject
  }
}