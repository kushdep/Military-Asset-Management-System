import express from 'express'
import { asgnBaseAst, getALLBaseData as getALLBaseIds, getIdvlBaseData } from '../controllers/dashboardController.js';

const router = express.Router()


router.get('/', getALLBaseIds)

router.get('/:id', getIdvlBaseData)

router.post('/:id/assign-asset', asgnBaseAst)


export default router;