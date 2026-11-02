"use strict";
class TodoApp {
    constructor() {
        this.todos = [];
        this.filter = "all";
        this.nextId = 1;
        this.form = document.getElementById("todo-form");
        this.input = document.getElementById("todo-input");
        this.list = document.getElementById("todo-list");
        this.itemsLeft = document.getElementById("items-left");
        this.clearCompletedBtn = document.getElementById("clear-completed");
        this.clearAllBtn = document.getElementById("clear-all");
        this.filterButtons = document.querySelectorAll(".filter-btn");
        this.bindEvents();
        this.render();
    }
    bindEvents() {
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.addTodo(this.input.value);
            this.input.value = "";
        });
        this.filterButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                this.filter = btn.dataset.filter;
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
    addTodo(text) {
        const trimmed = text.trim();
        if (trimmed === "")
            return;
        const todo = { id: this.nextId++, text: trimmed, completed: false };
        this.todos = [...this.todos, todo];
        this.render();
    }
    toggleTodo(id) {
        this.todos = this.todos.map((t) => t.id === id ? { ...t, completed: !t.completed } : t);
        this.render();
    }
    deleteTodo(id) {
        this.todos = this.todos.filter((t) => t.id !== id);
        this.render();
    }
    editTodo(id, newText) {
        const trimmed = newText.trim();
        if (trimmed === "") {
            this.deleteTodo(id);
            return;
        }
        this.todos = this.todos.map((t) => t.id === id ? { ...t, text: trimmed } : t);
        this.render();
    }
    getVisibleTodos() {
        if (this.filter === "active")
            return this.todos.filter((t) => !t.completed);
        if (this.filter === "completed")
            return this.todos.filter((t) => t.completed);
        return this.todos;
    }
    startEditing(todo, li, textEl) {
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.className = "edit-input";
        editInput.value = todo.text;
        li.replaceChild(editInput, textEl);
        editInput.focus();
        let finished = false;
        const finish = (save) => {
            if (finished)
                return;
            finished = true;
            if (save)
                this.editTodo(todo.id, editInput.value);
            else
                this.render();
        };
        editInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter")
                finish(true);
            if (e.key === "Escape")
                finish(false);
        });
        editInput.addEventListener("blur", () => finish(true));
    }
    render() {
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
