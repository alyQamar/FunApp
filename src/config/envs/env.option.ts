import { ConfigModuleOptions } from "@nestjs/config";
import { localEnvSchema } from '@config/envs/schema/local.env.schema';

const developmentOptions: ConfigModuleOptions = {
    envFilePath: '.env',
    validationSchema: localEnvSchema,
    isGlobal: true,
    expandVariables: true
};

const productionOptions: ConfigModuleOptions = {

};

export default (): ConfigModuleOptions => {
    const nodeEnv = process.env.NODE_ENV;

    switch (nodeEnv) {
        case 'production':
            return productionOptions;
        default:
            return developmentOptions;
    }
};