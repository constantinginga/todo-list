export {
    projectFactory,
    addToProject,
    checkProjectName
}
import {
    todoFactory,
    isExistingTodo
} from './todos';
import {
    addProjectToSidebar
} from './displayController';

const MAX_PROJECTS = 6;
const MAX_PROJECTS_ERROR = 'error, number of projects exceeded (max 5)';

const proto = {
    add(todo) {
        this.content.push(todo)
    }
}


const projectFactory = (name) => {

    const obj = Object.create(proto);
    obj.name = name;
    obj.content = [];

    return obj;
}



function addToProject(projects, name, todo) {

    todo = todoFactory(...todo);

    // add to inbox by default
    if (!isExistingTodo(projects[0].content, todo)) projects[0].add(todo);

    if (!name || name === undefined || name === 'inbox') return;

    for (let project of projects) {
        if (project.name === name) {
            if (!isExistingTodo(project.content, todo)) project.add(todo);
            return;
        }
    }

    // if project is non-existent, create it
    if (projects.length < MAX_PROJECTS) {
        projects.push(projectFactory(name));
        projects[projects.length - 1].add(todo);
        addProjectToSidebar(name);
    } else return MAX_PROJECTS_ERROR;
}


function checkProjectName(projects, name) {

    // check if name is a project format
    let project = null;
    if (name.charAt(name.length - 1) != '/' || name.indexOf('--') != -1) return project;
    name = name.slice(0, -1);

    for (let item of projects) {
        if (item.name === name) {
            project = item.content;
            break;
        }
    }

    // if project is non-existent, create it
    if (project == null) {
        if (projects.length < MAX_PROJECTS) {
            projects.push(projectFactory(name));
            addProjectToSidebar(name);
        } else project = MAX_PROJECTS_ERROR;
    }
    return project;
}