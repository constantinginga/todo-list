import Typed from 'typed.js';

export {
  generateInstructions,
  generateTodos,
  generateProjects,
  generateMessage,
  addToSidebar,
  removeFromSidebar,
  typeParas,
  clearScreen,
};

const paras = require('./instructions.json').instructions;

const MAX_NAME_LENGTH = 16;

function generateInstructions(parent) {
  clearScreen(parent);

  for (let i = 0; i < paras.length; i++) {
    if (paras[i].length) {
      const div = document.createElement('div');
      div.id = 'cmds';

      for (let j = 0; j < paras[i].length; j++) {
        createParas(paras[i][j].text, paras[i][j].class, div);
      }

      parent.appendChild(div);
    } else {
      createParas(paras[i].text, paras[i].class, parent);
    }
  }

  typeParas(parent);
}

function generateTodos(content, parent) {
  clearScreen(parent);

  if (!content.length) generateMessage('project is empty...', parent);

  for (const obj of content) {
    let todoString = '';

    // convert todo object into string
    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        todoString += `${obj[prop]} `;
      }
    }
    // remove extra space at the end
    todoString.trim();
    createParas(todoString, '', parent);
  }

  typeParas(parent);
}

function generateProjects(projects, parent) {
  let str = '';
  for (const project of projects) {
    str += `${project.name}/  `;
  }

  // remove spaces from string end
  generateMessage(str.slice(0, -2), parent);
}

function truncateProjectName(name) {
  if (name.length > MAX_NAME_LENGTH) {
    return `${name.slice(0, MAX_NAME_LENGTH)}...`;
  }
  return name;
}

// add project name to sidebar
function addToSidebar(name) {
  const sidebar = document.querySelector('#sections');
  const div = document.createElement('div');
  div.innerHTML = truncateProjectName(name);
  div.classList.add('section');
  sidebar.appendChild(div);
}

// remove project name from sidebar
function removeFromSidebar(name) {
  const sidebar = document.querySelector('#sections');
  [...sidebar.childNodes].forEach((elem) => {
    if (elem.innerHTML === truncateProjectName(name)) sidebar.removeChild(elem);
  });
}

function createParas(text, cls, parent) {
  const p = document.createElement('p');
  p.innerHTML = text;
  if (cls) p.classList.add(cls);
  p.style.display = 'none';
  parent.appendChild(p);
}

function typeParas(parent) {
  const ps = [...parent.childNodes];
  ps.forEach((elem, i) => {
    setTimeout(() => {
      if (elem.childNodes.length > 1) {
        elem.style.display = 'flex';
        elem = [...elem.childNodes];
        elem.forEach((p) => createTypingEffect(p));
      } else {
        createTypingEffect(elem);
      }
    }, i * 1500);
  });
}

function createTypingEffect(elem) {
  elem.style.display = 'block';
  elem.scrollIntoView();
  const text = elem.innerHTML;
  elem.innerHTML = '';
  const typed = new Typed(elem, {
    strings: [text],
    typeSpeed: 20,
    backDelay: 750,
    loop: false,
    loopCount: false,
    showCursor: false,
  });
}

function generateMessage(text, parent) {
  const msg = document.createElement('p');
  msg.innerHTML = text;
  parent.appendChild(msg);
  msg.scrollIntoView();
}

function clearScreen(parent) {
  parent.innerHTML = '';
}
