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
    addProject,
    checkProjectName
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
        let existingProject = checkProjectName(projects, input);

        if (input === 'doc') {
            generateInstructions(parent);
        } else if (existingProject != null) {
            generateTodos(existingProject, parent);
        } else {
            input = formatUserInput(input);

            if (typeof input == 'string') {
                generateError(input, parent);
            } else {
                // separate project name from input
                let projectName = input[1];
                input.splice(1, 1);
                addProject(projects, projectName, input);
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