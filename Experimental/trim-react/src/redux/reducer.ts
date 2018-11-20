import { ReducerFactory } from "redux-actions-ts-reducer";

export class IAppState {
  ErrorMessage: string;
}

export const reducer = new ReducerFactory(new IAppState());
