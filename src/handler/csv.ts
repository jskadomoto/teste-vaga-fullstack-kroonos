import path from 'path'
import { ICsvData, IValidatedCsvDataResponse } from '../models/data'
import fs from 'fs'
import csvParser from 'csv-parser'
import { cpf } from 'cpf-cnpj-validator'
import { formatCurrencyToBRL } from '../utils/currency'
import { isValidInstallments } from '../utils/installments'
import { v4 as uuidv4 } from 'uuid'
import { validateCPFOrCNPJ } from '../utils/docs'

export const parseCsv = async (
	page: number,
	limit: number
): Promise<ICsvData[]> => {
	const results: ICsvData[] = []
	const csvPath = path.join(__dirname, '..', 'mock', 'data.csv') /* cria um path para o arquivo CSV, localizado em: /src/mock/data.csv */

	let count = 0
	const startCount = (page - 1) * limit
	const endCount = startCount + limit

	try {
		const csvStream = fs.createReadStream(csvPath).pipe(csvParser())

		for await (const data of csvStream) {
			if (count > startCount && count < endCount) {
				results.push({
					nrCpfCnpj: data.nrCpfCnpj,
					vlTotal: data.vlTotal,
					qtPrestacoes: data.qtPrestacoes,
					vlPresta: data.vlPresta,
					vlMora: data.vlMora ?? null,
				})
			}
			count++
		}

		return Promise.resolve(results)
	} catch (error) {
		console.log('Erro ao realizar o parse do CSV ===>', error)
		throw new Error(`Erro ao realizar o parse do CSV: ${error}`)
	}
}

export const processCsvData = async (
	page: number,
	limit: number
): Promise<IValidatedCsvDataResponse[]> => {
	const data = await parseCsv(page, limit)

	if (!data) return Promise.reject('Erro ao processar o CSV')

	const output = data?.map((it) => {
		return {
			id: uuidv4(),
			...it,
			isValidCpfOrCnpj: validateCPFOrCNPJ(it.nrCpfCnpj),
			formattedVlTotal: formatCurrencyToBRL(it.vlTotal),
			isValidInstallment: isValidInstallments(
				it.vlTotal,
				it.qtPrestacoes,
				it.vlPresta
			),
		}
	})

	return Promise.resolve(output)
}
