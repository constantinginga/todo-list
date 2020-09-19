import {
    todoFactory,
    formatUserInput,
    removeProp
} from './todos';
import {
    generateInstructions,
    generateError,
    clearScreen
} from './displayController';
import {
    projectFactory
} from './projects';
import './style.css';


const inputBox = document.querySelector("#todo-input");
const parent = document.querySelector('#instructions');

inputBox.addEventListener('keydown', newTodo);


const projects = [projectFactory('inbox')];

function newTodo(e) {
    if (e.key.toLowerCase() === 'enter') {

        let input = inputBox.value.trim();
        const indexOfArgs = input.indexOf('--');
        inputBox.value = '';

        if (input === 'doc') {
            generateInstructions(parent);
        } else if ( /*check for project folder */ false) {

        } else {
            input = formatUserInput(input, indexOfArgs);

            if (input.includes('error')) generateError(input, parent)
            else projects[0].add(todoFactory(...input));

            removeProp(projects[0].content);
            console.log(projects[0].content);
        }
    } else if (e.ctrlKey && e.key === 'l') {
        // disable browser shortcut
        e.preventDefault();
        clearScreen(parent);
    }
}