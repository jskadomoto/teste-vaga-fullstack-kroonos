import path from 'path'
import { ICsvData, IValidatedCsvDataResponse } from '../models/data'
import fs from 'fs'
import csvParser from 'csv-parser'
import { cpf } from 'cpf-cnpj-validator'
import { formatCurrencyToBRL } from '../utils/currency'
import { isValidInstallments } from '../utils/installments'

export const parseCsv = async (): Promise<ICsvData[]> => {
	const results: ICsvData[] = []
	const csvPath = path.join(__dirname, '..', 'mock', 'data.csv') /* cria um path para o arquivo CSV, localizado em: /src/mock/data.csv */

	return new Promise((resolve, reject) => {
		fs.createReadStream(csvPath)
			.pipe(csvParser())
			.on('data', (data: ICsvData) =>
				results.push({
					nrCpfCnpj: data.nrCpfCnpj,
					vlTotal: data.vlTotal,
					qtPrestacoes: data.qtPrestacoes,
					vlPresta: data.vlPresta,
					vlMora: data.vlMora ?? null,
				})
			)
			.on('end', () => resolve(results))
			.on('error', (error) => reject(error))
	})
}

export const processCsvData = async (): Promise<
	IValidatedCsvDataResponse[]
> => {
  const data = await parseCsv()
  
  if(!data) return Promise.reject('Erro ao processar o CSV')

	const output = data?.map((it) => {
		return {
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
