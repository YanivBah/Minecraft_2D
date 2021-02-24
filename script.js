// Game Database
const database = {
  var: {
    currentTool: '',

  },

  tools: ['pickaxe','axe','shovel'],

  blocks: {
    pickaxe: ['cobblestone'],
    axe: ['tree', 'leaves'],
    shovel: ['dirt','grass'],
  },

  inventory: {},

  settings: {
    theme: '',
    width: '',
    height: '',
    world: '',
  },

  functions: {
    generateWorld: (e) => {
      const height = database.settings.height || 40;
      const width = database.settings.width || 40;
      const div = document.createElement('div');
      div.classList.add('block');
      const world = document.querySelector('.world');
      for (let row = 1; row <= height;row++) {
        for (let col = 1; col <= width;col++) {
          const block = div.cloneNode(true);
          block.setAttribute('row',row);
          block.setAttribute('col',col);
          // block.setAttribute('data-block-type','dirt');
          world.appendChild(block);
        }
      }
    },

    mineable: (e) => {
      // Get what the clicked block type is
      const blockType = e.target.getAttribute('data-block-type');
      const currentTool = database.var.currentTool;
      // Check that the block mineable by the current tool
      const ableToMine = database.blocks[currentTool].indexOf(blockType);
      if (currentTool) {
        return ableToMine >= 0 ? console.warn('Mineable:',true) : console.warn('Mineable:',false);
      }
    },

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

// Start Menu Gone
const startButton = document.querySelector('.btn-1');
startButton.addEventListener('click', database.functions.generateWorld);

// Toolbar
const tools = document.querySelectorAll('.tool');
tools.forEach(tool => tool.addEventListener('click', database.functions.pickTool));
// document.querySelector('.blocktest').addEventListener('click', database.functions.mineable);