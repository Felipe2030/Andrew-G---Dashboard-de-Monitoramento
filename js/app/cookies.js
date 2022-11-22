const setCookies = (name, value, days) => {
    const date = new Date()
    date.setTime(date.getTime() + (days*24*60*60*1000))
    const expires = "expires=" + date.toUTCString()
    document.cookie = name + "=" + value + ";" + expires + ";path=/"
}

const getCookies = (name) => {
    var name = name + "="
    const decodedCookies = decodeURIComponent(document.cookie)
    const cookies = decodedCookies.split(';')
    return cookies.map((cookie) => {
        while(cookie.charAt(0) == ' '){ cookie = cookie.substring(1) }
        if(cookie.indexOf(name) == 0){ return cookie.substring(name.length, cookie.length) }
    })[0]
}

export { setCookies, getCookies }