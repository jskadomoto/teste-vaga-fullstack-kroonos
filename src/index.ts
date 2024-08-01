import express from 'express'
import { PORT } from './config'
import dataRoute from './routes/routes'

const app = express()

app.use(express.json())

//#region Rotas
app.use('/', dataRoute)
//#endregion Rotas

app.listen(PORT, () => {
	console.log(`Rodando na porta ${PORT}`)
})
