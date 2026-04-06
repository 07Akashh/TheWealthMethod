export enum Environment {
  LOCAL = "LOCAL",
  DEV = "DEV",
  PROD = "PROD",
  PREPROD = "PREPROD",
}

export const ENV: Environment = (process.env.EXPO_PUBLIC_ENV as Environment) || Environment.DEV;
