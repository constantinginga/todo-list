export {
    projectFactory
}


const projectFactory = (name) => {

    const content = [];
    const add = (todo) => content.push(todo);

    return {
        name,
        content,
        add
    };
}