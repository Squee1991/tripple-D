// Наградные достижения считают старые наборы земель: новые земли их цели не меняют
export const explorerLandIds = ['eastPlain', 'stone-reach', 'wind-valley', 'lake-ruins', 'north-cliffs', 'storm-coast', 'master-lands', 'wild-lands']
export const adventureLandIds = ['future-land', 'past-land', 'action-valley', 'order-valley', 'time-gate', 'edge-images', 'secret-lands', 'definite-indefinite']
export const landMasterIds = ['FiveHearts', 'explorer', 'adventures']

// Группы повторяют разделы карты. id достижения = id земли (кроме eastPlain)
export const wordAchievementsGroup = [
	{
		title: 'categories.beginner',
		achievements: [
			{
				id: 'eastPlain',
				name: 'locationAchievementsCategory.firstName',
				description: 'locationAchievementsCategory.firstDescription',
				icon: '🌾',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'meet-meadow',
				name: 'locationNames.meet-meadow',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🤝',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'stone-reach',
				name: 'locationAchievementsCategory.secondName',
				description: 'locationAchievementsCategory.secondDescription',
				icon: '🗻',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'question-gorge',
				name: 'locationNames.question-gorge',
				description: 'locationAchievementsCategory.landDescription',
				icon: '❓',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'market-square',
				name: 'locationNames.market-square',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🛒',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'change-river',
				name: 'locationNames.change-river',
				description: 'locationAchievementsCategory.landDescription',
				icon: '💶',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'family-tree',
				name: 'locationNames.family-tree',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🌳',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'clock-tower',
				name: 'locationNames.clock-tower',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🕰️',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'routine-mill',
				name: 'locationNames.routine-mill',
				description: 'locationAchievementsCategory.landDescription',
				icon: '⚙️',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'power-pass',
				name: 'locationNames.power-pass',
				description: 'locationAchievementsCategory.landDescription',
				icon: '💪',
				currentProgress: 0,
				targetProgress: 10
			}
		]
	},
	{
		title: 'categories.pathfinder',
		achievements: [
			{
				id: 'hearty-inn',
				name: 'locationNames.hearty-inn',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🍲',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'dress-bazaar',
				name: 'locationNames.dress-bazaar',
				description: 'locationAchievementsCategory.landDescription',
				icon: '👕',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'wind-valley',
				name: 'locationAchievementsCategory.thirdName',
				description: 'locationAchievementsCategory.thirdDescription',
				icon: '💨',
				currentProgress: 0,
				targetProgress: 13
			},
			{
				id: 'lake-ruins',
				name: 'locationAchievementsCategory.fourthName',
				description: 'locationAchievementsCategory.fourthDescription',
				icon: '🏛️',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'north-cliffs',
				name: 'locationAchievementsCategory.fifthName',
				description: 'locationAchievementsCategory.fifthDescription',
				icon: '🏔️',
				currentProgress: 0,
				targetProgress: 12
			},
			{
				id: 'storm-coast',
				name: 'locationAchievementsCategory.sixthName',
				description: 'locationAchievementsCategory.sixthDescription',
				icon: '🌊',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'master-lands',
				name: 'locationAchievementsCategory.seventhName',
				description: 'locationAchievementsCategory.seventhDescription',
				icon: '🛠️',
				currentProgress: 0,
				targetProgress: 14
			},
			{
				id: 'wild-lands',
				name: 'locationAchievementsCategory.eightName',
				description: 'locationAchievementsCategory.eightDescription',
				icon: '🏞️',
				currentProgress: 0,
				targetProgress: 15
			},
			{
				id: 'healer-hut',
				name: 'locationNames.healer-hut',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🩺',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'a1-summit',
				name: 'locationNames.a1-summit',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🚩',
				currentProgress: 0,
				targetProgress: 10
			}
		]
	},
	{
		title: 'categories.elementary',
		achievements: [
			{
				id: 'past-simple',
				name: 'locationNames.past-simple',
				description: 'locationAchievementsCategory.landDescription',
				icon: '⏳',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'past-land',
				name: 'locationAchievementsCategory2.pastLandName',
				description: 'locationAchievementsCategory2.pastLandDescription',
				icon: '⏳',
				currentProgress: 0,
				targetProgress: 12
			},
			{
				id: 'place-prepositions',
				name: 'locationNames.place-prepositions',
				description: 'locationAchievementsCategory.landDescription',
				icon: '📍',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'direction-prepositions',
				name: 'locationNames.direction-prepositions',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🧭',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'action-prepositions',
				name: 'locationNames.action-prepositions',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🎯',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'action-valley',
				name: 'locationAchievementsCategory2.actionValleyName',
				description: 'locationAchievementsCategory2.actionValleyDescription',
				icon: '⚡',
				currentProgress: 0,
				targetProgress: 11
			},
			{
				id: 'requests-land',
				name: 'locationNames.requests-land',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🙏',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'order-valley',
				name: 'locationAchievementsCategory2.orderValleyName',
				description: 'locationAchievementsCategory2.orderValleyDescription',
				icon: '⚖️',
				currentProgress: 0,
				targetProgress: 12
			},
			{
				id: 'calendar-valley',
				name: 'locationNames.calendar-valley',
				description: 'locationAchievementsCategory.landDescription',
				icon: '📅',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'time-road',
				name: 'locationNames.time-road',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🛣️',
				currentProgress: 0,
				targetProgress: 10
			}
		]
	},
	{
		title: 'categories.intermediate',
		achievements: [
			{
				id: 'comparison-hills',
				name: 'locationNames.comparison-hills',
				description: 'locationAchievementsCategory.landDescription',
				icon: '⚖️',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'advice-garden',
				name: 'locationNames.advice-garden',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🌷',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'choice-crossing',
				name: 'locationNames.choice-crossing',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🔀',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'nobody-village',
				name: 'locationNames.nobody-village',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🏘️',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'future-land',
				name: 'locationAchievementsCategory2.pluralLandName',
				description: 'locationAchievementsCategory2.pluralLandDescription',
				icon: '🚀',
				currentProgress: 0,
				targetProgress: 15
			},
			{
				id: 'edge-images',
				name: 'locationAchievementsCategory2.edgeImagesName',
				description: 'locationAchievementsCategory2.edgeImagesDescription',
				icon: '🎨',
				currentProgress: 0,
				targetProgress: 15
			},
			{
				id: 'secret-lands',
				name: 'locationAchievementsCategory2.secretLandsName',
				description: 'locationAchievementsCategory2.secretLandsDescription',
				icon: '🔍',
				currentProgress: 0,
				targetProgress: 15
			},
			{
				id: 'definite-indefinite',
				name: 'locationAchievementsCategory2.definiteIndefiniteName',
				description: 'locationAchievementsCategory2.definiteIndefiniteDescription',
				icon: '🌀',
				currentProgress: 0,
				targetProgress: 15
			},
			{
				id: 'time-gate',
				name: 'locationAchievementsCategory2.timeGateName',
				description: 'locationAchievementsCategory2.timeGateDescription',
				icon: '⛩️',
				currentProgress: 0,
				targetProgress: 15
			},
			{
				id: 'a2-summit',
				name: 'locationNames.a2-summit',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🏁',
				currentProgress: 0,
				targetProgress: 10
			}
		]
	},
	{
		title: 'categories.experience',
		achievements: [
			{
				id: 'story-valley',
				name: 'locationNames.story-valley',
				description: 'locationAchievementsCategory.landDescription',
				icon: '📖',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'memory-lake',
				name: 'locationNames.memory-lake',
				description: 'locationAchievementsCategory.landDescription',
				icon: '💭',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'reason-bridge',
				name: 'locationNames.reason-bridge',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🌉',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'purpose-path',
				name: 'locationNames.purpose-path',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🥾',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'consequence-fork',
				name: 'locationNames.consequence-fork',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🍴',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'neighbor-street',
				name: 'locationNames.neighbor-street',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🏡',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'craft-valley',
				name: 'locationNames.craft-valley',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🔨',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'task-tower',
				name: 'locationNames.task-tower',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🗼',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'decision-workshop',
				name: 'locationNames.decision-workshop',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🛠️',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'experience-summit',
				name: 'locationNames.experience-summit',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🏅',
				currentProgress: 0,
				targetProgress: 10
			}
		]
	},
	{
		title: 'categories.wisdom',
		achievements: [
			{
				id: 'wish-island',
				name: 'locationNames.wish-island',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🏝️',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'regret-river',
				name: 'locationNames.regret-river',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🏞️',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'owner-castle',
				name: 'locationNames.owner-castle',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🏰',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'hero-square',
				name: 'locationNames.hero-square',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🦸',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'taste-market',
				name: 'locationNames.taste-market',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🍇',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'question-bridge',
				name: 'locationNames.question-bridge',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🌁',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'link-harbor',
				name: 'locationNames.link-harbor',
				description: 'locationAchievementsCategory.landDescription',
				icon: '⚓',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'word-forge',
				name: 'locationNames.word-forge',
				description: 'locationAchievementsCategory.landDescription',
				icon: '⚒️',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'opinion-tower',
				name: 'locationNames.opinion-tower',
				description: 'locationAchievementsCategory.landDescription',
				icon: '💬',
				currentProgress: 0,
				targetProgress: 10
			},
			{
				id: 'wisdom-summit',
				name: 'locationNames.wisdom-summit',
				description: 'locationAchievementsCategory.landDescription',
				icon: '🦉',
				currentProgress: 0,
				targetProgress: 10
			}
		]
	},
	{
		title: 'locationAchievementsCategory.allLocationsName',
		achievements: [
			{
				id: 'FiveHearts',
				name: 'locationAchievementsCategory.fiveHearthName',
				description: 'locationAchievementsCategory.fiveHearthDescription',
				icon: '💖',
				currentProgress: 0,
				targetProgress: 20,
				awards: 'locationAchievementsCategory.fiveHearthAwards'
			},
			{
				id: 'explorer',
				name: 'locationAchievementsCategory.allLocationsName',
				description: 'locationAchievementsCategory.allLocationsDescription',
				icon: '🌍',
				currentProgress: 0,
				targetProgress: 8,
				awards: 'locationAchievementsCategory.allLocationsAwards'
			},
			{
				id: 'adventures',
				name: 'locationAchievementsCategory2.adventuresMasterName',
				description: 'locationAchievementsCategory2.adventuresMasterDescription',
				icon: '🗺️',
				currentProgress: 0,
				targetProgress: 8,
				awards: 'locationAchievementsCategory2.adventuresMasterAward'
			}
		]
	}
]
