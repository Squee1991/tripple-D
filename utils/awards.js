import WasteMoney from '~/assets/awards/wasteMoney.svg'
import IdCard from '~/assets/awards/idUser.svg'
import Wings from '~/assets/awards/gold statuette.svg'
import veteranMedal from '~/assets/awards/veteran medal.svg'
import talismanOfPatience from '~/assets/awards/talisman of patience.svg'
import LastChance from '~/assets/awards/last-chance.svg'
import Rocket from '~/assets/awards/Rocket.svg'
import BookOfWisdom from '~/assets/awards/bookOfWisdom.svg'
import SandGlass from '~/assets/awards/sandglass.svg'
import Shield from '~/assets/awards/shield.svg'

export const AWARDS = [
	{ key: 'Articlus',            title: 'Алмаз артиклеуса',        icon: WasteMoney },
	{ key: 'registerAchievement', title: 'Значок участника',        icon: IdCard },
	{ key: 'level10',             title: 'Кубок с крыльями',        icon: Wings },
	{ key: 'SiteRegular',         title: 'Медаль ветерана',         icon: veteranMedal },
	{ key: 'wrong100Answers',     title: 'Талисман терпения',       icon: talismanOfPatience },
	{ key: 'LastChance',          title: 'Тик-тик удачи',           icon: LastChance },
	{ key: 'guessedFastWords',    title: 'Блиц-ракета',             icon: Rocket },
	{ key: 'guessSixHundred',     title: 'Книга мудрости',          icon: BookOfWisdom },
	{ key: 'daily',               title: 'Песочные часы вечности',  icon: SandGlass },
	{ key: 'guessedSafeWords',    title: 'Щит осторожности',        icon: Shield },
]

export const awardsByKey = Object.fromEntries(AWARDS.map(a => [a.key, a]))
export function getAwardByKey(key) { return awardsByKey[key] || null }
