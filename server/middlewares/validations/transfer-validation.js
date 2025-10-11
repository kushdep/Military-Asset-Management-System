import Joi from 'joi'

export function assetTransferValidation(req, res, next) {
    try {
        const assetTransferSchema = Joi.object({
            toBaseId: Joi.string().required(),
            trnsfrAst: Joi.object({
                Vehicle: Joi.array().items(Joi.object({
                    id: Joi.string(),
                    name: Joi.string(),
                    qty: Joi.number(),
                    metric: Joi.string()
                })).required(),
                Weapons: Joi.array().items(Joi.object({
                    id: Joi.string(),
                    name: Joi.string(),
                    qty: Joi.number(),
                    metric: Joi.string()
                })).required(),
                Ammunition: Joi.array().items(Joi.object({
                    id: Joi.string(),
                    name: Joi.string(),
                    qty: Joi.number(),
                    metric: Joi.string()
                })).required(),
            })
        })
        const result = assetTransferSchema.validate(req.body)
        if (result.error) {
            console.log(result.error)
            return res.status(400).send({
                success: false,
                errors: result.error.details
            })
        }

        next()
    } catch (error) {
        console.log("ERROR IN assetTransferValidation()- " + error)
        return res.status(400).send({
            success: false,
            message: 'Validation failed'
        })
    }
} 
