import Joi from 'joi'

export function assetAssignmentValidation(req, res, next) {
    try {
        const assignAssetSchema = Joi.object({
            sldrId: Joi.string().required(),
            asgnAst: Joi.object({
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
        }).required()
        const result = assignAssetSchema.validate(req.body)
        if (result.error) {
            console.log(result.error)
            return res.status(400).send({
                success: false,
                errors: result.error.details
            })
        }

        next()
    } catch (error) {
        console.log("ERROR IN assetAssignmentValidation()- " + error)
        return res.status(400).send({
            success:false,
            message:'Validation failed'
        })
    }
} 
