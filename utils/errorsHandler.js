export const errorValueMap = {
	'auth/email-not-verified': { field: 'email', error: 'errors.emailNotVerified' },
	'auth/user-not-found': { field: 'email', error: 'errors.userNotFound' },
	'auth/wrong-password': { field: 'password', error: 'errors.wrongPassword' },
	'auth/invalid-email': { field: 'email', error: 'errors.invalidEmail' },
	'auth/email-already-in-use': { field: 'email', error: 'errors.userExists' },
	'auth/invalid-credential': { field: 'password', error: 'errors.invalidCredential' },
	'auth/missing-password': { field: 'password', error: 'errors.errorPassword' },
	'auth/too-many-requests': { field: 'password', error: 'errors.tooManyRequests' },
	'auth/missing-email': { field: 'email', error: 'errors.missingEmail' },
	'auth/weak-password': { field: 'password', error: 'errors.weakPassword' },
	'auth/user-disabled': { field: 'email', error: 'errors.userDisabled' },
	'auth/network-request-failed': { field: 'email', error: 'errors.networkRequestFailed' },

	default: { field: 'password', error: 'errors.generalError' }
}

export function mapErrors(fields, errorCode) {
	const match = errorValueMap[errorCode] || errorValueMap['default']
	const field = fields.find(f => f.name === match.field)
	if (field) field.error = match.error
}

