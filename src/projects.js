export {
    projectFactory,
    addProject
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

    // if project exists, add todo
    projects.forEach(project => {
        if (project.name === name) {
            project.add(todoFactory(...todo));
            return;
        }
    });

    // if project is non-existent, create new one
    projects.push(projectFactory(name));
    projects[projects.length - 1].add(todoFactory(...todo));
}