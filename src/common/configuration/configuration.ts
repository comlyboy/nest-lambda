import { DefinedAppEnvironmentEnum, DefinedAppEnvironmentType } from "../base.constant";
import { IEnvronmentVariable } from "../common.interface";

require('dotenv').config();

export const EnvironmentConfig: IEnvronmentVariable = {
	...process.env,
	NODE_ENV: process.env.NODE_ENV?.toLowerCase() as DefinedAppEnvironmentType || DefinedAppEnvironmentEnum.DEVELOPMENT,
	AWS_REGION: process.env.AWS_REGION,
	AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
	AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY
} as const;
