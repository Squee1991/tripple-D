export function useClasses() {
	const getDotClass = (step) => {
		return {
			'quest__dot': true,
			'quest__dot--done': step === 'done',
			'quest__dot--wrong': step === 'wrong',
			'quest__dot--current': step === 'current',
		}
	}

	const optionClass = (opt, questStore) => {
		if (questStore.showResult) {
			if (opt === questStore.task?.answer) return 'quest__option-btn--correct'
			if (opt === questStore.selected) return 'quest__option-btn--wrong'
			return 'quest__option-btn--dim'
		}
		return questStore.selected === opt ? 'quest__option-btn--chosen' : ''
	}

	return {
		getDotClass, optionClass
	}
}