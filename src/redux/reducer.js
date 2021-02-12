import {
  ADD_TODO,
  UPDATE_FILTER,
  UPDATE_TODO_STATUS,
  CLEAR_COMPLETED,
} from "./actions.js";

export const VisibilityFilters = {
  // filtering the todos
  SHOW_ALL: "All", // showing all todos
  SHOW_ACTIVE: "Active", // show only active todos
  SHOW_COMPLETED: "Completed", // show only completed todos
};

const INITIAL_STATE = {
  todos: [],
  filter: VisibilityFilters.SHOW_ALL,
};

// reducer takes the action and redux central state and makes the changes according to the action type
export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.todo],
      };
    case UPDATE_TODO_STATUS:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo === action.todo ? { ...todo, complete: action.complete } : todo
        ),
      };
    case UPDATE_FILTER:
      return {
        ...state,
        filter: action.filter,
      };
    case CLEAR_COMPLETED:
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.complete),
      };
    default:
      return state;
  }
};
