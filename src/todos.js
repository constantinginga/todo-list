export {
    todoFactory,
    formatUserInput
};


/* to-do: check for correct date format (use library)
animate usage text with typewriter effect (use library), them autofocus on input
make dollar sign just outside of input
type inbox/, today/, etc. and use typewriter effect to show task in that project
if already in that project, print error 
think of a command to add projects
as new projects are created, add them to sidebar*/

const todoFactory = (title, desc, dueDate, priority) => {
    return {
        title,
        desc,
        dueDate,
        priority
    };
}


function formatUserInput(input) {
    input = input.trim();
    const indexOfArgs = input.indexOf('--');

    if (input[0] === '-' && input[1] === '-' || !input) {
        return;
    } else if (indexOfArgs === -1 && input) {
        return [input];
    } else return formatArgs(input, indexOfArgs);
}


function formatArgs(input, index) {
    // isolate args
    let argsString = input.slice(index);
    // separate desc and title from args
    const desc = argsString.substring(argsString.lastIndexOf('--')),
        title = input.slice(0, index).trim();
    // remove desc from args
    argsString = argsString.replace(desc, '').trim();
    // clean up args and split into array
    let formattedInput = argsString.replace(/--/g, '').split(' ');

    if (formattedInput.length > 2) return;

    // order args in the correct order
    orderArgs(formattedInput);

    // add title to array start
    formattedInput.unshift(title);
    // add desc to array end
    formattedInput.push(desc.replace('--', ''));
    return formattedInput;
}



function orderArgs(args) {
    if (args.length != 1) {
        for (let i = 0; i < args.length; i++) {
            // remove white space from each arg
            args[i] = args[i].trim();

            if (args[i][0] === '#') {

                // if there are too many hashtags
                if (args[i].length > 3) return;

                // if priority is second, reorder array
                if (args.indexOf(args[i])) {
                    [args[i - 1], args[i]] = [args[i], args[i - 1]];
                }
            }
        }
        // if array contains an empty string
    } else if (!args[0]) {
        args.pop();
    }
}