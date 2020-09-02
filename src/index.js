import {
    todoFactory,
    formatUserInput
} from './todos';
import './style.css';

let todo1 = todoFactory('test', 'asdasdas', '2020', 'important');


const inputBox = document.querySelector("#todo-txt");

inputBox.addEventListener('keypress', newTodo);


function newTodo(e) {
    if (e.key.toLowerCase() === 'enter') {
        // format user string (function)
        let userInput = formatUserInput(inputBox.value);
        if (userInput === undefined) {
            console.log('Error. Incorrect usage.');
        } else {
            console.log(userInput);
        }
        // create new todo object (function)

    }
}