import type { UnknownAction } from "@reduxjs/toolkit";
import { ACTIVATED_TAB } from "../../constants/actionTypes";
import type { ActivatedTabPayload } from "../actions/selection";

export interface SelectionState {
  activatedTab: ActivatedTabPayload | null;
}

const initialState: SelectionState = {
  activatedTab: null,
};

const selectionReducer = (state = initialState, action: UnknownAction): SelectionState => {
    console.log('selectionReducer', action.type, action.payload)
  switch (action.type) {
    case ACTIVATED_TAB:
      return {
        ...state,
        activatedTab: (action.payload as ActivatedTabPayload) ?? null,
      };
    default:
      return state;
  }
};

export default selectionReducer;
