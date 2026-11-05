import FirstStep from "assets/images/locations-images/FirstStep.png"
import WindValley from "assets/images/locations-images/wind-valley.png"
import NorthCliffs from 'assets/images/locations-images/north-cliffs.webp'
import LakeRuins from 'assets/images/locations-images/lake-ruins.png'
import StormCoast from 'assets/images/locations-images/storm-coast.webp'
import StoneReach from 'assets/images/locations-images/stone-reach.png'
import MasterLands from 'assets/images/locations-images/master-lands.webp'
import WildLand from 'assets/images/locations-images/wild-land.webp'
import Future from 'assets/images/locations-images/Future.webp'
import Past from 'assets/images/locations-images/Past.png'
import Action from 'assets/images/locations-images/Action.jpg'
import OrderValley from 'assets/images/locations-images/OrderValley.jpg'
import TimeGate from 'assets/images/locations-images/time_gate.jpg'
import EdgeImages from 'assets/images/locations-images/edgeImages.webp'
import SecretLands from 'assets/images/locations-images/secret-lands.webp'
import MixedLands from 'assets/images/locations-images/mixedArticle.jpg'
import Landmark from 'assets/images/locations-images/landmark.jpg'
import Ways from 'assets/images/locations-images/Ways.jpg'
import Watch from 'assets/images/locations-images/Watch.jpg'
import Archive from 'assets/images/locations-images/Archive.jpg'
import Bridge from 'assets/images/locations-images/bridge.jpg'
import PoliteCity from 'assets/images/locations-images/politeCity.jpg'
import Hills from 'assets/images/locations-images/hills.jpg'
import AdviceGarden from 'assets/images/locations-images/adviceGarden.jpg'
import Summit from 'assets/images/locations-images/summit.jpg'
import StoryValley from 'assets/images/locations-images/storyValley.jpg'
import MemoryLake from 'assets/images/locations-images/memoryLake.jpg'
import PurposePath from 'assets/images/locations-images/purposePath.jpg'
import ConsequenceFork from 'assets/images/locations-images/consequenceFork.jpg'
import NeighborStreet from 'assets/images/locations-images/neighborStreet.jpg'
import CraftValley from 'assets/images/locations-images/craftValley.jpg'
import TaskTower from 'assets/images/locations-images/taskTower.jpg'
import DecisionWorkshop from 'assets/images/locations-images/decisionWorkshop.jpg'
import ExperienceSummit from 'assets/images/locations-images/experienceSummit.jpg'

