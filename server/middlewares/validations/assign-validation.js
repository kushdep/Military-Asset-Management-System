import Joi from 'joi'

const assetItemSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  qty: Joi.number().required(),
  metric: Joi.string().required(),
});

export function assetAssignmentValidation(req, res, next) {
    try {
        const assignAssetSchema = Joi.object({
            sldrId: Joi.string().required(),
            asgnAst: Joi.object({
                Vehicle: Joi.array().items(assetItemSchema).default([]),
                Weapons: Joi.array().items(assetItemSchema).default([]),
                Ammunition: Joi.array().items(assetItemSchema).default([]),
            }).required(),
        });
        const result = assignAssetSchema.validate(req.body)
        if (result.error) {
            console.error(result.error)
            return res.status(400).send({
                success: false,
                errors: result.error.details
            })
        }

        next()
    } catch (error) {
        console.error("ERROR IN assetAssignmentValidation()- " + error)
        return res.status(400).send({
            success: false,
            message: 'Validation failed'
        })
    }
} 
