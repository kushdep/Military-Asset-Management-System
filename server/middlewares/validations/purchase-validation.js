import Joi from 'joi'

export function newPurchaseValidation(req, res, next) {
    try {
        const {oldAst=[],newAst=[]} = req.body
        if(oldAst.length>0){
            const oldPurchaseSchema = Joi.array().items(Joi.object({
                _id: Joi.string().required(),
                name: Joi.string().required(),
                type: Joi.string().required(),
                qty: Joi.number().integer(),
                metric: Joi.string().required()
            })).required()
            const result = oldPurchaseSchema.validate(oldAst)
            if (result.error) {
                console.log(result.error)
                return res.status(400).send({
                    success: false,
                    errors: result.error.details
                })
            }
        }
        
        if(newAst.length>0){
            const newPurchaseSchema = Joi.array().items(Joi.object({
                name: Joi.string().required(),
                type: Joi.string().required(),
                qty: Joi.number().integer().required(),
                metric: Joi.string().required()
            })).required()
            const result = newPurchaseSchema.validate(newAst)
            if (result.error) {
                console.log(result.error)
                return res.status(400).send({
                    success: false,
                    errors: result.error.details
                })
            }
        }

        next()
    } catch (error) {
        console.log("ERROR IN newPurchaseValidation()- " + error)
        return res.status(500).send({
            success: false,
            errors: error
        })
    }

} 
