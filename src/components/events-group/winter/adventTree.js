// Картина, которая собирается из окошек адвент-календаря: ночная ёлка с подарками.
// Рисуется в квадрате 600x600 и показывается с preserveAspectRatio="xMidYMid slice":
// на телефоне (узкая доска) обрезаются бока, на десктопе чуть-чуть верх и низ,
// поэтому всё важное держится в центральной колонке x 140..460 и по высоте 60..560.

export const TREE_VIEWBOX = '0 0 600 600'

const CX = 300
// [вершина, основание, полуширина основания]
const TIERS = [
  [110, 230, 72],
  [168, 320, 100],
  [238, 420, 128],
  [316, 512, 150]
]

const LIGHT_COLORS = ['#ffd45e', '#ff6b6b', '#6bd3ff', '#8dff9a', '#ffa8e2']

const quad = (p0, p1, p2, t) => (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2

// Гирлянды на каждом ярусе и огоньки на них
const GARLANDS = TIERS.map(([apex, base, half], i) => {
  const y = apex + (base - apex) * 0.72
  const w = half * 0.72
  const g = { x1: CX - w, y1: y - 12, cx: CX, cy: y + 24, x2: CX + w, y2: y + 4 }
  const lights = []
  const count = 6 + i * 2
  for (let k = 1; k < count; k++) {
    const t = k / count
    lights.push({
      x: +quad(g.x1, g.cx, g.x2, t).toFixed(1),
      y: +quad(g.y1, g.cy, g.y2, t).toFixed(1),
      color: LIGHT_COLORS[(k + i) % LIGHT_COLORS.length],
      delay: +(((k * 0.37) + i * 0.21) % 1.6).toFixed(2)
    })
  }
  return { ...g, lights }
})

export const TREE_LIGHTS = GARLANDS.flatMap(g => g.lights)

export const TREE_STAR = { x: CX, y: 92, r: 30 }

export const starPoints = (x, y, r) => {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    pts.push(`${(x + rad * Math.cos(a)).toFixed(1)},${(y + rad * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
}

const BAUBLES = [
  [270, 205, '#ff6b6b'], [326, 190, '#6bd3ff'],
  [250, 290, '#ffd45e'], [352, 280, '#ffa8e2'], [300, 262, '#8dff9a'],
  [228, 380, '#6bd3ff'], [372, 372, '#ff6b6b'], [300, 350, '#ffd45e'],
  [204, 470, '#ffa8e2'], [300, 452, '#6bd3ff'], [398, 462, '#ffd45e'], [258, 488, '#ff6b6b'], [346, 492, '#8dff9a']
]

const SKY_STARS = Array.from({ length: 46 }, (_, i) => [
  (i * 131) % 600,
  (i * 89) % 330,
  i % 6 === 0 ? 2.2 : 1.2
])

export function treeSvgMarkup() {
  const tiers = TIERS.map(([apex, base, half], i) => {
    const shade = ['#3d9a5c', '#348a51', '#2c7a47', '#256b3e'][i]
    const snowY = base - 2
    const lumps = []
    for (let x = CX - half + 6; x <= CX + half - 6; x += 14) {
      lumps.push(`<circle cx="${x}" cy="${snowY}" r="5" fill="#ffffff"/>`)
    }
    return `<polygon points="${CX},${apex} ${CX - half},${base} ${CX + half},${base}" fill="${shade}"/>` +
      `<polygon points="${CX},${apex} ${CX - half * 0.18},${apex + (base - apex) * 0.3} ${CX},${apex + (base - apex) * 0.24} ${CX + half * 0.18},${apex + (base - apex) * 0.3}" fill="#ffffff" opacity="0.9"/>` +
      lumps.join('')
  }).reverse().join('')

  const garlands = GARLANDS.map(g =>
    `<path d="M${g.x1},${g.y1} Q${g.cx},${g.cy} ${g.x2},${g.y2}" fill="none" stroke="#f6d27a" stroke-width="3" stroke-linecap="round"/>` +
    g.lights.map(l => `<circle cx="${l.x}" cy="${l.y}" r="5" fill="${l.color}"/>`).join('')
  ).join('')

  const baubles = BAUBLES.map(([x, y, c]) =>
    `<circle cx="${x}" cy="${y}" r="9" fill="${c}"/><circle cx="${x - 3}" cy="${y - 3}" r="3" fill="#ffffff" opacity="0.7"/>`
  ).join('')

  const sky = SKY_STARS.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" opacity="0.85"/>`).join('')

  const gift = (x, y, w, h, box, ribbon) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${box}"/>` +
    `<rect x="${x + w / 2 - 4}" y="${y}" width="8" height="${h}" fill="${ribbon}"/>` +
    `<rect x="${x}" y="${y + h * 0.35}" width="${w}" height="7" fill="${ribbon}"/>` +
    `<circle cx="${x + w / 2 - 6}" cy="${y - 4}" r="6" fill="${ribbon}"/><circle cx="${x + w / 2 + 6}" cy="${y - 4}" r="6" fill="${ribbon}"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${TREE_VIEWBOX}" preserveAspectRatio="xMidYMid slice">` +
    `<defs>` +
    `<radialGradient id="sky" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#2d4f94"/><stop offset="1" stop-color="#0c1a3a"/></radialGradient>` +
    `<radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffe9a3" stop-opacity="0.35"/><stop offset="1" stop-color="#ffe9a3" stop-opacity="0"/></radialGradient>` +
    `</defs>` +
    `<rect width="600" height="600" fill="url(#sky)"/>` +
    sky +
    `<circle cx="${CX}" cy="320" r="250" fill="url(#halo)"/>` +
    `<ellipse cx="${CX}" cy="585" rx="420" ry="80" fill="#dfeaff"/>` +
    `<ellipse cx="${CX}" cy="600" rx="380" ry="70" fill="#ffffff"/>` +
    `<rect x="282" y="505" width="36" height="46" rx="4" fill="#6b4329"/>` +
    tiers + garlands + baubles +
    `<polygon points="${starPoints(TREE_STAR.x, TREE_STAR.y, TREE_STAR.r)}" fill="#ffd45e" stroke="#e0a526" stroke-width="3"/>` +
    gift(186, 520, 52, 40, '#d83a34', '#ffd45e') +
    gift(352, 526, 58, 36, '#3f6db8', '#eef3ff') +
    gift(244, 540, 40, 30, '#e9b42c', '#d83a34') +
    gift(312, 546, 34, 26, '#2f8a4f', '#ff6b6b') +
    `</svg>`
}

export const treeImageUrl = () => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(treeSvgMarkup())
