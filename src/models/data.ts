export interface ICsvData {
	nrCpfCnpj: string
	vlTotal: number
	qtPrestacoes: number
	vlPresta: number
	vlMora?: number | null
}

export interface IValidatedCsvDataResponse extends ICsvData {
	id: string
	isValidCpfOrCnpj: boolean
	formattedVlTotal: string /* Ex de retorno: R$198,99 */
	isValidInstallment: boolean /* prestações / parcelas */
}
