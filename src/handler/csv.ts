import path from 'path'
import { ICsvData, IValidatedCsvDataResponse } from '../models/data'
import fs from 'fs'
import csvParser from 'csv-parser'
import { cpf } from 'cpf-cnpj-validator'
import { formatCurrencyToBRL } from '../utils/currency'
import { isValidInstallments } from '../utils/installments'
import { v4 as uuidv4 } from 'uuid'

export const parseCsv = async (
	page: number,
	limit: number
): Promise<ICsvData[]> => {
	const results: ICsvData[] = []
	const csvPath = path.join(
		__dirname,
		'..',
		'mock',
		'data.csv'
	) /* cria um path para o arquivo CSV, localizado em: /src/mock/data.csv */

	let count = 0
	const startCount = (page - 1) * limit
	const endCount = startCount + limit

	return new Promise((resolve, reject) => {
		fs.createReadStream(csvPath)
			.pipe(csvParser())
			.on('data', (data: ICsvData) => {
				if (count > startCount && count < endCount)
					results.push({
						nrCpfCnpj: data.nrCpfCnpj,
						vlTotal: data.vlTotal,
						qtPrestacoes: data.qtPrestacoes,
						vlPresta: data.vlPresta,
						vlMora: data.vlMora ?? null,
					})
				count++
			})
			.on('end', () => resolve(results))
			.on('error', (error) => reject(error))
	})
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
			isValidCpfOrCnpj: cpf.isValid(it.nrCpfCnpj),
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
