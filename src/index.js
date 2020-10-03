import {
    formatUserInput,
    removeProp,
    removeItem
} from './todos';
import {
    generateInstructions,
    generateError,
    generateTodos,
    clearScreen
} from './displayController';
import {
    projectFactory,
    addToProject,
    checkProjectName
} from './projects';
import './style.css';


const inputBox = document.querySelector('#todo-input');
const parent = document.querySelector('#instructions');
inputBox.addEventListener('keydown', newInput);
const projects = [projectFactory('inbox'), projectFactory('today'), projectFactory('upcoming')];
let previousInputs = [],
    keyPressed = 0;


function newInput(e) {
    if (e.key.toLowerCase() === 'enter') {
        clearScreen(parent);
        // store previous inputs
        if (inputBox.value) previousInputs.unshift(inputBox.value);
        // reset array index
        keyPressed = 0;

        let input = inputBox.value.trim();
        let existingProject = checkProjectName(projects, input);
        inputBox.value = '';

        if (input === 'doc') {
            generateInstructions(parent);
        } else if (input.slice(0, 3) === 'rm ') {
            removeItem(input, projects);
        } else if (existingProject != null) {
            // check if a project with that name already exists
            (typeof existingProject == 'string') ? generateError(existingProject, parent): generateTodos(existingProject, parent);
        } else {
            input = formatUserInput(input);
            // if any todo properties have a wrong format
            if (typeof input == 'string') {
                generateError(input, parent);
            } else {
                // separate project name from input
                const projectName = input[1];
                input.splice(1, 1);
                // if max numbers of projects hasn't been reached, add todos to project
                const newProject = addToProject(projects, projectName, input);
                if (typeof newProject == 'string') generateError(newProject, parent);
            }

            // remove empty properties from todos
            projects.forEach(project => {
                for (let obj of project.content) {
                    removeProp(obj);
                }
            });

        }

        console.log(projects);
    } else if (e.ctrlKey && e.key === 'l') {
        // disable default browser behavior
        e.preventDefault();
        clearScreen(parent);
    } else if (previousInputs.length && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        // prevent cursor from changing positions
        e.preventDefault();

        // determine current array index
        if (e.key === 'ArrowUp' && keyPressed < previousInputs.length) keyPressed++
        else if (e.key === 'ArrowDown' && keyPressed > 0 && keyPressed <= previousInputs.length) keyPressed--;

        // show corresponding element
        if (e.key === 'ArrowDown' && keyPressed === 0) inputBox.value = '';
        else inputBox.value = previousInputs[keyPressed - 1];
    }
}