export const regions = {
		beginner: [
			{
				id: "east-plain",
				pathTo: "east-plain",
				theme: "plain",
				name: "locationNames.east-plain",
				level: 0,
				desc: "regions.descriptionEastPlain",
				icon: FirstStep
			},
			{
				id: "meet-meadow",
				pathTo: "meet-meadow",
				theme: "meadow",
				name: "locationNames.meet-meadow",
				level: 1,
				desc: "regions.descriptionMeetMeadow",
				icon: PoliteCity
			},
			{
				id: "stone-reach",
				pathTo: "stone-reach",
				theme: "stone",
				name: "locationNames.stone-reach",
				level: 2,
				desc: "regions.descriptionStoneReach",
				icon: StoneReach
			},
			{
				id: "question-gorge",
				pathTo: "question-gorge",
				theme: "gorge",
				name: "locationNames.question-gorge",
				level: 3,
				desc: "regions.descriptionQuestionGorge",
				icon: StoneReach
			},
			{
				id: "market-square",
				pathTo: "market-square",
				theme: "market",
				name: "locationNames.market-square",
				level: 4,
				desc: "regions.descriptionMarketSquare",
				icon: Ways
			},
			{
				id: "change-river",
				pathTo: "change-river",
				theme: "river",
				name: "locationNames.change-river",
				level: 5,
				desc: "regions.descriptionChangeRiver",
				icon: Ways
			},
			{
				id: "family-tree",
				pathTo: "family-tree",
				theme: "family",
				name: "locationNames.family-tree",
				level: 6,
				desc: "regions.descriptionFamilyTree",
				icon: Ways
			},
			{
				id: "clock-tower",
				pathTo: "clock-tower",
				theme: "clock",
				name: "locationNames.clock-tower",
				level: 7,
				desc: "regions.descriptionClockTower",
				icon: Watch
			},
			{
				id: "routine-mill",
				pathTo: "routine-mill",
				theme: "pathfinder",
				name: "locationNames.routine-mill",
				level: 8,
				desc: "regions.descriptionRoutineMill",
				icon: Ways
			},
			{
				id: "power-pass",
				pathTo: "power-pass",
				theme: "pathfinder",
				name: "locationNames.power-pass",
				level: 9,
				desc: "regions.descriptionPowerPass",
				icon: Ways
			}
		],
		pathfinder: [
			{
				id: "hearty-inn",
				pathTo: "hearty-inn",
				theme: "pathfinder",
				name: "locationNames.hearty-inn",
				level: 10,
				desc: "regions.descriptionHeartyInn",
				icon: Ways
			},
			{
				id: "dress-bazaar",
				pathTo: "dress-bazaar",
				theme: "pathfinder",
				name: "locationNames.dress-bazaar",
				level: 11,
				desc: "regions.descriptionDressBazaar",
				icon: Ways
			},
			{
				id: "wind-valley",
				pathTo: "wind-valley",
				theme: "winds",
				name: "locationNames.wind-valley",
				level: 12,
				desc: "regions.descriptionWindValley",
				icon: WindValley
			},
			{
				id: "lake-ruins",
				pathTo: "lake-ruins",
				theme: "ruins",
				name: "locationNames.lake-ruins",
				level: 13,
				desc: "regions.descriptionLakeRuins",
				icon: LakeRuins
			},
			{
				id: "north-cliffs",
				pathTo: "north-cliffs",
				theme: "north",
				name: "locationNames.north-cliffs",
				level: 14,
				desc: "regions.descriptionNorthCliffs",
				icon: NorthCliffs
			},
			{
				id: "storm-coast",
				pathTo: "storm-coast",
				theme: "storm",
				name: "locationNames.storm-coast",
				level: 15,
				desc: "regions.descriptionStormCoast",
				icon: StormCoast
			},
			{
				id: "master-lands",
				pathTo: "master-lands",
				theme: "master",
				name: "locationNames.master-lands",
				level: 16,
				desc: "regions.descriptionMasterLands",
				icon: MasterLands
			},
			{
				id: "wild-lands",
				pathTo: "wild-lands",
				theme: "wild",
				name: "locationNames.wild-lands",
				level: 17,
				desc: "regions.descriptionWildLands",
				icon: WildLand
			},
			{
				id: "healer-hut",
				pathTo: "healer-hut",
				theme: "pathfinder",
				name: "locationNames.healer-hut",
				level: 18,
				desc: "regions.descriptionHealerHut",
				icon: Ways
			},
			{
				id: "a1-summit",
				pathTo: "a1-summit",
				theme: "a2-summit",
				name: "locationNames.a1-summit",
				level: 19,
				desc: "regions.descriptionA1Summit",
				icon: Summit
			}
		],
		elementary: [
			{
				id: "past-simple",
				pathTo: "past-simple",
				theme: "past-simple",
				name: "locationNames.past-simple",
				level: 20,
				desc: "regions.descriptionPastSimple",
				icon: Archive
			},
			{
				id: "past-land",
				pathTo: "past-land",
				theme: "past",
				name: "locationNames.past-land",
				level: 21,
				desc: "regions.descriptionPastLands",
				icon: Past
			},
			{
				id: "place-prepositions",
				pathTo: "place-prepositions",
				theme: "place-prep",
				name: "locationNames.place-prepositions",
				level: 22,
				desc: "regions.descriptionPlacePrepositions",
				icon: Landmark
			},
			{
				id: "direction-prepositions",
				pathTo: "direction-prepositions",
				theme: "direction-prep",
				name: "locationNames.direction-prepositions",
				level: 23,
				desc: "regions.descriptionDirectionPrepositions",
				icon: Ways
			},
			{
				id: "action-prepositions",
				pathTo: "action-prepositions",
				theme: "action-prep",
				name: "locationNames.action-prepositions",
				level: 24,
				desc: "regions.descriptionActionPrepositions",
				icon: Watch
			},
			{
				id: "action-valley",
				pathTo: "action-valley",
				theme: "action",
				name: "locationNames.action-valley",
				level: 25,
				desc: "regions.descriptionActionLands",
				icon: Action
			},
			{
				id: "requests-land",
				pathTo: "requests-land",
				theme: "requests",
				name: "locationNames.requests-land",
				level: 26,
				desc: "regions.descriptionRequestsLand",
				icon: PoliteCity
			},
			{
				id: "order-valley",
				pathTo: "order-valley",
				theme: "order",
				name: "locationNames.order-valley",
				level: 27,
				desc: "regions.descriptionOrderValley",
				icon: OrderValley
			},
			{
				id: "calendar-valley",
				pathTo: "calendar-valley",
				theme: "calendar",
				name: "locationNames.calendar-valley",
				level: 28,
				desc: "regions.descriptionCalendarValley",
				icon: Watch
			},
			{
				id: "time-road",
				pathTo: "time-road",
				theme: "time-road",
				name: "locationNames.time-road",
				level: 29,
				desc: "regions.descriptionTimeRoad",
				icon: Ways
			}
		],
		intermediate: [
			{
				id: "comparison-hills",
				pathTo: "comparison-hills",
				theme: "comparison",
				name: "locationNames.comparison-hills",
				level: 30,
				desc: "regions.descriptionComparisonHills",
				icon: Hills
			},
			{
				id: "advice-garden",
				pathTo: "advice-garden",
				theme: "advice",
				name: "locationNames.advice-garden",
				level: 31,
				desc: "regions.descriptionAdviceGarden",
				icon: AdviceGarden
			},
			{
				id: "choice-crossing",
				pathTo: "choice-crossing",
				theme: "choice",
				name: "locationNames.choice-crossing",
				level: 32,
				desc: "regions.descriptionChoiceCrossing",
				icon: Bridge
			},
			{
				id: "nobody-village",
				pathTo: "nobody-village",
				theme: "nobody",
				name: "locationNames.nobody-village",
				level: 33,
				desc: "regions.descriptionNobodyVillage",
				icon: Landmark
			},
			{
				id: "future-land",
				pathTo: "future-land",
				theme: "future",
				name: "locationNames.plural-land",
				level: 34,
				desc: "regions.descriptionPluralLands",
				icon: Future
			},
			{
				id: "edge-images",
				pathTo: "edge-images",
				theme: "edge",
				name: "locationNames.edge-images",
				level: 35,
				desc: "regions.descriptionEdgeImages",
				icon: EdgeImages
			},
			{
				id: "secret-lands",
				pathTo: "secret-lands",
				theme: "secret",
				name: "locationNames.secret-lands",
				level: 36,
				desc: "regions.descriptionSecretLands",
				icon: SecretLands
			},
			{
				id: "definite-indefinite",
				pathTo: "definite-indefinite",
				theme: "def-indef",
				name: "locationNames.definite-indefinite",
				level: 37,
				desc: "regions.descriptionDefinite",
				icon: MixedLands
			},
			{
				id: "time-gate",
				pathTo: "time-gate",
				theme: "time",
				name: "locationNames.time-gate",
				level: 38,
				desc: "regions.descriptionTimeGate",
				icon: TimeGate
			},
			{
				id: "a2-summit",
				pathTo: "a2-summit",
				theme: "a2-summit",
				name: "locationNames.a2-summit",
				level: 39,
				desc: "regions.descriptionA2Summit",
				icon: Summit
			}
		],
		experience: [
			{
				id: "story-valley",
				pathTo: "story-valley",
				theme: "story",
				name: "locationNames.story-valley",
				level: 40,
				desc: "regions.descriptionStoryValley",
				icon: StoryValley
			},
			{
				id: "memory-lake",
				pathTo: "memory-lake",
				theme: "memory",
				name: "locationNames.memory-lake",
				level: 41,
				desc: "regions.descriptionMemoryLake",
				icon: MemoryLake
			},
			{
				id: "reason-bridge",
				pathTo: "reason-bridge",
				theme: "reason",
				name: "locationNames.reason-bridge",
				level: 42,
				desc: "regions.descriptionReasonBridge",
				icon: Bridge
			},
			{
				id: "purpose-path",
				pathTo: "purpose-path",
				theme: "purpose",
				name: "locationNames.purpose-path",
				level: 43,
				desc: "regions.descriptionPurposePath",
				icon: PurposePath
			},
			{
				id: "consequence-fork",
				pathTo: "consequence-fork",
				theme: "consequence",
				name: "locationNames.consequence-fork",
				level: 44,
				desc: "regions.descriptionConsequenceFork",
				icon: ConsequenceFork
			},
			{
				id: "neighbor-street",
				pathTo: "neighbor-street",
				theme: "neighbor",
				name: "locationNames.neighbor-street",
				level: 45,
				desc: "regions.descriptionNeighborStreet",
				icon: NeighborStreet
			},
			{
				id: "craft-valley",
				pathTo: "craft-valley",
				theme: "craft",
				name: "locationNames.craft-valley",
				level: 46,
				desc: "regions.descriptionCraftValley",
				icon: CraftValley
			},
			{
				id: "task-tower",
				pathTo: "task-tower",
				theme: "task",
				name: "locationNames.task-tower",
				level: 47,
				desc: "regions.descriptionTaskTower",
				icon: TaskTower
			},
			{
				id: "decision-workshop",
				pathTo: "decision-workshop",
				theme: "decision",
				name: "locationNames.decision-workshop",
				level: 48,
				desc: "regions.descriptionDecisionWorkshop",
				icon: DecisionWorkshop
			},
			{
				id: "experience-summit",
				pathTo: "experience-summit",
				theme: "experience-summit",
				name: "locationNames.experience-summit",
				level: 49,
				desc: "regions.descriptionExperienceSummit",
				icon: ExperienceSummit
			}
		],
		wisdom: [
			{
				id: "wish-island",
				pathTo: "wish-island",
				theme: "wish",
				name: "locationNames.wish-island",
				level: 50,
				desc: "regions.descriptionWishIsland",
				icon: SecretLands
			},
			{
				id: "regret-river",
				pathTo: "regret-river",
				theme: "regret",
				name: "locationNames.regret-river",
				level: 51,
				desc: "regions.descriptionRegretRiver",
				icon: Future
			},
			{
				id: "owner-castle",
				pathTo: "owner-castle",
				theme: "owner",
				name: "locationNames.owner-castle",
				level: 52,
				desc: "regions.descriptionOwnerCastle",
				icon: Landmark
			},
			{
				id: "hero-square",
				pathTo: "hero-square",
				theme: "hero",
				name: "locationNames.hero-square",
				level: 53,
				desc: "regions.descriptionHeroSquare",
				icon: Landmark
			},
			{
				id: "taste-market",
				pathTo: "taste-market",
				theme: "taste",
				name: "locationNames.taste-market",
				level: 54,
				desc: "regions.descriptionTasteMarket",
				icon: WildLand
			},
			{
				id: "question-bridge",
				pathTo: "question-bridge",
				theme: "question",
				name: "locationNames.question-bridge",
				level: 55,
				desc: "regions.descriptionQuestionBridge",
				icon: Ways
			},
			{
				id: "link-harbor",
				pathTo: "link-harbor",
				theme: "link",
				name: "locationNames.link-harbor",
				level: 56,
				desc: "regions.descriptionLinkHarbor",
				icon: StormCoast
			},
			{
				id: "word-forge",
				pathTo: "word-forge",
				theme: "forge",
				name: "locationNames.word-forge",
				level: 57,
				desc: "regions.descriptionWordForge",
				icon: Archive
			},
			{
				id: "opinion-tower",
				pathTo: "opinion-tower",
				theme: "opinion",
				name: "locationNames.opinion-tower",
				level: 58,
				desc: "regions.descriptionOpinionTower",
				icon: Watch
			},
			{
				id: "wisdom-summit",
				pathTo: "wisdom-summit",
				theme: "wisdom-summit",
				name: "locationNames.wisdom-summit",
				level: 59,
				desc: "regions.descriptionWisdomSummit",
				icon: MasterLands
			}
		]
	};
