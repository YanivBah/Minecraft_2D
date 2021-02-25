// Game Database
const database = {
  var: {
    currentTool: '',
    currentBlock: '',

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
      if(document.querySelectorAll('.block')) {
        document.querySelectorAll('.block').forEach(e => e.remove());
      }
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

    generateSky: (e) => {
      let number = database.functions.randomNumber(16,30);
      for (let row = 1;row <= number;row++) {
        const current = document.querySelectorAll(`.block[row="${row}"`);
        current.forEach(el => el.setAttribute('data-block-type', 'sky'));
      }
    },

    generateCloud: (height = 4) => {
      const skyBlocks = document.querySelectorAll('.block[data-block-type="sky"]');
      let number = skyBlocks[skyBlocks.length - 1].getAttribute('row');
      let startRow = parseInt(number/4);
      number = database.functions.randomNumber(2,26);
      let number2 = 10;
      for (let row = startRow; row > startRow-height; row--) {
        for (let col = number; col < number+number2; col++) {
          const current = document.querySelector(`.block[col="${col}"][row="${row}"]`);
          current.setAttribute('data-block-type', 'cloud');
        }
        number2-=2;
        number++;
      }
      // number = skyBlocks[skyBlocks.length - 1].getAttribute('row');
      // startRow = parseInt(number/3);
      // number = database.functions.randomNumber(2,26);
      // for (let row = startRow; row > startRow-height; row--) {
      //   for (let col = number; col < number+number2; col++) {
      //     const current = document.querySelector(`.block[col="${col}"][row="${row}"]`);
      //     current.setAttribute('data-block-type', 'cloud');
      //   }
      //   number2-=2;
      //   number++;
      // }
    },

    generateGrass: () => {
      const skyBlocks = document.querySelectorAll('.block[data-block-type="sky"]');
      let startRow = skyBlocks[skyBlocks.length - 1].getAttribute('row');
      let randomize = [database.functions.randomNumber(2,39),database.functions.randomNumber(2,39),database.functions.randomNumber(2,39),database.functions.randomNumber(2,39)];
      for (let col = 1; col <= 40;col++) {
        const current = document.querySelector(`.block[col="${col}"][row="${startRow}"]`);
        current.setAttribute('data-block-type','grass');
        col === randomize[0] ? startRow -=2 : '';
        col === randomize[1] ? startRow++ : '';
        col === randomize[2] ? startRow-- : '';
      }
    },

    generateDirt: () => {
      const grassBlock = document.querySelectorAll('.block[data-block-type="grass"]');
      for (let count = 1; count <= 6; count++) {
        for (let index = 0; index < grassBlock.length ;index++) {
          const currentRow = Number(grassBlock[index].getAttribute('row'));
          const currentCol = grassBlock[index].getAttribute('col');
          const dirtBlock = document.querySelector(`.block[col="${currentCol}"][row="${currentRow+count}"]`);
          dirtBlock.setAttribute('data-block-type','dirt');
        }
      }
    },

    listeners: () => {
      const blocks = document.querySelectorAll('.block');
      blocks.forEach(e => e.addEventListener('click', database.functions.mineBlock));
    },

    mineable: (e) => {
      if (database.var.currentTool) {
        // Get what the clicked block type is
        const blockType = e.target.getAttribute('data-block-type');
        const currentTool = database.var.currentTool;
        // Check that the block mineable by the current tool
        const ableToMine = database.blocks[currentTool].indexOf(blockType);
        console.log('Test');
        return ableToMine >= 0 ? true : false;
      }
    },

    mineBlock: (e) => {
      if (database.functions.mineable(e)) {
        const current = e.target;
        current.setAttribute('data-block-type','sky');
      }
    },

    placeable: (e) => {
      if (currentBlock && e.target.getAttribute('data-block-type') === 'sky') {

      }
    },

    pickTool: (e) => {
      const index = [...e.target.parentElement.children].indexOf(e.target);
      database.var.currentTool = database.tools[index];
      console.warn('currentTool = ' + database.var.currentTool);
    },

    pickBlock: (e) => {
      // remove Current Tool selected
      database.var.currentTool = '';
      // add Current Block
      database.var.currentBlock = '';
    },

    updateInventory: (e) => {},

    randomNumber: (min,max) => parseInt(Math.random() * (max - min) + min),
    randomFloatNumber: (min,max) => (Math.random() * (max - min) + min).toFixed(2),
  }
};

// Start Menu Gone
const startButton = document.querySelector('.btn-1');
startButton.addEventListener('click', el => {
  database.functions.generateWorld(el);
  database.functions.generateSky(el);
  database.functions.generateCloud(database.functions.randomNumber(2,4));
  database.functions.generateGrass();
  database.functions.generateDirt();
  database.functions.listeners();
});

const start = () => {
  database.functions.generateWorld();
  database.functions.generateSky();
  database.functions.generateCloud(database.functions.randomNumber(2,4));
  database.functions.generateCloud(database.functions.randomNumber(1,3));
  database.functions.generateDirt();
}

// Toolbar
const tools = document.querySelectorAll('.tool');
tools.forEach(tool => tool.addEventListener('click', database.functions.pickTool));
const listen = () => {
  document.querySelectorAll('.block').forEach(e => {
  e.addEventListener('click', database.functions.mineBlock);
});
}
// document.querySelector('.blocktest').addEventListener('click', database.functions.mineable);