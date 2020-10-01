import {
    formatUserInput,
    removeProp
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


const inputBox = document.querySelector("#todo-input");
const parent = document.querySelector('#instructions');
inputBox.addEventListener('keydown', newInput);
const projects = [projectFactory('inbox'), projectFactory('today'), projectFactory('upcoming')];



function newInput(e) {
    if (e.key.toLowerCase() === 'enter') {

        let input = inputBox.value.trim();
        inputBox.value = '';
        let existingProject = checkProjectName(projects, input);

        if (input === 'doc') {
            generateInstructions(parent);
        } else if (existingProject != null) {
            (typeof existingProject == 'string') ? generateError(existingProject, parent): generateTodos(existingProject, parent);
        } else {
            input = formatUserInput(input);

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
        // disable browser shortcut
        e.preventDefault();
        clearScreen(parent);
    }
}