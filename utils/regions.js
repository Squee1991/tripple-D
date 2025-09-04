import FirstStep  from "../assets/locations-images/FirstStep.png"
import WindValley  from "../assets/locations-images/wind-valley.png"
import NorthCliffs from '../assets/locations-images/north-cliffs.png'
import LakeRuins from '../assets/locations-images/lake-ruins.png'
import StormCoast from '../assets/locations-images/storm-coast.png'
import StoneReach from '../assets/locations-images/stone-reach.png'

export const regions = [
	{
		id: "east-plain",
		pathTo: "east-plain",
		theme: "plain",                  // ← вместо color
		name: "Восточная Равнина",
		level: 1,
		desc: "Просторные земли, где каждый начинает своё путешествие. Здесь ты освоишь основы языка и получишь первые задания. Именно отсюда начинаются великие приключения.",
		icon: FirstStep
	},
	{
		id: "stone-reach",
		pathTo: "stone-reach",
		theme: "stone",
		name: "Каменный Предел",
		level: 1,
		desc: "Суровый край с каменистыми дорогами и торговыми караванами. Здесь ты укрепишь свои навыки и встретишь первых серьёзных противников на пути к мастерству.",
		icon: StoneReach
	},
	{
		id: "wind-valley",
		pathTo: "wind-valley",
		theme: "winds",
		name: "Долина Ветров",
		level: 1,
		desc: "Земля вечных бурь и переменчивой погоды. Порывы ветра приносят испытания, но вместе с ними и новые знания. Здесь тебя ждут первые настоящие вызовы на пути изучения языка.",
		icon: WindValley
	},
	{
		id: "lake-ruins",
		pathTo: "lake-ruins",
		theme: "ruins",
		name: "Руины Озёрья",
		level: 1,
		desc: "Туман окутывает древние постройки, а воды озёр хранят тайны прошлого. В этих землях скрыты забытые знания, которые помогут тебе углубиться в изучение языка.",
		icon: LakeRuins
	},
	{
		id: "north-cliffs",
		pathTo: "north-cliffs",
		theme: "north",
		name: "Северные Утёсы",
		level: 1,
		desc: "Высокие скалы возвышаются над морем, а холодные ветра испытывают стойкость каждого путника. Тебя ждут сложные задания, требующие упорства и внимательности.",
		icon: NorthCliffs
	},
	{
		id: "storm-coast",
		pathTo: "storm-coast",
		theme: "storm",
		name: "Штормовой Берег",
		level: 1,
		desc: "Дикие прибрежные земли, где бушуют гром и молнии. Лишь смелые герои решаются ступить сюда. Здесь тебя ждут самые суровые испытания и настоящая проверка силы знаний.",
		icon: StormCoast
	}
];
