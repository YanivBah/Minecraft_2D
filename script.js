// Start Menu Gone
const startButton = document.querySelector('.btn-1');
startButton.addEventListener('click', () => console.log('Working!'));

// Game Database
const database = {
  var: {
    currentTool: '',

  },
  tools: ['pickaxe','axe','shovel'],
  blocks: {},
  inventory: {},
  settings: {
    theme: '',
    width: '',
    height: '',
    world: '',
  },
  functions: {
    generateWorld: (e) => {},
    mineable: (e) => {},
    placeable: (e) => {},
    pickTool: (e) => {
      const index = [...e.target.parentElement.children].indexOf(e.target);
      database.var.currentTool = database.tools[index];
      console.warn('currentTool = ' + database.var.currentTool);
    },
    pickBlock: (e) => {},
    updateInventory: (e) => {},


  }
};

// Toolbar
const tools = document.querySelectorAll('.tool');
tools.forEach(tool => tool.addEventListener('click', database.functions.pickTool))