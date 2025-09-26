export const useCanonical = () => {
	const route = useRoute()
	const {public: {siteUrl}} = useRuntimeConfig()
	const base = (siteUrl || '').replace(/\/$/, '')
	const path = route.path.endsWith('/') ? route.path : route.path + '/'
	return base + path
}
