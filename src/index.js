import {
    formatUserInput,
    removeProp,
    removeItem
} from './todos';
import {
    generateInstructions,
    generateMessage,
    generateProjects,
    generateTodos,
    clearScreen,
    addToSidebar,
    typeParas
} from './displayController';
import {
    projectFactory,
    addToProject,
    checkProjectName,
    fillProjectName
} from './projects';
import './style.css';


const inputBox = document.querySelector('#todo-input');
const parent = document.querySelector('#instructions');
inputBox.addEventListener('keydown', newInput);
let projects = [projectFactory('inbox'), projectFactory('today'), projectFactory('upcoming')],
    previousInputs = [],
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
        } else if (input === 'ls') {
            generateProjects(projects, parent);
            typeParas(parent);
        } else if (input.slice(0, 3) === 'rm ') {
            removeItem(input, projects);
        } else if (existingProject != null) {
            // check if a project with that name already exists
            (typeof existingProject == 'string') ? generateMessage(existingProject, parent): generateTodos(existingProject, parent);
        } else {
            input = formatUserInput(input);
            // if any todo properties have a wrong format
            if (typeof input == 'string') {
                generateMessage(input, parent);
            } else {
                // separate project name from input
                const projectName = input[1];
                input.splice(1, 1);
                // if max numbers of projects hasn't been reached, add todos to project
                const newProject = addToProject(projects, projectName, input);
                if (typeof newProject == 'string') generateMessage(newProject, parent);
            }

            // remove empty properties from todos
            projects.forEach(project => {
                for (let obj of project.content) {
                    removeProp(obj);
                }
            });

        }

        console.log(projects);
        populateStorage();
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
    } else if (e.key === 'Tab') {
        e.preventDefault();
        if (inputBox.value.length) {
            let projectName = fillProjectName(projects, inputBox.value);
            if (projectName.length === 1) {
                let rm = '';
                if (inputBox.value.slice(0, 3) === 'rm ') rm += inputBox.value.slice(0, 3);
                inputBox.value = rm + projectName[0].name + '/';
            } else if (projectName.length > 1) generateProjects(projectName, parent);
        }
        console.log(projects);
    }
}



// save projects array to localStorage
function populateStorage() {
    localStorage.setItem('projects', JSON.stringify(projects));
}



// parse string into array of objects
function retrieveStorage() {
    projects = JSON.parse(localStorage.getItem('projects'));
    projects.forEach(project => Object.setPrototypeOf(project, Object.getPrototypeOf(projectFactory(''))));
}


// populate projects array from localStorage and add projects to sidebar
(!localStorage.getItem('projects')) ? populateStorage(): (retrieveStorage(), projects.forEach(project => addToSidebar(project.name)));