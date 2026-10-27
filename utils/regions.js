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
				id: "stone-reach",
				pathTo: "stone-reach",
				theme: "stone",
				name: "locationNames.stone-reach",
				level: 1,
				desc: "regions.descriptionStoneReach",
				icon: StoneReach
			},
			{
				id: "wind-valley",
				pathTo: "wind-valley",
				theme: "winds",
				name: "locationNames.wind-valley",
				level: 2,
				desc: "regions.descriptionWindValley",
				icon: WindValley
			},
			{
				id: "lake-ruins",
				pathTo: "lake-ruins",
				theme: "ruins",
				name: "locationNames.lake-ruins",
				level: 3,
				desc: "regions.descriptionLakeRuins",
				icon: LakeRuins
			},
			{
				id: "north-cliffs",
				pathTo: "north-cliffs",
				theme: "north",
				name: "locationNames.north-cliffs",
				level: 4,
				desc: "regions.descriptionNorthCliffs",
				icon: NorthCliffs
			},
			{
				id: "storm-coast",
				pathTo: "storm-coast",
				theme: "storm",
				name: "locationNames.storm-coast",
				level: 5,
				desc: "regions.descriptionStormCoast",
				icon: StormCoast
			},
			{
				id: "master-lands",
				pathTo: "master-lands",
				theme: "master",
				name: "locationNames.master-lands",
				level: 6,
				desc: "regions.descriptionMasterLands",
				icon: MasterLands
			},
			{
				id: "wild-lands",
				pathTo: "wild-lands",
				theme: "wild",
				name: "locationNames.wild-lands",
				level: 7,
				desc: "regions.descriptionWildLands",
				icon: WildLand
			}
		],
		elementary: [
			{
				id: "future-land",
				pathTo: "future-land",
				theme: "future",
				name: "locationNames.plural-land",
				level: 8,
				desc: "regions.descriptionPluralLands",
				icon: Future
			},
			{
				id: "past-land",
				pathTo: "past-land",
				theme: "past",
				name: "locationNames.past-land",
				level: 9,
				desc: "regions.descriptionPastLands",
				icon: Past
			},
			{
				id: "action-valley",
				pathTo: "action-valley",
				theme: "action",
				name: "locationNames.action-valley",
				level: 10,
				desc: "regions.descriptionActionLands",
				icon: Action
			},
			{
				id: "order-valley",
				pathTo: "order-valley",
				theme: "order",
				name: "locationNames.order-valley",
				level: 11,
				desc: "regions.descriptionOrderValley",
				icon: OrderValley
			},
			{
				id: "time-gate",
				pathTo: "time-gate",
				theme: "time",
				name: "locationNames.time-gate",
				level: 12,
				desc: "regions.descriptionTimeGate",
				icon: TimeGate
			},
			{
				id: "edge-images",
				pathTo: "edge-images",
				theme: "edge",
				name: "locationNames.edge-images",
				level: 13,
				desc: "regions.descriptionEdgeImages",
				icon: EdgeImages
			},
			{
				id: "secret-lands",
				pathTo: "secret-lands",
				theme: "secret",
				name: "locationNames.secret-lands",
				level: 14,
				desc: "regions.descriptionSecretLands",
				icon: SecretLands
			},
			{
				id: "definite-indefinite",
				pathTo: "definite-indefinite",
				theme: "def-indef",
				name: "locationNames.definite-indefinite",
				level: 15,
				desc: "regions.descriptionDefinite",
				icon: MixedLands
			},
		],
	    intermediate: [
			{
				id: "place-prepositions",
				pathTo: "place-prepositions",
				theme: "place-prep",
				name: "locationNames.place-prepositions",
				level: 16,
				desc: "regions.descriptionPlacePrepositions",
				icon: Landmark
			},
			{
				id: "direction-prepositions",
				pathTo: "direction-prepositions",
				theme: "direction-prep",
				name: "locationNames.direction-prepositions",
				level: 17,
				desc: "regions.descriptionDirectionPrepositions",
				icon: Ways
			},
			{
				id: "action-prepositions",
				pathTo: "action-prepositions",
				theme: "action-prep",
				name: "locationNames.action-prepositions",
				level: 18,
				desc: "regions.descriptionActionPrepositions",
				icon: Watch
			},
			{
				id: "past-simple",
				pathTo: "past-simple",
				theme: "past-simple",
				name: "locationNames.past-simple",
				level: 19,
				desc: "regions.descriptionPastSimple",
				icon: Archive
			},
			// {
			// 	id: "requests-land",
			// 	pathTo: "requests-land",
			// 	theme: "requests",
			// 	name: "locationNames.requests-land",
			// 	level: 20,
			// 	desc: "regions.descriptionRequestsLand",
			// 	icon: Action
			// }
		]
	};
