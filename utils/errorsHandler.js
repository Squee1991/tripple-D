export const errorValueMap = {
	'auth/email-not-verified': { field: 'email', error: 'errors.emailNotVerified' },
	'auth/user-not-found': { field: 'email', error: 'errors.userNotFound' },
	'auth/wrong-password': { field: 'deletePassword', error: 'errors.wrongPassword' },
	'auth/invalid-email': { field: 'email', error: 'errors.invalidEmail' },
	'auth/email-already-in-use': { field: 'email', error: 'errors.userExists' },
	'auth/invalid-credential': { field: 'deletePassword', error: 'errors.invalidCredential' },
	'auth/missing-password': { field: 'deletePassword', error: 'errors.errorPassword' },
	'auth/too-many-requests': { field: 'deletePassword', error: 'errors.tooManyRequests' },
	'auth/missing-email': { field: 'deletePassword', error: 'errors.missingEmail' },
	default: { field: 'deletePassword', error: 'errors.generalError' }
}

export function mapErrors(fields, errorCode) {
	const match = errorValueMap[errorCode] || errorValueMap['default']
	const field = fields.find(f => f.name === match.field)
	if (field) field.error = match.error
}

