import { createAction } from "redux-actions";
import { ACTIVATED_TAB } from "../../constants/actionTypes";    
import { Action } from "redux";

export interface ActivatedTabPayload {
  tabId: number;
  url: string;
  origin?: string;
  pathname?: string;
  search?: string;
  searchParams?: Record<string, string>;
  hash?: string;
  timestamp?: number;
}

export const selectActivatedTab = createAction(ACTIVATED_TAB);