export const errorValueMap = {
	'auth/email-not-verified': {field: 'email', error: 'errors.emailNotVerified'},
	'auth/user-not-found': {field: 'email', error: 'errors.userNotFound'},
	'auth/wrong-password': {field: 'email', error: 'errors.wrongPassword'},
	'auth/invalid-email': {field: 'email', error: 'errors.invalidEmail'},
	'auth/email-already-in-use': {field: 'email', error: 'errors.userExists'},
	'auth/invalid-credential': {field: 'email', error: 'errors.invalidCredential'},
	default: {field: 'email', error: 'errors.generalError'},
}

export function mapErrors(fields, errorCode) {
	const match = errorValueMap[errorCode] || errorValueMap['default']
	const field = fields.find(f => f.name === match.field)
	if (field) field.error = match.error
}

