interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type Filter = "all" | "active" | "completed";

class TodoApp {
  private todos: Todo[] = [];
  private filter: Filter = "all";
  private nextId = 1;

  private form = document.getElementById("todo-form") as HTMLFormElement;
  private input = document.getElementById("todo-input") as HTMLInputElement;
  private list = document.getElementById("todo-list") as HTMLUListElement;
  private itemsLeft = document.getElementById("items-left") as HTMLSpanElement;
  private clearCompletedBtn = document.getElementById("clear-completed") as HTMLButtonElement;
  private clearAllBtn = document.getElementById("clear-all") as HTMLButtonElement;
  private filterButtons = document.querySelectorAll<HTMLButtonElement>(".filter-btn");

  constructor() {
    this.bindEvents();
    this.render();
  }

  private bindEvents(): void {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTodo(this.input.value);
      this.input.value = "";
    });

    this.filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.filter = btn.dataset.filter as Filter;
        this.render();
      });
    });

    this.clearCompletedBtn.addEventListener("click", () => {
      this.todos = this.todos.filter((t) => !t.completed);
      this.render();
    });

    this.clearAllBtn.addEventListener("click", () => {
      this.todos = [];
      this.render();
    });
  }

  private addTodo(text: string): void {
    const trimmed = text.trim();
    if (trimmed === "") return;
    const todo: Todo = { id: this.nextId++, text: trimmed, completed: false };
    this.todos = [...this.todos, todo];
    this.render();
  }

  private toggleTodo(id: number): void {
    this.todos = this.todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    this.render();
  }

  private deleteTodo(id: number): void {
    this.todos = this.todos.filter((t) => t.id !== id);
    this.render();
  }

  private editTodo(id: number, newText: string): void {
    const trimmed = newText.trim();
    if (trimmed === "") {
      this.deleteTodo(id);
      return;
    }
    this.todos = this.todos.map((t) =>
      t.id === id ? { ...t, text: trimmed } : t
    );
    this.render();
  }

  private getVisibleTodos(): Todo[] {
    if (this.filter === "active") return this.todos.filter((t) => !t.completed);
    if (this.filter === "completed") return this.todos.filter((t) => t.completed);
    return this.todos;
  }

  private startEditing(todo: Todo, li: HTMLLIElement, textEl: HTMLSpanElement): void {
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = todo.text;
    li.replaceChild(editInput, textEl);
    editInput.focus();

    let finished = false;
    const finish = (save: boolean): void => {
      if (finished) return;
      finished = true;
      if (save) this.editTodo(todo.id, editInput.value);
      else this.render();
    };

    editInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") finish(true);
      if (e.key === "Escape") finish(false);
    });
    editInput.addEventListener("blur", () => finish(true));
  }

  private render(): void {
    this.list.innerHTML = "";

    for (const todo of this.getVisibleTodos()) {
      const li = document.createElement("li");
      li.className = "todo-item" + (todo.completed ? " completed" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => this.toggleTodo(todo.id));

      const textEl = document.createElement("span");
      textEl.className = "text";
      textEl.textContent = todo.text;
      textEl.addEventListener("dblclick", () => this.startEditing(todo, li, textEl));

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "🗑";
      deleteBtn.addEventListener("click", () => this.deleteTodo(todo.id));

      li.append(checkbox, textEl, deleteBtn);
      this.list.appendChild(li);
    }

    const left = this.todos.filter((t) => !t.completed).length;
    this.itemsLeft.textContent = `${left} item${left === 1 ? "" : "s"} left`;

    this.filterButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === this.filter);
    });
  }
}

new TodoApp();