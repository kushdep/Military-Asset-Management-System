import express from 'express'
import { addNewPurchaseData, asgnBaseAst, expendBaseAst, getALLBaseData as getALLBaseIds, getIdvlBaseData, transferBaseAst } from '../controllers/dashboardController.js';
import { newPurchaseValidation } from '../middlewares/validations/purchase-validation.js';

const router = express.Router()


router.get('/', getALLBaseIds)

router.get('/:id', getIdvlBaseData)

router.post('/:id/new-purchase', newPurchaseValidation,addNewPurchaseData)

router.post('/:id/assign-asset', asgnBaseAst)
router.patch('/:id/expend-asset', expendBaseAst)

router.post('/:id/transfer-asset', transferBaseAst)


export default router;