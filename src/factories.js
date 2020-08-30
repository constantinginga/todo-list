export {
    todoFactory,
    projectFactory
};

const todoFactory = (title, desc, dueDate, priority) => {
    return {
        title,
        desc,
        dueDate,
        priority
    };
}

const projectFactory = (title) => {
    return {
        title
    };
}