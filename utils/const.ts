export const DEFAULT_SYSTEM_PROMPT ="You are an AI assistant that helps people find information.";

export const OPENAI_TYPE = process.env.OPENAI_TYPE;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const OPENAI_API_MODEL = process.env.OPENAI_API_MODEL || "gpt-3.5-turbo-16k";
export const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
export const AZURE_OPENAI_API_INSTANCE_NAME = process.env.AZURE_OPENAI_API_INSTANCE_NAME;
export const AZURE_OPENAI_API_DEPLOYMENT_NAME = process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME;
export const AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME = process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME;
export const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION;