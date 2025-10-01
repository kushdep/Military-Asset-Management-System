import express from 'express'
import { getALLBaseData as getALLBaseIds, getIndBaseData as getIdvlBaseData } from '../controllers/dashboardController.js';

const router = express.Router()


router.get('/', getALLBaseIds)

router.get('/:id', getIdvlBaseData)

// router.get('/my-trips', getUserTrips)

// router.get('/liked-loc', getWhishlistLoc)

// router.patch('/update-liked-loc', updateSavedLoc)

// router.patch('/update-profile-img',profileImgUpload,updateProfileImg)

// router.patch('/propertier-verification',setPropertierData)


export default router;