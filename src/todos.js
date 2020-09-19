import moment from 'moment';
export {
    todoFactory,
    formatUserInput
};


/* to-do:
    type inbox/, today/, etc. and use typewriter effect to show task in that project
    think of a way to add task to a project
    edit task_name fills input with task string, letting user to edit it.
    as new projects are created/deleted, add/remove them to sidebar*/

const todoFactory = (title, desc, dueDate, priority) => {
    return {
        title,
        desc,
        dueDate,
        priority
    };
}


function formatUserInput(input, index) {

    if (input[0] === '-' && input[1] === '-' || !input) return 'error, title is missing';

    // isolate args
    let argsString = input.slice(index);
    // separate title from args
    const title = input.slice(0, index).trim();
    // clean up args and split into array
    let formattedInput = argsString.split('--');
    console.log(formattedInput);
    // remove title
    formattedInput.shift();

    const check = checkArgs(formattedInput);
    // if there is an error, return it
    if (check.includes('error')) {
        return check;
    } else {
        // sort args
        if (formattedInput.length === 3) formattedInput = sortArgs(formattedInput);
        // add title to array start
        formattedInput.unshift(title);
        return formattedInput;
    }
}



function checkArgs(args) {

    // letters, numbers and spaces
    const regex = /[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/g,
        count = {
            priority: 0,
            date: 0,
            description: 0
        };

    for (let i = 0; i < args.length; i++) {
        args[i] = args[i].trim();

        if (!args[i]) args.splice(i, 1);

        // check for correct argument format
        if (args.length && args[i]) {
            if ((args[i].includes('#') && args[i].length > 3) && !moment(args[i], 'DD.MM.YYYY', true).isValid() &&
                !args[i].match(regex)) return 'error, wrong argument format';
        }
    }

    if (args.length > 3) return 'error, number of arguments exceeded';

    if (args.length === 3) {

        // check for duplicates
        for (let item of args) {
            if (item.includes('#') && !item.match(regex)) {
                count.priority++;
            } else if (item.match(regex) && !moment(item, 'DD.MM.YYYY', true).isValid()) {
                count.description++;
            } else if (moment(item, 'DD.MM.YYYY', true).isValid()) {
                count.date++;
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
        if (item.includes('#')) sorted[0] = item
        else if (moment(item, 'DD.MM.YYYY', true).isValid()) sorted[1] = item
        else sorted[2] = item;
    }

    return sorted;
}