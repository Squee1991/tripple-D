export const useNetworkState = () => {
	return useState('isOffline', () => false)
}