import WasteMoney from '~/assets/awards/wasteMoney.svg'
import IdCard from '~/assets/awards/idUser.svg'
import Wings from '~/assets/awards/Wing.svg'
import veteranMedal from '~/assets/awards/medal.svg'
import talismanOfPatience from '~/assets/awards/talisman of patience.svg'
import LastChance from '~/assets/awards/last-chance.svg'
import Rocket from '~/assets/awards/Rocket.svg'
import BookOfWisdom from '~/assets/awards/bookOfWisdom.svg'
import SandGlass from '~/assets/awards/sandglass.svg'
import Shield from '~/assets/awards/shield.svg'
import Globus from '~/assets/awards/globus.svg'
import Compass from '~/assets/awards/compass.svg'
import ColorPalette from '~/assets/awards/ColorPaletteAward.svg'
import PuzzleAward from '~/assets/awards/puzzleAward.svg'
import SwordAward from '~/assets/awards/SwordAwards.svg'
import HeartAward from '~/assets/awards/heartAward.svg'
import Telescope from '~/assets/awards/telescope.svg'
import Groot from '~/assets/awards/Groot.svg'
import SantaHat from '../assets/images/event-rewards/winter-event/winter-rewards/santa-hat.svg'
import ChristmasBall from '../assets/images/event-rewards/winter-event/winter-rewards/christmas-ball.svg'
import ChristmasWreath from '../assets/images/event-rewards/winter-event/winter-rewards/christmas-wreath.svg'
import TeddyGift from '../assets/images/event-rewards/valentine-event/valentine-rewards/teddy-bear.svg'
import CupidArrow from '../assets/images/event-rewards/valentine-event/valentine-rewards/cupidonArrow.svg'
export const AWARDS = [
	{key: 'explorer', title: 'awards.explorer', icon: Globus},
	{key: 'Articlus', title: 'awards.articlus', icon: WasteMoney},
	{key: 'registerAchievement', title: 'awards.registerAchievement', icon: IdCard},
	{key: 'level10', title: 'awards.level10', icon: Wings},
	{key: 'languageLands50', title: 'awards.languageLands50', icon: Compass},
	{key: 'SiteRegular', title: 'awards.siteRegular', icon: veteranMedal},
	{key: 'wrong100Answers', title: 'awards.wrong100Answers', icon: talismanOfPatience},
	{key: 'LastChance', title: 'awards.lastChance', icon: LastChance},
	{key: 'guessedFastWords', title: 'awards.guessedFastWords', icon: Rocket},
	{key: 'guessSixHundred', title: 'awards.guessSixHundred', icon: BookOfWisdom},
	{key: 'daily', title: 'awards.daily', icon: SandGlass},
	{key: 'guessedSafeWords', title: 'awards.guessedSafeWords', icon: Shield},
	{key: 'all_cases', title: 'awards.allCases', icon: PuzzleAward},
	{key: 'all_adjectives', title: 'awards.allAdjectives', icon: ColorPalette},
	{key: 'all_verbs', title: 'awards.allVerbs', icon: SwordAward},
	{key: 'FiveHearts', title: 'awards.fiveHearts', icon: HeartAward},
	{key: 'daily42', title: 'awards.daily42', icon: Telescope},
	{key: 'iAmGroot', title: 'awards.iAmGroot', icon: Groot},
	{key: 'santaHat' , title: 'awards.santaHat', icon: SantaHat},
	{key: 'christmasBall' , title: 'awards.christmasBall', icon: ChristmasBall},
	{key: 'christmasWreath' , title: 'awards.christmasWreath', icon: ChristmasWreath},
	{key: 'valentineBear' , title: 'Плюшевый мишка', icon: TeddyGift},
	{key: 'cupidArrow' , title: 'Лук купидона', icon: CupidArrow},
]

export const awardsByKey = Object.fromEntries(AWARDS.map(a => [a.key, a]))
export function getAwardByKey(key) {
	return awardsByKey[key] || null
}
