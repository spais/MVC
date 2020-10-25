class Model {
    constructor() {

        // The state of the model with prepopulated array of todos objects
        this.todos = [
            {
                id: 1, 
                text: 'To better understand MVC',  
                complete: false
            },
            {
                id: 2, 
                text: 'Deep dive js prototypes', 
                complete: false
            },
        ];

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
}

class Controller {
    constructor (model, view) {
        this.model = model;
        this.view = view;
        
    }
}

const app = new Controller(new Model(), new View());