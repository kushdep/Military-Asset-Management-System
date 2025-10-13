import Joi from 'joi'

const assetItemSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    qty: Joi.number().required(),
    metric: Joi.string().required(),
});

export function assetTransferValidation(req, res, next) {
    try {
        const assetTransferSchema = Joi.object({
            toBaseId: Joi.string().required(),
            trnsfrAst: Joi.object({
                Vehicle: Joi.array().items(assetItemSchema).default([]),
                Weapons: Joi.array().items(assetItemSchema).default([]),
                Ammunition: Joi.array().items(assetItemSchema).default([]),
            })
        })
        const result = assetTransferSchema.validate(req.body)
        if (result.error) {
            console.error(result.error)
            return res.status(400).send({
                success: false,
                errors: result.error.details
            })
        }

        next()
    } catch (error) {
        console.error("ERROR IN assetTransferValidation()- " + error)
        return res.status(400).send({
            success: false,
            message: 'Validation failed'
        })
    }
} 
