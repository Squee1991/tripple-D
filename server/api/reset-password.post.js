import { defineEventHandler, readBody, createError } from 'h3'
import admin from 'firebase-admin'
import { Resend } from 'resend'

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert({
			projectId: "tripple-d-dev",
			clientEmail: "firebase-adminsdk-fbsvc@tripple-d-dev.iam.gserviceaccount.com",
			privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDgxVzEXLgbdyRv\nUOe57F47gVJevRb9baugINpALDHNU/CQ/3F0yt9JllJjBhsrtHq/bBKmp1UkdJxa\n/vaClYrqX7oAAPiuprCcOkscJb75Z7/GFY8MtSjl2oDujUuKunL94uEQXZ1qgmdA\nsMJTk0jrRWgJ2TLYk5BtfzDKrmAN/zyDrapqkb2P8mMu8mtZAVbnvL/AuMmHsAhd\nlbAYjF4R5HjOCV9eSXJvHVxx8mnaz+pd3yoIXQHLhChIJeL8qQltfuq6gOEsk718\n1R9mZRFz4+6c5zCxYeUiBu2wv5Xy+7ftwTXE4ltti9phKVjvLoJitP7uicLyv7rX\nh/qoy2eFAgMBAAECggEACcZ4YI9wiYlAWJlmxCUHSB4GTHNIZhP4WQnbINu+Yrtz\nnlEg4j88cyfXEQVswxU7TWRQconOeYjOXMq/3JgCWmt4j5Phoz7baXMp9xRqxNAC\nFoXmtCfHNCl99/uSVuGa992ytt9LZelvJVbkOXXejJTdKUIWV8+7G6sva3EmYXvG\nV+j4GubyW6SP9+k3U0YEpD/RawRrmxeEjNzLTBF/8IF9AI7jaf0Z/ikBRIlLz0It\nWHHOcrWLzRlV/6pRlDFYWr0gc7JtgLM9kxryGFG2IuXKR5S35fA1xA2oGUAwsvBX\nb4f9ee7E/yi6tM+9XrAx6GxxnZY8QVxuJ+gaPekL1QKBgQD169HvZjpYECLZFcxG\neqrQ5JBZV9veDJ4NH8wM6qffOsHUFDx6tdqUGs/H1u5dkfMSXPtiK6v6y2fZhwyf\nt6+nSyzuiWzDC6wrQ1xM5bv9+WawWr8SSkEuv2cwl0IPxPq2mSRAN5HDe38+ZARv\niX0WLh3JFX4UNwB91ndUDjmjUwKBgQDp+6LkZhhNgDHxfYya/UtgLMWbIThxTMRN\nhEOYpZ7eHnwFWRyi53Bu12JO26JibKW/tvSogU+Zvc/4p4afG4nxC5teEtIVVTOt\nLMLHUsfcXXwKq164nZ6qCd0SJddiAd0UhvHom24dOWhTa8c3CJvLdwrkiqXOkLdl\nSMnlh4CGxwKBgGnuKMIcoOkqGji0gQei802EBwHVLKpbeQFiPv0ZXzJzFucJyHt7\nNiox2mrUlFzN74xrbQV+llgzogo7eB6cexdu9G3T2Huz3XfNTkb5dp8R/T/d9wwj\n3CwM2qA9p4EvcmeRU+ItjaZM3iS75IU/DhityLrDfUmr35RU+5XDguRtAoGBALiJ\n5mcMvo4hVUKJKqPyscggh5laEhIJ4ajhcA6sUSgOEvKE3bj9oAdLiBV51BCcb/1M\nZpmfoxA2TBhoyBwktB6QcPE5FsgMcr1aWCSsfUSn1nTzw7kHV2P0c48kmUKLBbpy\n08gJDkeuR0HD91LIT1ehg83MLAlGyd3wEowc2plxAoGAK54yZa48L+/gjZQRTWrg\n//ksiAgrRIXji7bdar1jyqgasR7L0tiSbLVdgBhFdXyuJ3ViGUbYtbverldOwt6U\nySUK5PGIyQaSdFuKB5bDiDsyxvaw25BvIIenvvPISircai0U1Har4RKcHiQZN3vV\njVT/KCJIOVfKhVf/o1XRqGU=\n-----END PRIVATE KEY-----\n",
		})
	})
}

const resend = new Resend('re_boRTAhjH_3tKy2G6YpX3Tx8mdwHyjNHK1')
export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { email } = body
	if (!email) {
		throw createError({ statusCode: 400, statusMessage: 'Email обязателен' })
	}
	try {
		const resetLink = await admin.auth().generatePasswordResetLink(email)
		const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:transparent; color:#333;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:transparent; border-radius:14px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
              <tr>
                <td align="center" style="background-color:#0056b3; padding:30px 20px;">
                  <h1 style="color:#ffffff; margin:0; font-size:24px;">Skillupgerman</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:40px 30px; line-height:1.6; font-size:16px;">
                  <p>Hello!</p>
                  <p>We received a request to reset your password. Click the button below to set up a new one:</p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${resetLink}" style="background-color:#0056b3; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:6px; font-weight:bold; display:inline-block;">Reset Password</a>
                      </td>
                    </tr>
                  </table>
                  <p style="font-size:14px; color:#777777;">If you didn't request a password reset, you can safely ignore this email.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
`
		const data = await resend.emails.send({
			from: 'Skillupgerman Team <noreply@skillupgerman.com>',
			to: email,
			subject: 'Password Reset — Skillupgerman',
			html: htmlTemplate
		})

		return { success: true, resendId: data.id }

	} catch (error) {
		console.error('Ошибка отправки:', error)
		throw createError({ statusCode: 500, statusMessage: error.message || 'Ошибка сервера' })
	}
})