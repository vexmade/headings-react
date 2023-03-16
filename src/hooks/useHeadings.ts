import { type Reducer, useReducer } from 'react';

interface HeadingReducerState {
  customSet: boolean;
  headings: string[] | null;
  id: string | null;
  loaded: boolean;
}

interface AddHeadingAction {
  id: string;
  sectionLabel?: boolean;
  type: 'add';
}

interface HeadingsLoadedAction {
  type: 'loaded';
}

type HeadingReducerActions = AddHeadingAction | HeadingsLoadedAction;

export const useHeadings = () =>
  useReducer<Reducer<HeadingReducerState, HeadingReducerActions>>(
    (state, action) => {
      switch (action.type) {
        case 'add':
          return {
            ...state,
            headings: [...(state.headings ?? []), action.id],
            ...(state.id || state.customSet ? {} : { id: action.id }),
            ...(action.sectionLabel && !state.customSet ? { customSet: true, id: action.id } : {}),
          };

        case 'loaded':
          return {
            ...state,
            loaded: true,
          };

        default:
      }

      return state;
    },
    {
      customSet: false,
      headings: null,
      id: null,
      loaded: false,
    },
  );
