/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_DELIVERY_COST: string;
    REACT_APP_SERVER_URL: string;
  }
}
