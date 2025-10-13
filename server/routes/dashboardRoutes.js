import express from 'express'
import { getALLBaseIds } from '../controllers/dashboardController.js'
import { authorize, authorizeBase } from "../middlewares/authorization.js";
import { newPurchaseValidation } from "../middlewares/validations/purchase-validation.js";
import { assetAssignmentValidation } from "../middlewares/validations/assign-validation.js";
import { assetExpendValidation } from "../middlewares/validations/expend-validation.js";
import { assetTransferValidation } from "../middlewares/validations/transfer-validation.js";
import { addNewPurchaseData } from "../controllers/purchaseController.js";
import { recieveBaseAst, transferBaseAst } from "../controllers/transferController.js";
import { asgnBaseAst, expendBaseAst } from "../controllers/asgnExpndController.js";
import { getIdvlBaseData } from "../controllers/dashboardController.js";

const router = express.Router()

router.get('/', getALLBaseIds)

router.get('/:id',authorizeBase, getIdvlBaseData)
router.post('/:id/new-purchase', authorize, authorizeBase, newPurchaseValidation, addNewPurchaseData)

router.post('/:id/assign-asset', authorizeBase, assetAssignmentValidation, asgnBaseAst)
router.patch('/:id/expend-asset', authorize, authorizeBase, assetExpendValidation, expendBaseAst)

router.post('/:id/transfer-asset', authorizeBase, assetTransferValidation, transferBaseAst)
router.post('/:id/recieve-asset', authorize, authorizeBase, recieveBaseAst)




export default router;