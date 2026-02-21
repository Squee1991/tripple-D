import DailyIframe from '@daily-co/daily-js'

let callObject = null

export function useDaily() {
	async function createCallObject() {
		if (callObject) {
			await callObject.destroy()
			callObject = null
		}
		callObject = DailyIframe.createCallObject({
			subscribeToTracksAutomatically: true
		})
		return callObject
	}

	async function join(url, token) {
		if (!callObject) await createCallObject()
		await callObject.join({ url, token })
		return callObject
	}

	async function leave() {
		if (callObject) {
			await callObject.leave()
			await callObject.destroy()
			callObject = null
		}
	}

	async function enumerateDevices() {
		if (!callObject) await createCallObject()
		const { devices } = await callObject.enumerateDevices()
		return devices
	}

	function getCallObject() {
		return callObject
	}

	return {
		createCallObject,
		join,
		leave,
		enumerateDevices,
		getCallObject
	}
}
