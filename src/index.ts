import express from 'express'
import { PORT } from './config'

const app = express()

app.use(express.json())

//#region Rotas
app.use('/api', (req, res) => {
  console.log('sucesso')
	return res.json({ msg: 'endpoint funcionando' })
})
//#endregion Rotas

app.listen(PORT, () => {
	console.log(`Rodando na porta ${PORT}`)
})
