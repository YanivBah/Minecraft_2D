// Game Database
const database = {
  var: {
    currentTool: '',
    currentBlock: '',
    currentWorld: [],
  },

  tools: ['pickaxe','axe','shovel'],

  blocks: {
    pickaxe: ['cobblestone','diamond'],
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
          block.setAttribute('data-block-type','null');
          world.appendChild(block);
        }
      }
    },

    generateSky: (e) => {
      let number = database.functions.randomNumber(20,30);
      for (let row = 1;row <= number;row++) {
        const current = document.querySelectorAll(`.block[row="${row}"`);
        current.forEach(el => el.setAttribute('data-block-type', 'sky'));
      }
    },

    generateCloud: () => {
      const skyBlocks = document.querySelectorAll('.block[data-block-type="sky"]');
      let number = skyBlocks[skyBlocks.length - 1].getAttribute('row');
      const randomize = [database.functions.randomNumber(2,4),database.functions.randomNumber(2,26),database.functions.randomNumber(2,4)];
      let startRow = parseInt(number/randomize[0]);
      let number2 = 10;
      for (let row = startRow; row > startRow-randomize[2]; row--) {
        for (let col = randomize[1]; col < randomize[1]+number2; col++) {
          const current = document.querySelector(`.block[col="${col}"][row="${row}"]`);
          current.setAttribute('data-block-type', 'cloud');
        }
        number2-=3;
        randomize[1]++;
      }
    },

    generateGrass: () => {
      const skyBlocks = document.querySelectorAll('.block[data-block-type="sky"]');
      let startRow = skyBlocks[skyBlocks.length - 1].getAttribute('row');
      let randomize = [database.functions.randomNumber(2,39),database.functions.randomNumber(2,39),database.functions.randomNumber(2,39),database.functions.randomNumber(2,39)];
      for (let col = 1; col <= 40;col++) {
        const current = document.querySelector(`.block[col="${col}"][row="${startRow}"]`);
        current.setAttribute('data-block-type','grass');
        col === randomize[0] ? startRow -=2 : '';
        col === randomize[1] ? startRow -= 1 : '';
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

    generateUnderground: () => {
      // Create the lava
      //Randomize the height and appearance of lava
      const randomize = database.functions.randomNumber(0,4);
      for (let row = 40, count = 0;count < randomize;row--,count++) {
        const current = document.querySelectorAll(`.block[row="${row}"`);
        current.forEach(el => el.setAttribute('data-block-type', 'lava'));
      }
      // Create cobblestones insead of null
      database.functions.replaceAll('cobblestone','null');
    },

    generateTree: () => {
      const grassBlock = document.querySelectorAll('.block[data-block-type="grass"]');
      let randomize = database.functions.randomNumber(5,34);
      let col = parseInt(grassBlock[randomize].getAttribute('col'));
      while (col < 5 || col > 36) {
        randomize = database.functions.randomNumber(3,36);
        col = parseInt(grassBlock[randomize].getAttribute('col'));
      }
      let row = parseInt(grassBlock[randomize].getAttribute('row')) - 1;
      let current = document.querySelector(`.block[row="${row}"][col="${col}"]`);
      current.setAttribute('data-block-type', 'tree');
      randomize = database.functions.randomNumber(2,6);
      for (let i = 1; i <= randomize;i++,row--) {
        current = document.querySelector(`.block[row="${row}"][col="${col}"]`);
        current.setAttribute('data-block-type', 'tree');
      }
      current = document.querySelector(`.block[row="${row}"][col="${col}"]`);
      let xAxis = 2;
      for (let y = row;y >= row-randomize;y--) {
        for (let x = col-1;x < col+2;x++) {
          current = document.querySelector(`.block[row="${y}"][col="${x}"]`);
          current.setAttribute('data-block-type', 'leaves');
        }
      }
    },

    replaceAll: (what, where) => {
      const current = document.querySelectorAll(`.block[data-block-type="${where}"]`);
      current.forEach(e => e.setAttribute('data-block-type',what));
    },
    replaceRandom: (what,where,min,max) => {
      const current = document.querySelectorAll(`.block[data-block-type="${where}"]`);
      const randomize = database.functions.randomNumber(min,max);
      const count = max - min;
      for (let i = 0; i < randomize;i++) {
        const randomize2 = database.functions.randomNumber(0,current.length);
        current[randomize2].setAttribute('data-block-type',what);
      }
    },

    listeners: () => {
      const blocks = document.querySelectorAll('.block');
      blocks.forEach(e => e.addEventListener('mousedown', (e) =>  {
          database.functions.mineBlock(e);
          database.functions.placeable(e);
      }));
    },

    mineable: (e) => {
      if (database.var.currentTool) {
        // Get what the clicked block type is
        const blockType = e.target.getAttribute('data-block-type');
        const currentTool = database.var.currentTool;
        // Check that the block mineable by the current tool
        const ableToMine = database.blocks[currentTool].indexOf(blockType);
        return ableToMine >= 0 ? true : false;
      }
    },

    mineBlock: (e) => {
      if (database.functions.mineable(e) && Object.keys(database.inventory).length <= 6) {
        const current = e.target;
        console.warn('Mined Block:',current.getAttribute('data-block-type'));
        const block = current.getAttribute('data-block-type');
        current.setAttribute('data-block-type','sky');
        database.functions.updateInventory(e,block,'mine');
      }
    },

    placeable: (e) => {
      const block = database.var.currentBlock;
      if (block && e.target.getAttribute('data-block-type') === 'sky') {
        e.target.setAttribute('data-block-type',block);
        database.functions.updateInventory(e,block,'place');
      }
    },

    pickTool: (e) => {
      database.var.currentBlock = '';
      const index = [...e.target.parentElement.children].indexOf(e.target);
      database.var.currentTool = database.tools[index];
      console.warn('currentTool = ' + database.var.currentTool);
    },

    pickBlock: (e) => {
      // remove Current Tool selected
      database.var.currentTool = '';
      // add Current Block
      database.var.currentBlock = e.target.getAttribute('data-inventory');
      console.warn('currentBlock = ' + database.var.currentBlock);
    },

    updateInventory: (e,block,type) => {
      // if (type === 'mine' && database.inventory[block] === 0) {
      if (type === 'mine' && !database.inventory[block]) {
        database.inventory[block] = 1;
        const div = document.createElement('div');
        div.classList.add('item');
        div.classList.add('blockitem');
        div.setAttribute('data-inventory',block);
        const span = document.createElement('span');
        span.classList.add('inventoryCount');
        span.textContent = database.inventory[block];
        span.style.userSelect = 'none';
        div.appendChild(span);
        const toolbar = document.querySelector('.toolbar');
        toolbar.append(div);
        div.addEventListener('click',database.functions.pickBlock);
        span.addEventListener('click', (e) => e.stopPropagation());
      } else if (type === 'mine' && database.inventory[block] > 0) {
        database.inventory[block] += 1;
        const div = document.querySelector(`.blockitem[data-inventory="${block}"]`);
        div.querySelector('span').textContent = database.inventory[block];
      }
      if (type === 'place') {
        database.inventory[block] -= 1;
        const div = document.querySelector(`.blockitem[data-inventory="${block}"]`);
        div.querySelector('span').textContent = database.inventory[block];
        if (database.inventory[block] === 0) {
          div.remove();
          database.var.currentBlock = '';
        }
      }
    },
    duplicateWorld: () => {
      database.var.currentWorld = [];
      const blocks = document.querySelectorAll('.block');
      blocks.forEach(e => database.var.currentWorld.push(e.cloneNode(true)));
    },

    resetWorld: () => {
      document.querySelectorAll('.block').forEach(e => e.remove());
      const world = document.querySelector('.world');
      const length = database.var.currentWorld.length
      for (let i = 0; i < length; i++) {
        world.appendChild(database.var.currentWorld[i]);
      }
      database.functions.listeners();
    },

    randomNumber: (min,max) => parseInt(Math.random() * (max - min) + min),
    randomFloatNumber: (min,max) => (Math.random() * (max - min) + min).toFixed(2),
  }
};

// Start Menu Gone
const startButton = document.querySelector('.btn-1');
startButton.addEventListener('click', el => {
  const landingPage = document.querySelector("#start-menu");
  landingPage.style.display = 'none';
  const world = document.querySelector('.gamewindow');
  world.style.display = 'block';
  database.functions.generateWorld(el);
  database.functions.generateSky(el);
  database.functions.generateCloud();
  database.functions.generateCloud();
  database.functions.generateGrass();
  database.functions.generateDirt();
  database.functions.generateUnderground();
  database.functions.generateTree();
  database.functions.generateTree();
  database.functions.replaceRandom('diamond','cobblestone',0,6);
  database.functions.listeners();
  database.functions.duplicateWorld();

  const resetButton = document.createElement('div');
  resetButton.classList.add('menu--btn');
  resetButton.innerHTML = `<a>Reset World</a>`;
  world.appendChild(resetButton);
});

// Toolbar
const tools = document.querySelectorAll('.tool');
tools.forEach(tool => tool.addEventListener('click', database.functions.pickTool));
const listen = () => {
  document.querySelectorAll('.block').forEach(e => {
  e.addEventListener('click', database.functions.mineBlock);
});
}