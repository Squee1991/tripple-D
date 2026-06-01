
import { Network } from '@capacitor/network';

export default defineNuxtPlugin(async () => {
	const isOffline = useNetworkState();
	const status = await Network.getStatus();
	isOffline.value = !status.connected;
	Network.addListener('networkStatusChange', (status) => {
		isOffline.value = !status.connected;
	});
});