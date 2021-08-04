import { AppReferrer } from "../Types";

interface IUrlHelper {
  getReferrer: () => AppReferrer
}

export const UrlHelper: IUrlHelper = {
  getReferrer: (): AppReferrer => {
    const urlParts = window.location.search.substring(1).split("=")
    if (urlParts.length >= 2 && urlParts[ 1 ] !== undefined) {
      return urlParts[ 1 ] as AppReferrer
    }
    return "/"
  }
}