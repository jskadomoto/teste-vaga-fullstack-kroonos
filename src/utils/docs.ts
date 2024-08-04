import { cnpj, cpf } from 'cpf-cnpj-validator'

export const validateCPFOrCNPJ = (doc: string): boolean => {
	if (!doc) return false

	const documentLength = doc.length

	if (documentLength === 14) {
		return cnpj.isValid(doc)
	}

	if (documentLength === 11) {
		return cpf.isValid(doc)
	}

	return false
}
