import { defineEventHandler, getRequestHeaders } from 'h3'

export default defineEventHandler((event) => {
	const headers = getRequestHeaders(event)

	const userCountry = headers['cf-ipcountry'] || headers['x-vercel-ip-country'] || 'DE'

	const priceData = getPriceDataForUser(userCountry)

	return priceData
})