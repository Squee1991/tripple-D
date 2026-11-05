// Земли, которые собирает генератор, в порядке курса.
// Порядок важен: интервальное повторение берёт задания из учебных квестов, пройденных раньше.
// Цепочка начинается с «Города вежливости» (public/quests/quests-requests-land.json, он сделан вручную).
module.exports = [
	// A1: новые земли (старые A1 сделаны вручную)
	'a1/east-plain.cjs',
	'a1/meet-meadow.cjs',
	'a1/question-gorge.cjs',
	// A1, второй раздел (pathfinder)
	'a1/market-square.cjs',
	'a1/change-river.cjs',
	'a1/family-tree.cjs',
	'a1/clock-tower.cjs','a1/routine-mill.cjs',
	'a1/power-pass.cjs',
	'a1/hearty-inn.cjs',
	'a1/dress-bazaar.cjs',
	'a1/healer-hut.cjs',
	'a1/a1-summit.cjs',
	'a2/calendar-valley.cjs',
	'a2/time-road.cjs',
	'a2/comparison-hills.cjs',
	'a2/advice-garden.cjs',
	'a2/choice-crossing.cjs',
	'a2/nobody-village.cjs',
	'a2/a2-summit.cjs',
	// B1: добавлять сюда по мере готовности
	'b1/story-valley.cjs',
	'b1/memory-lake.cjs',
	'b1/reason-bridge.cjs',
	'b1/purpose-path.cjs',
	'b1/consequence-fork.cjs',
	'b1/neighbor-street.cjs',
	'b1/craft-valley.cjs',
	'b1/task-tower.cjs',
	'b1/decision-workshop.cjs',
	'b1/experience-summit.cjs',
	// раздел wisdom
	'b1/wish-island.cjs',
	'b1/regret-river.cjs',
	'b1/owner-castle.cjs',
	'b1/hero-square.cjs',
	'b1/taste-market.cjs',
	'b1/question-bridge.cjs',
	'b1/link-harbor.cjs',
	'b1/word-forge.cjs',
	'b1/opinion-tower.cjs',
	'b1/wisdom-summit.cjs'
]
