import * as Joi from 'joi';

export const localEnvSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'test', 'staging', 'production')
        .default('development'),
    PORT: Joi.number().port().default(4352),

});
