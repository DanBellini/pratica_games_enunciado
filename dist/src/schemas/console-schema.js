import joi from "joi";
export var consoleSchema = joi.object({
    name: joi.string().required()
});
