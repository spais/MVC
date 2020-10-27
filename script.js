class Model {
    constructor() {

        this.todos = JSON.parse(localStorage.getItem('todos')) || [];

    }

    bindTodoListChanged(callback) {
        this.onTodoListChanged = callback;
    }

    _commit(todos) {
        this.onTodoListChanged(todos);
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    addTodo(todoText) {
        const todo = {
            id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1, text: todoText, complete: false,
        };

        this.todos.push(todo);
    }

    // Used to map through every todos and replaces the text of the todo with the specified id
    editTodo(id, updatedText) {
        this.todos = this.todos.map((todo) =>
        todo.id === id ? {id: todo.id, text: updatedText, complete: todo.complete} : todo
        );
    }

    // Filter a todo out of the array by id
    deleteTodo(id) {
        this.todos = this.todos.filter((todo) => todo.id !== id);

        this._commit(this.todos);
    }

    // Flip the complete boolean on the specified todo
    toggleTodo(id) {
        this.todos = this.todos.map((todo) =>
        todo.id === id ? {id: todo.id, text: todo.text, complete: !todo.complete} : todo
        );
    }

}

class View {
    constructor() {
        // root
        this.app = this.getElement('#root');

        // title
        this.title = this.createElement('h1');
        this.title.textContent = 'Todos';

        // form
        this.form = this.createElement('form');
        this.input = this.createElement('input');
        this.input.type = 'text';
        this.input.placeholder = 'Add todo';
        this.input.name = 'todo';
        this.submitButton = this.createElement('button');
        this.submitButton.textContent = 'Submit';

        // visual
        this.todoList = this.createElement('ul', 'todo-list');

        // append input and submit button to form
        this.form.append(this.input, this.submitButton);

        // append title, form, and todo list to app
        this.app.append(this.title, this.form, this.todoList);
    }

    get _todoText() {
        return this.input.value;
    }

    _resetInput() {
        this.input.value = '';
    }

    createElement(tag, className) {
        const element = document.createElement(tag);
        if (className) element.classList.add(className);

        return element;
    }

    // Retrieve an element from the DOM
    getElement(selector) {
        const element = document.querySelector(selector);

        return element;
    }

    displayTodos(todos) {
        // Delete all nodes
        while (this.todoList.firstChild) {
            this.todoList.removeChild(this.todoList.firstChild);
        }

        // Show default
        if (todos.length === 0) {
            const p = this.createElement('p');
            p.textContent = 'Nothing to do! Add a task?';
            this.todoList.append(p);
        } else {
            // Create todo item nodes for each todo in state
            todos.forEach(todo => {
                const li = this.createElement('li');
                li.id = todo.id;

                // Create a toggle checkbox for each todo item
                const checkbox = this.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = todo.complete;

                // todo item text will be in a contenteditable span
                const span = this.createElement('span');
                span.contentEditable = true;
                span.classList.add('editable');

                //Create strikethrough for completed todos
                if (todo.complete) {
                    const strike = this.createElement('s');
                    strike.textContent = todo.text;
                    span.append(strike);
                } else {
                    // otherwise 
                    span.textContent = todo.text;
                }

                // Delete button for todos
                const deleteButton = this.createElement('button', 'delete');
                deleteButton.textContent = 'Delete';
                li.append(checkbox, span, deleteButton);

                // Append nodes to the todo list
                this.todoList.append(li);
            })
        }
    }

    bindAddTodo(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault();

            if (this._todoText) {
                handler(this._todoText);
                this._resetInput;
            }
        });
    }

    bindDeleteTodo(handler) {
        this.todoList.addEventListener('click', event => {
            if (event.target.className === 'delete') {
                const id = parseInt(event.target.parentElement.id);
      
                handler(id);
            }
        });
    }

    bindToggleTodo(handler) {
        this.todoList.addEventListener('change', event => {
            if (event.target.type === 'checkbox') {
                const id = parseInt(event.target.parentElement.id);
      
                handler(id);
            }
        });
    }

}

class Controller {
    constructor (model, view) {
        this.model = model;
        this.view = view;

        this.view.bindAddTodo(this.handleAddTodo);
        this.view.bindDeleteTodo(this.handleDeleteTodo);
        this.view.bindToggleTodo(this.handleToggleTodo);
        // this.view.bindEditTodo(this.handleEditTodo);

        // Display initial todos
        this.onTodoListChanged(this.model.todos);
    }

    onTodoListChanged = (todos) => {
        this.view.displayTodos(todos);
    }

    handleAddTodo = (todoText) => {
        this.model.addTodo(todoText);
    }

    handleEditTodo = (id, todoText) => {
        this.model.deleteTodo(id);
    }

    handleToggleTodo = (id) => {
        this.model.toggleTodo(id);
    }

}

const app = new Controller(new Model(), new View());