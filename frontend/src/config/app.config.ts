export const { NODE_ENV, REACT_APP_NAME, REACT_APP_LOG_LEVEL } = process.env;
export const IS_PROD = NODE_ENV === 'production';

export const NAME = REACT_APP_NAME || 'Smart Photo Album';
export const LOG_LEVEL = REACT_APP_LOG_LEVEL || 'info';
