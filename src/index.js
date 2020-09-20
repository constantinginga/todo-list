import {
    formatUserInput,
    removeProp
} from './todos';
import {
    generateInstructions,
    generateError,
    clearScreen
} from './displayController';
import {
    projectFactory,
    addProject
} from './projects';
import './style.css';


const inputBox = document.querySelector("#todo-input");
const parent = document.querySelector('#instructions');
inputBox.addEventListener('keydown', newInput);
const projects = [projectFactory('inbox')];



function newInput(e) {
    if (e.key.toLowerCase() === 'enter') {

        let input = inputBox.value.trim();
        inputBox.value = '';

        if (input === 'doc') {
            generateInstructions(parent);
        } else if ( /*check for project folder */ false) {

        } else {
            input = formatUserInput(input);

            if (input.includes('error')) {
                generateError(input, parent);
            } else {
                // separate project name from input
                let projectName = input[1];
                input.splice(1, 1);
                addProject(projects, projectName, input);
            }

            projects.forEach(project => removeProp(project.content));
            console.log(projects);
        }
    } else if (e.ctrlKey && e.key === 'l') {
        // disable browser shortcut
        e.preventDefault();
        clearScreen(parent);
    }
}