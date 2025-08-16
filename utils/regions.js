export const regions = [
	{
		id: 'east-plain',
		pathTo: 'east-plain',
		name: 'Восточная Равнина',
		level: 1,
		desc: 'Стартовая зона с базовыми заданиями.',
		path: 'M 0 0 L 380 0 L 360 120 L 420 270 L 200 240 L 0 260 Z',
		fillClass: 'fill-a',
		label: { x: 180, y: 120 }
	},
	{
		id: 'wind-valley',
		pathTo: 'wind-valley',
		name: 'Долина Ветров',
		level: 6,
		desc: 'Просторы с переменчивой погодой и испытаниями.',
		path: 'M 380 0 L 800 0 L 780 110 L 820 300 L 600 260 L 420 270 L 360 120 Z',
		fillClass: 'fill-b',
		label: { x: 600, y: 90 }
	},
	{
		id: 'north-cliffs',
		pathTo: 'north-cliffs',
		name: 'Северные Утёсы',
		level: 11,
		desc: 'Крутые берега и резкие порывы ветра.',
		path: 'M 800 0 L 1200 0 L 1200 300 L 1000 280 L 820 300 L 780 110 Z',
		fillClass: 'fill-c',
		label: { x: 1020, y: 120 }
	},
	{
		id: 'stone-reach',
		pathTo: 'stone-reach',
		name: 'Каменный Предел',
		level: 3,
		desc: 'Каменистые балки и путевые караваны.',
		path: 'M 0 260 L 200 240 L 420 270 L 470 450 L 440 700 L 0 700 Z',
		fillClass: 'fill-d',
		label: { x: 220, y: 520 }
	},
	{
		id: 'lake-ruins',
		pathTo: 'lake-ruins',
		name: 'Руины Озёрья',
		level: 9,
		desc: 'Долины с озёрами и древними руинами.',
		path: 'M 420 270 L 600 260 L 820 300 L 860 480 L 950 700 L 440 700 L 470 450 Z',
		fillClass: 'fill-e',
		label: { x: 690, y: 540 }
	},
	{
		id: 'storm-coast',
		pathTo: 'storm-coast',
		name: 'Штормовой Берег',
		level: 16,
		desc: 'Опасные бухты и шторма.',
		path: 'M 820 300 L 1000 280 L 1200 300 L 1200 700 L 950 700 L 860 480 Z',
		fillClass: 'fill-f',
		label: { x: 1040, y: 560 }
	}
]
