import FirstStep from "assets/images/locations-images/FirstStep.png"
import WindValley from "assets/images/locations-images/wind-valley.png"
import NorthCliffs from 'assets/images/locations-images/north-cliffs.png'
import LakeRuins from 'assets/images/locations-images/lake-ruins.png'
import StormCoast from 'assets/images/locations-images/storm-coast.png'
import StoneReach from 'assets/images/locations-images/stone-reach.png'
import MasterLands from 'assets/images/locations-images/master-lands.png'
import WildLand from 'assets/images/locations-images/wild-land.png'
import Future from 'assets/images/locations-images/Future.png'

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
				level: 3,
				desc: "regions.descriptionStoneReach",
				icon: StoneReach
			},
			{
				id: "wind-valley",
				pathTo: "wind-valley",
				theme: "winds",
				name: "locationNames.wind-valley",
				level: 5,
				desc: "regions.descriptionWindValley",
				icon: WindValley
			},
			{
				id: "lake-ruins",
				pathTo: "lake-ruins",
				theme: "ruins",
				name: "locationNames.lake-ruins",
				level: 7,
				desc: "regions.descriptionLakeRuins",
				icon: LakeRuins
			},
			{
				id: "north-cliffs",
				pathTo: "north-cliffs",
				theme: "north",
				name: "locationNames.north-cliffs",
				level: 9,
				desc: "regions.descriptionNorthCliffs",
				icon: NorthCliffs
			},
			{
				id: "storm-coast",
				pathTo: "storm-coast",
				theme: "storm",
				name: "locationNames.storm-coast",
				level: 11,
				desc: "regions.descriptionStormCoast",
				icon: StormCoast
			},
			{
				id: "master-lands",
				pathTo: "master-lands",
				theme: "master",
				name: "locationNames.master-lands",
				level: 13,
				desc: "regions.descriptionMasterLands",
				icon: MasterLands
			},
			{
				id: "wild-lands",
				pathTo: "wild-lands",
				theme: "wild",
				name: "locationNames.wild-lands",
				level: 15,
				desc: "regions.descriptionWildLands",
				icon: WildLand
			}
		],
		intermediate: [
			// {
			// 	id: "plural-land",
			// 	pathTo: "plural-land",
			// 	theme: "plural",
			// 	name: "Перевал Грядущего",
			// 	level: 0,
			// 	desc: "На этом крутом склоне туман прошлого окончательно рассеивается, открывая вид на далекий горизонт. Здесь путник учится не просто смотреть под ноги, а заглядывать в завтрашний день",
			// 	icon: Future
			// }
		]
	};
