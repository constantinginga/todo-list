export {
    projectFactory,
    addProject,
    checkProjectName
}
import {
    todoFactory
} from './todos';



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



function addProject(projects, name, todo) {

    // add to inbox by default
    projects[0].add(todoFactory(...todo));

    if (!name || name === undefined || name === 'inbox') return;


    for (let project of projects) {
        if (project.name === name) {
            project.add(todoFactory(...todo));
            return;
        }
    }

    // if project is non-existent, create new one
    projects.push(projectFactory(name));
    projects[projects.length - 1].add(todoFactory(...todo));
}


function checkProjectName(projects, name) {

    // check if name is a project format
    let bool = false;
    if (name.charAt(name.length - 1) != '/' || name.indexOf('--') != -1) return bool;
    name = name.slice(0, -1);

    for (let project of projects) {
        if (project.name === name) {
            bool = true;
            break;
        }
    }

    // if project doesn't exist, create it
    if (!bool) projects.push(projectFactory(name));
    return bool;
}