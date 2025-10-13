import Joi from 'joi'

export function assetExpendValidation(req, res, next) {
    try {
            const expendAssetSchema = Joi.object({
                asgmtId:Joi.string().required(),
                items:Joi.array().items(Joi.object({
                    itemId: Joi.string().required(),
                    name: Joi.string().required(),
                    qty: Joi.number().integer(),
                    metric: Joi.string().required()
                })).required()
            })
            const result = expendAssetSchema.validate(req.body)
            if (result.error) {
                console.error(result.error)
                return res.status(400).send({
                    success: false,
                    errors: result.error.details
                })
            }

        next()
    } catch (error) {
        console.error("ERROR IN assetExpendValidation()- " + error)
        return res.status(400).send({
            success:false,
            message:'Validation failed'
        })
    }
} 
