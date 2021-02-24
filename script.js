// Start Menu Gone
const startButton = document.querySelector('.btn-1');
startButton.addEventListener('click', () => console.log('Working!'));

// Game Database
const database = {
  var: {
    currentTool: '',

  },
  tools: ['pickaxe','axe','shovel'],
  blocks: {
    pickaxe: ['cobblestone'],
    axe: ['wood', 'leaves'],
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
    generateWorld: (e) => {},
    mineable: (e) => {
      // Get what the clicked block type is
      const blockType = e.target.getAttribute('data-block-type');
      const currentTool = database.var.currentTool;
      // Check that the block mineable by the current tool
      if (currentTool) {
        return database.blocks[currentTool].indexOf(blockType) >= 0 ? console.log('Mineable:',true) : console.log('Mineable:',false);
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

// Toolbar
const tools = document.querySelectorAll('.tool');
tools.forEach(tool => tool.addEventListener('click', database.functions.pickTool));
document.querySelector('.blocktest').addEventListener('click', database.functions.mineable);