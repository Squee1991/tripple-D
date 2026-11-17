export default defineEventHandler((event) => {
    const cacheVersion = 'cache-cleared-v1'
    const hasCleared = getCookie(event, cacheVersion)
    if (!hasCleared) {
        setHeader(event, 'Clear-Site-Data', '"cache"')
        setCookie(event, cacheVersion, 'true', { maxAge: 31536000 })
    }
})