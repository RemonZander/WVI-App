import { getCookie as getCookieFunc, setCookie as setCookieFunc } from 'typescript-cookie'

export function setCookie(name: string, value: string) {
    setCookieFunc(name, value, {expires: 1/24});
}