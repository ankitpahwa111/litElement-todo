import { LitElement, html } from "lit-element";
import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-button";
import "@vaadin/vaadin-checkbox";
import "@vaadin/vaadin-radio-button/vaadin-radio-button";
import "@vaadin/vaadin-radio-button/vaadin-radio-group";
const VisibilityFilters = {
  // filtering the todos
  SHOW_ALL: "All", // showing all todos
  SHOW_ACTIVE: "Active", // show only active todos
  SHOW_COMPLETED: "Completed", // show only completed todos
};

class TodoView extends LitElement {
  static get properties() {
    return {
      todos: { type: Array }, // array having todos
      filter: { type: String }, // which visibility filter is currenlty activated
      task: { type: String }, // new task
    };
  }
  constructor() {
    // initialising properties
    super();
    this.todos = [];
    this.filter = VisibilityFilters.SHOW_ALL;
    this.task = "";
  }
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
          value="${this.task}"
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
      this.todos = [
        ...this.todos,
        {
          task: this.task,
          complete: false,
        },
      ];
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
    this.todos = this.todos.map((todo) =>
      updatedTodo === todo ? { ...updatedTodo, complete } : todo
    );
  }
  filterChanged(e) {
    this.filter = e.target.value;
  }
  clearCompleted() {
    this.todos = this.todos.filter((todo) => !todo.complete);
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