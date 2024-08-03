import { Router } from 'express'
import { processCsvData } from '../handler/csv'

const router = Router()

router.get('/', async (req, res) => {
	try {
		const page = parseInt(req.query.page as string) ?? 1 
		const limit = parseInt(req.query.limit as string) ?? 100 
		const data = await processCsvData(page, limit)
		res.json(data).status(200)
  } catch (error) {
    console.log('Error ==>', error)
		res.status(500).json({ error: 'Erro ao processar dados.' })
	}
})

export default router
