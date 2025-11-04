export const useCanonical = () => {
	const route = useRoute()
	const {public: {siteUrl}} = useRuntimeConfig()
	const base = (siteUrl || '').replace(/\/$/, '')
	return base + route.path
}
