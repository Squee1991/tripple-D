
const STORAGE_KEY = 'landIntroSeen'
function readSeen() {
    try {
        const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        return Array.isArray(list) ? list : []
    } catch {
        return []
    }
}

export function isLandIntroSeen(regionId) {
    return readSeen().includes(regionId)
}

export function markLandIntroSeen(regionId) {
    const list = readSeen()
    if (list.includes(regionId)) return
    list.push(regionId)
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } catch {}
}
