import FirstStep  from "assets/images/locations-images/FirstStep.png"
import WindValley  from "assets/images/locations-images/wind-valley.png"
import NorthCliffs from 'assets/images/locations-images/north-cliffs.png'
import LakeRuins from 'assets/images/locations-images/lake-ruins.png'
import StormCoast from 'assets/images/locations-images/storm-coast.png'
import StoneReach from 'assets/images/locations-images/stone-reach.png'
export const regions = [
	{
		id: "east-plain",
		pathTo: "east-plain",
		theme: "plain",
		name: "locationNames.east-plain",
		level: 1,
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
		level: 1,
		desc: "regions.descriptionWindValley",
		icon: WindValley
	},
	{
		id: "lake-ruins",
		pathTo: "lake-ruins",
		theme: "ruins",
		name: "locationNames.lake-ruins",
		level: 1,
		desc: "regions.descriptionLakeRuins",
		icon: LakeRuins
	},
	{
		id: "north-cliffs",
		pathTo: "north-cliffs",
		theme: "north",
		name: "locationNames.north-cliffs",
		level: 1,
		desc: "regions.descriptionNorthCliffs",
		icon: NorthCliffs
	},
	{
		id: "storm-coast",
		pathTo: "storm-coast",
		theme: "storm",
		name: "locationNames.storm-coast",
		level: 1,
		desc: "regions.descriptionStormCoast",
		icon: StormCoast
	}
];
