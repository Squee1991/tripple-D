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
	{
		key: 'explorer',
		title: 'awards.explorer',
		description: 'awards.explorerDescription',
		icon: Globus
	},
	{
		key: 'Articlus',
		title: 'awards.articlus',
		description: 'awards.articlusDescription',
		icon: WasteMoney
	},
	{
		key: 'registerAchievement',
		description: 'awards.registerAchievementDescription',
		title: 'awards.registerAchievement',
		icon: IdCard
	},
	{
		key: 'level10',
		title: 'awards.level10',
		description: 'awards.level10Description',
		icon: Wings
	},
	{
		key: 'languageLands50',
		title: 'awards.languageLands50',
		description: 'awards.languageLands50Description',
		icon: Compass
	},
	{
		key: 'OneYearVeteran',
		title: 'awards.oneYearVeteran',
		description: 'awards.oneYearVeteranDescription',
		icon: veteranMedal
	},
	{
		key: 'wrong100Answers',
		title: 'awards.wrong100Answers',
		description: 'awards.wrong100AnswersDescription',
		icon: talismanOfPatience
	},
	{
		key: 'LastChance',
		title: 'awards.lastChance',
		description: 'awards.lastChanceDescription',
		icon: LastChance
	},
	{
		key: 'guessedFastWords',
		title: 'awards.guessedFastWords',
		description: 'awards.guessedFastWordsDescription',
		icon: Rocket
	},
	{
		key: 'guessSixHundred',
		title: 'awards.guessSixHundred',
		description: 'awards.guessSixHundredDescription',
		icon: BookOfWisdom
	},
	{
		key: 'daily',
		title: 'awards.daily',
		description: 'awards.dailyDescription',
		icon: SandGlass
	},
	{
		key: 'guessedSafeWords',
		title: 'awards.guessedSafeWords',
		description: 'awards.guessedSafeWordsDescription',
		icon: Shield
	},
	{
		key: 'all_cases',
		title: 'awards.allCases',
		description: 'awards.allCasesDescription',
		icon: PuzzleAward
	},
	{
		key: 'all_adjectives',
		title: 'awards.allAdjectives',
		description: 'awards.allAdjectivesDescription',
		icon: ColorPalette
	},
	{
		key: 'all_verbs',
		title: 'awards.allVerbs',
		description: 'awards.allVerbsDescription',
		icon: SwordAward
	},
	{
		key: 'FiveHearts',
		title: 'awards.fiveHearts',
		description: 'awards.fiveHeartsDescription',
		icon: HeartAward
	},
	{
		key: 'daily42',
		title: 'awards.daily42',
		description: 'awards.daily42Description',
		icon: Telescope
	},
	{
		key: 'iAmGroot',
		title: 'awards.iAmGroot',
		description: 'awards.iAmGrootDescription',
		icon: Groot
	},
	{
		key: 'santaHat',
		title: 'awards.santaHat',
		description: 'awards.santaHatDescription',
		icon: SantaHat
	},
	{
		key: 'christmasBall',
		title: 'awards.christmasBall',
		description: 'awards.christmasBallDescription',
		icon: ChristmasBall
	},
	{
		key: 'christmasWreath',
		title: 'awards.christmasWreath',
		description: 'awards.christmasWreathDescription',
		icon: ChristmasWreath
	},
	{
		key: 'valentineBear',
		title: 'awards.valentineBear',
		description: 'awards.valentineBearDescription',
		icon: TeddyGift
	},
	{
		key: 'cupidArrow',
		title: 'awards.cupidArrow',
		description: 'awards.cupidArrowDescription',
		icon: CupidArrow
	},
]

export const awardsByKey = Object.fromEntries(AWARDS.map(a => [a.key, a]))

export function getAwardByKey(key) {
	return awardsByKey[key] || null
}
