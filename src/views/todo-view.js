import { LitElement, html } from "lit-element";
import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-button";
import "@vaadin/vaadin-checkbox";
import "@vaadin/vaadin-radio-button/vaadin-radio-button";
import "@vaadin/vaadin-radio-button/vaadin-radio-group";
import { VisibilityFilters } from "../redux/reducer.js";
import { connect } from "pwa-helpers";
import { store } from "../redux/store.js";
import {
  addTodo,
  clear_Completed,
  updateFilter,
  updateTodoStatus,
} from "../redux/actions.js";
class TodoView extends connect(store)(LitElement) {
  static get properties() {
    return {
      todos: { type: Array }, // array having todos
      filter: { type: String }, // which visibility filter is currenlty activated
      task: { type: String }, // new task
    };
  }
  // this method is called when redux state changes and it changes the component properties accordingly so that re-render can happen
  stateChanged(state) {
    (this.todos = state.todos), (this.filter = state.filter);
  }

  // We don't need this constructor now because the initial state of this component is mapped with Store's state via stateChanged() method
  // constructor() {
  //   // initialising properties
  //   super();
  //   this.todos = [];
  //   this.filter = VisibilityFilters.SHOW_ALL;
  //   this.task = "";
  // }
  render() {
    return html`
        <style>
          todo-view { 
            display: block;
            max-width: 800px;
            margin: 0 auto;
          }
          todo-view .input-layout {
            width: 100%;
            display: flex;
            margin-top: 30px;
          }
          todo-view .input-layout vaadin-text-field {
            flex: 1;
            margin-right: var(--spacing); 
          }
          todo-view .todos-list {
            margin-top: var(--spacing);
          }
          todo-view .visibility-filters {
            margin-top: calc(4 * var(--spacing));
          }
      </style>
      <div class="input-layout" @keyup="${this.shortCutListener}">
        <vaadin-text-field
          placeholder="Task"
          value="${this.task || ""}"
          @change="${this.updateTask}"
        >
        </vaadin-text-field>

        <vaadin-button theme="primary" @click="${this.addTodo}">
          Add Todo
        </vaadin-button>
      </div>
      <br>
      <div class="todo-list">
        ${this.applyFilter(this.todos).map(
          (todo) =>
            html`
              <div class="todo-item">
                <vaadin-checkbox
                  ?checked="${todo.complete}"
                  @change="${(e) =>
                    this.updateTodoStatus(todo, e.target.checked)}"
                >
                  ${todo.task}
                </vaadin-checkbox>
              </div>
            `
        )}
      </div>
      <br>
      <vaadin-radio-group
        class="visibilty-filters"
        value="${this.filter}"
        @value-changed="${this.filterChanged}"
      >
        ${Object.values(VisibilityFilters).map(
          (filter) =>
            html`
              <vaadin-radio-button value="${filter}">
                ${filter}
              </vaadin-radio-button>
            `
        )}
      </vaadin-radio-group>
      <vaadin-button @click="${this.clearCompleted}">
        Clear Completed
      </vaadin-radio-button>
    `;
  }
  addTodo() {
    // this functions checks if task exists , and if it does , it appends that task to todos array
    if (this.task) {
      store.dispatch(addTodo(this.task));
      this.task = "";
    }
  }
  updateTask(e) {
    // this function just assigns the value of input box to our task property
    this.task = e.target.value;
  }

  shortCutListener(e) {
    if (e.key === "Enter") this.addTodo();
  }

  updateTodoStatus(updatedTodo, complete) {
    store.dispatch(updateTodoStatus(updatedTodo, complete));
  }
  filterChanged(e) {
    store.dispatch(updateFilter(e.detail.value));
  }
  clearCompleted() {
    store.dispatch(clear_Completed());
  }
  applyFilter(todos) {
    switch (this.filter) {
      case VisibilityFilters.SHOW_ACTIVE:
        return todos.filter((todo) => !todo.complete);
      case VisibilityFilters.SHOW_COMPLETED:
        return todos.filter((todo) => todo.complete);
      default:
        return todos;
    }
  }
  createRenderRoot() {
    return this;
  }
}

customElements.define("todo-view", TodoView);
