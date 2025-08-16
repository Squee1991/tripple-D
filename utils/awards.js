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
	{ key: 'Articlus',            title: 'awards.articlus',        icon: WasteMoney },
	{ key: 'registerAchievement', title: 'awards.registerAchievement',        icon: IdCard },
	{ key: 'level10',             title: 'awards.level10',        icon: Wings },
	{ key: 'SiteRegular',         title: 'awards.siteRegular',         icon: veteranMedal },
	{ key: 'wrong100Answers',     title: 'awards.wrong100Answers',       icon: talismanOfPatience },
	{ key: 'LastChance',          title: 'awards.lastChance',           icon: LastChance },
	{ key: 'guessedFastWords',    title: 'awards.guessedFastWords',             icon: Rocket },
	{ key: 'guessSixHundred',     title: 'awards.guessSixHundred',          icon: BookOfWisdom },
	{ key: 'daily',               title: 'awards.daily',  icon: SandGlass },
	{ key: 'guessedSafeWords',    title: 'awards.guessedSafeWords',        icon: Shield },
]

export const awardsByKey = Object.fromEntries(AWARDS.map(a => [a.key, a]))
export function getAwardByKey(key) { return awardsByKey[key] || null }
