/* Valida se o valor total é igual ao valor da parcela x quantidade de parcelas */
export const isValidInstallments = (
	total: number,
	installments: number,
	installmentPrice: number
): boolean => total === installments * installmentPrice
