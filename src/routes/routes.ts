import { Router } from 'express'
import { processCsvData } from '../handler/csv'

const router = Router()

router.get('/', async (req, res) => {
	try {
		const data = await processCsvData()
		res.json(data).status(200)
  } catch (error) {
    console.log('Error ==>', error)
		res.status(500).json({ error: 'Erro ao processar dados.' })
	}
})

export default router
