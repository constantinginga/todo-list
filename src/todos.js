import moment from 'moment';
import _ from 'lodash';
export {
    todoFactory,
    formatUserInput,
    removeProp,
    isExistingTodo
};


/* to-do:
    make checkprojectname return the project object
    inside index, print out the project's contents with typewriter effect
    edit task_name fills input with task string, letting user to edit it.
    implement remove feature
    make website responsive (remove sidebar)
    as new projects are created/deleted, add/remove them to sidebar*/


const descRegex = /[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/g;
const priorityRegex = /^[#]{1,3}$/g;

const todoFactory = (title, priority, dueDate, desc) => {
    return {
        title,
        priority,
        dueDate,
        desc
    };
}


function formatUserInput(input) {

    const index = input.indexOf('--');
    // check for missing title case or no args case
    if (input[0] === '-' && input[1] === '-' || !input) return 'error, title is missing'
    else if (index == -1 && input.indexOf('/') == -1) return [input]
    else if (index == -1 && input.charAt(input.length - 1) == '/') return `created new project "${input.slice(0, -1)}"`;

    // isolate args
    let argsString = input.slice(index);
    // separate title from args
    const title = input.slice(0, index).trim();
    // clean up args and split into array
    let formattedInput = argsString.split('--');
    // remove title
    formattedInput.shift();

    const check = checkArgs(formattedInput);
    // if there is an error, return it
    if (check.includes('error')) {
        return check;
    } else {
        // sort args
        formattedInput = sortArgs(formattedInput);
        // add title to array start
        formattedInput.unshift(title);
        return formattedInput;
    }
}



function checkArgs(args) {

    const count = {
        priority: 0,
        date: 0,
        description: 0,
        project: 0
    };

    for (let i = 0; i < args.length; i++) {
        args[i] = args[i].trim();

        if (!args[i]) args.splice(i, 1);

        // check for correct argument format
        if (args.length && args[i]) {
            if (!args[i].match(priorityRegex) &&
                !moment(args[i], 'DD.MM.YYYY', true).isValid() &&
                !args[i].match(descRegex) && !args[i].charAt(args[i].length - 1)) return 'error, wrong argument format';
        }
    }

    if (args.length > 4) return 'error, number of arguments exceeded';

    if (args.length === 4) {

        // check for duplicates
        for (let item of args) {
            if (item.match(priorityRegex) && !item.match(descRegex)) {
                count.priority++;
            } else if (item.match(descRegex) && !moment(item, 'DD.MM.YYYY', true).isValid()) {
                count.description++;
            } else if (moment(item, 'DD.MM.YYYY', true).isValid()) {
                count.date++;
            } else if (item.charAt(item.length - 1) == '/') {
                count.project++;
            }
        }

        for (let prop in count) {
            if (!count[prop]) return `error, ${prop} is missing.`;
        }
    }

    return 'success';
}



function sortArgs(args) {

    let sorted = [];

    for (let item of args) {
        if (item.charAt(item.length - 1) == '/' && item.indexOf('-') == -1) sorted[0] = item.slice(0, -1);
        else if (item.match(priorityRegex)) sorted[1] = item
        else if (moment(item, 'DD.MM.YYYY', true).isValid()) sorted[2] = item
        else sorted[3] = item;
    }

    return sorted;
}

// removes empty properties from object
function removeProp(obj) {
    for (let prop in obj) {
        if (obj[prop] == undefined) delete obj[prop];
    }
}


// check for duplicate to-do
function isExistingTodo(content, todo) {

    removeProp(todo);
    if (!content.length) return false;

    for (let item of content) {
        if (_.isEqual(todo, item)) return true;
    }

    return false;
}