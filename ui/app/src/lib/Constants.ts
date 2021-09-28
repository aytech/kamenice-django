export const apolloErrorUnauthorized: string = "Unauthorized"
export const csrfTokenName: string = "csrftoken"
export const defaultArrivalHour: number = 14
export const defaultDepartureHour: number = 10
export const dateFormat = "YYYY-MM-DD HH:mm"
export const dateFormatShort = "YYYY-MM-DD"
export const errorMessages = {
  invalidCredentials: "Please enter valid credentials",
  refreshTokenExpired: "Refresh token is expired",
  refreshTokenInvalid: "Invalid refresh token",
  signatureExpired: "Signature has expired",
  unauthorized: "Unauthorized"
}
export const paths = {
  guests: "/guests",
  login: "/login",
  reservation_guests: "/rezervace/:hash/hoste",
  reservations: "/rezervace/:open?",
  root: "/",
  settings: "/settings",
  suites: "/apartma"
}
export const uris = {
  reservations: "/rezervace",
  settings: "/settings"
}
export const refreshTokenName: string = "refreshToken"
export const tokenName: string = "token"
export const usernameKey: string = "username"