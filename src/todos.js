import moment from 'moment';
import _ from 'lodash';
import { removeFromSidebar } from './displayController';

export { todoFactory, formatUserInput, removeProp, isExistingTodo, removeItem };

const descRegex = /[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/g;
const priorityRegex = /^[#]{1,3}$/g;
const MAX_TITLE_LENGTH = 50;
const MAX_TITLE_LENGTH_ERROR = 'error, title is too long';
const MAX_DESC_LENGTH_ERROR = 'error, description is too long';
const WRONG_FORMAT_ERROR = 'error, wrong argument format';
const MAX_ARGS = 4;
const MAX_ARGS_ERROR = 'error, number of arguments exceeded';

const todoFactory = (title, priority, dueDate, desc) => ({
  title,
  priority,
  dueDate,
  desc,
});

function formatUserInput(input) {
  const index = input.indexOf('--');

  // check for missing title case or no args case
  if ((input[0] === '-' && input[1] === '-') || !input) {
    return 'error, title is missing';
  }
  if (index === -1 && input.indexOf('/') === -1) {
    return input.length > MAX_TITLE_LENGTH ? MAX_TITLE_LENGTH_ERROR : [input];
  }
  if (index === -1 && input.charAt(input.length - 1) === '/') {
    return `created new project "${input.slice(0, -1)}"`;
  }

  // isolate args
  const argsString = input.slice(index);

  // separate title from args
  const title = input.slice(0, index).trim();
  if (title.length > MAX_TITLE_LENGTH) return MAX_TITLE_LENGTH_ERROR;

  // clean up args and split into array
  let formattedInput = argsString.split('--');

  // remove title
  formattedInput.shift();

  const check = checkArgs(formattedInput);
  // if there is an error, return it
  if (check.includes('error')) {
    return check;
  }
  // sort args
  formattedInput = sortArgs(formattedInput);
  // add title to array start
  formattedInput.unshift(title);
  return formattedInput;
}

function checkArgs(args) {
  const count = {
    priority: 0,
    date: 0,
    description: 0,
    project: 0,
  };

  for (let i = 0; i < args.length; i++) {
    args[i] = args[i].trim();

    if (!args[i]) args.splice(i, 1);

    // check for correct argument format
    if (args.length && args[i]) {
      if (
        !args[i].match(priorityRegex) &&
        !moment(args[i], 'DD.MM.YYYY', true).isValid() &&
        !args[i].match(descRegex) &&
        args[i].charAt(args[i].length - 1) !== '/'
      ) {
        return WRONG_FORMAT_ERROR;
      }
    }
  }

  for (const arg of args) {
    if (
      arg.match(descRegex) &&
      !moment(arg, 'DD.MM.YYYY', true).isValid() &&
      arg.length > MAX_TITLE_LENGTH
    ) {
      return MAX_DESC_LENGTH_ERROR;
    }
  }

  if (args.length > MAX_ARGS) return MAX_ARGS_ERROR;

  if (args.length === MAX_ARGS) {
    // check for duplicates
    for (const item of args) {
      if (item.match(priorityRegex) && !item.match(descRegex)) {
        count.priority++;
      } else if (
        item.match(descRegex) &&
        !moment(item, 'DD.MM.YYYY', true).isValid()
      ) {
        count.description++;
      } else if (moment(item, 'DD.MM.YYYY', true).isValid()) {
        count.date++;
      } else if (item.charAt(item.length - 1) == '/') {
        count.project++;
      }
    }

    for (const prop in count) {
      if (!count[prop]) return `error, ${prop} is missing.`;
    }
  }

  return 'success';
}

function sortArgs(args) {
  const sorted = [];

  for (const item of args) {
    if (item.charAt(item.length - 1) === '/' && item.indexOf('-') === -1) {
      sorted[0] = item.slice(0, -1);
    } else if (item.match(priorityRegex)) sorted[1] = item;
    else if (moment(item, 'DD.MM.YYYY', true).isValid()) sorted[2] = item;
    else sorted[3] = item;
  }

  return sorted;
}

// removes empty properties from object
function removeProp(obj) {
  for (const prop in obj) {
    if (obj[prop] === undefined) delete obj[prop];
  }
}

// check for duplicate to-do
function isExistingTodo(content, todo) {
  removeProp(todo);
  if (!content.length) return false;

  for (const item of content) {
    if (_.isEqual(todo, item)) return true;
  }

  return false;
}

function removeItem(input, projects) {
  // separate keyword from item name
  let item = input.trim().substring(input.indexOf(' ')).trim();

  // check if it's a project or a todo
  if (item.charAt(item.length - 1) === '/') {
    item = item.slice(0, item.length - 1);
    /* remove project if it exists
        'i' starts at 3 to skip default projects */
    for (let i = 3; i < projects.length; i++) {
      if (projects[i].name === item) {
        projects.splice(i, 1);
        removeFromSidebar(item);
      }
    }
  } else {
    for (const project of projects) {
      // remove todo if it exists in any project
      for (let i = 0; i < project.content.length; i++) {
        if (project.content[i].title === item) project.content.splice(i, 1);
      }
    }
  }
}
