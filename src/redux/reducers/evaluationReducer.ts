import { type UnknownAction } from "@reduxjs/toolkit";

import {
  FETCH_EVALUATION,
  FETCH_EVALUATION_SUCCEEDED,
  FETCH_EVALUATION_FAILED,
} from "../../constants/actionTypes";

interface EvaluationScores {
  chat_acknowledgment_initial_response: number;
  issue_understanding_diagnosis: number;
  resolution_provided: number;
  communication_tone: number;
  documentation_ticket_management: number;
}

interface EvaluationSummary {
  strengths: string;
  weaknesses: string;
  summary: string;
}

export interface Evaluation {
  fatal: "YES" | "NO";
  fatal_reasons: string[];
  scores: EvaluationScores;
  summary: EvaluationSummary;
}

interface EvaluationState {
  evaluations: Record<string, Evaluation>;
  loading: boolean;
  error: string | null;
}

const initialState: EvaluationState = {
  evaluations: {},
  loading: false,
  error: null,
};

const evaluationReducer = (state = initialState, action: UnknownAction) => {
  switch (action.type) {
    case FETCH_EVALUATION:
      return { ...state, loading: true };
      
    case FETCH_EVALUATION_SUCCEEDED: {
      const { id, evaluation } = action.payload as { id: string, evaluation: Evaluation };
      
      return {
        ...state,
        evaluations: {
          ...state.evaluations,
          [id]: evaluation,
        },
        loading: false,
      };
    }
    case FETCH_EVALUATION_FAILED:
      return { ...state, error: action.payload, loading: false };
  }
};

export default evaluationReducer;
