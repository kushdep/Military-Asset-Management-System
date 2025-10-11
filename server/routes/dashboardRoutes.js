import express from 'express'
import { addNewPurchaseData, asgnBaseAst, expendBaseAst, getALLBaseData as getALLBaseIds, getIdvlBaseData, recieveBaseAst, transferBaseAst } from '../controllers/dashboardController.js';
import { newPurchaseValidation } from '../middlewares/validations/purchase-validation.js';
import { assetAssignmentValidation } from '../middlewares/validations/assign-validation.js';
import { assetExpendValidation } from '../middlewares/validations/expend-validation.js';
import { assetTransferValidation } from '../middlewares/validations/transfer-validation.js';

const router = express.Router()


router.get('/', getALLBaseIds)
router.get('/:id', getIdvlBaseData)

router.post('/:id/new-purchase', newPurchaseValidation,addNewPurchaseData)

router.post('/:id/assign-asset', assetAssignmentValidation,asgnBaseAst)
router.patch('/:id/expend-asset', assetExpendValidation,expendBaseAst)

router.post('/:id/transfer-asset', assetTransferValidation,transferBaseAst)
router.post('/:id/recieve-asset', recieveBaseAst)


export default router;