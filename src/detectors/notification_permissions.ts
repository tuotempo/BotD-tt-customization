import { BotKind, BrowserKind, ComponentDict, DetectorResponse, State } from '../types'

export function detectNotificationPermissions({
  notificationPermissions,
  browserKind,
  android,
  userAgent
}: ComponentDict): DetectorResponse {

  if (userAgent.state === State.Success && android.state === State.Success){
    const samsungBrowserUserAgant =  userAgent.value.indexOf("SamsungBrowser") !== -1
    
    if(android.value === true && samsungBrowserUserAgant){
        return false
    }
  }
  if (browserKind.state !== State.Success || browserKind.value !== BrowserKind.Chrome) return false

  if (notificationPermissions.state === State.Success && notificationPermissions.value) {
    return BotKind.HeadlessChrome
  }
}