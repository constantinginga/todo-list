import moment from 'moment';
import { todoFactory, isExistingTodo } from './todos';
import { addToSidebar } from './displayController';

export { projectFactory, addToProject, checkProjectName, fillProjectName };

const MAX_PROJECTS = 8;
const MAX_PROJECTS_ERROR = 'error, number of projects exceeded (max 5)';
const MAX_PROJECTS_LENGTH = 50;
const MAX_PROJECTS_LENGTH_ERROR = 'error, project name is too long';

const proto = {
  add(todo) {
    this.content.push(todo);
  },
};

const projectFactory = (name) => {
  const obj = Object.create(proto);
  obj.name = name;
  obj.content = [];

  return obj;
};

function addToProject(projects, name, todo) {
  todo = todoFactory(...todo);

  // add to inbox by default
  if (!isExistingTodo(projects[0].content, todo)) projects[0].add(todo);
  // if todo has a valid dueDate
  if (moment(todo.dueDate, 'DD.MM.YYYY', true).isValid()) {
    const today = moment(moment(), 'DD.MM.YYYY');
    const dueDate = moment(todo.dueDate, 'DD.MM.YYYY');
    // if dueDate is the same as today's date
    if (
      !isExistingTodo(projects[1].content, todo) &&
      dueDate.day() === today.day() &&
      dueDate.month() === today.month() &&
      dueDate.year() === today.year()
    ) {
      projects[1].add(todo);
    }
    // if dueDate is after today's date
    else if (
      !isExistingTodo(projects[2].content, todo) &&
      dueDate.isAfter(today)
    ) {
      projects[2].add(todo);
    }
  }

  if (
    !name ||
    name === undefined ||
    name === 'inbox' ||
    name === 'today' ||
    name === 'upcoming' ||
    name.slice(0, 3) === 'rm '
  ) {
    return;
  }

  for (const project of projects) {
    if (project.name === name) {
      if (!isExistingTodo(project.content, todo)) project.add(todo);
      return;
    }
  }

  // if project is non-existent, create it
  if (projects.length < MAX_PROJECTS) {
    if (name.length < MAX_PROJECTS_LENGTH) {
      projects.push(projectFactory(name));
      projects[projects.length - 1].add(todo);
      addToSidebar(name);
    } else return MAX_PROJECTS_LENGTH_ERROR;
  } else return MAX_PROJECTS_ERROR;
}

function checkProjectName(projects, name) {
  // check if name is a project format
  let project = null;
  if (name.charAt(name.length - 1) !== '/' || name.indexOf('--') !== -1) {
    return project;
  }
  name = name.slice(0, -1);

  for (const item of projects) {
    if (item.name === name) {
      project = item.content;
      break;
    }
  }

  // if project is non-existent, create it
  if (project == null && name.slice(0, 3) !== 'rm ') {
    if (projects.length < MAX_PROJECTS) {
      if (name.length < MAX_PROJECTS_LENGTH) {
        projects.push(projectFactory(name));
        addToSidebar(name);
      } else project = MAX_PROJECTS_LENGTH_ERROR;
    } else project = MAX_PROJECTS_ERROR;
  }
  return project;
}

// TAB completion
function fillProjectName(projects, sequence) {
  const projectName = [];
  let i = 0;

  if (sequence.slice(0, 3) === 'rm ' && sequence.length > 3) {
    sequence = sequence.slice(3);
    // skip over default non-removable projects (inbox, today, upcoming)
    i = 3;
  }

  for (i; i < projects.length; i++) {
    if (projects[i].name.slice(0, sequence.length) === sequence) {
      projectName.push({
        name: projects[i].name,
      });
    }
  }

  return projectName;
}
