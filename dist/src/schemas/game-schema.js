import joi from "joi";
export var gameSchema = joi.object({
    title: joi.string().required(),
    consoleId: joi.number().required()
});
