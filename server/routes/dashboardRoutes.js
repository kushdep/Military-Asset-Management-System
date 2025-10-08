import express from 'express'
import { addNewPurchaseData, asgnBaseAst, expendBaseAst, getALLBaseData as getALLBaseIds, getIdvlBaseData } from '../controllers/dashboardController.js';
import { newPurchaseValidation } from '../middlewares/validations/purchase-validation.js';

const router = express.Router()


router.get('/', getALLBaseIds)

router.get('/:id', getIdvlBaseData)

router.post('/:id/assign-asset', asgnBaseAst)

router.patch('/:id/expend-asset', expendBaseAst)

router.post('/:id/new-purchase', newPurchaseValidation,addNewPurchaseData)


export default router;