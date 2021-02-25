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
  
  inventory: {
    grass: 0,
    dirt: 0,
    cobblestone: 0,
    tree: 0,
    leaves: 0,
  },

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
      for (let row = 1;row <= 15;row++) {
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

    // generat

    replaceAll: (what, where) => {
      const current = document.querySelectorAll(`.block[data-block-type="${where}"]`);
      current.forEach(e => e.setAttribute('data-block-type',what));
    },
    replaceRandom: (what,where,min,max) => {
      const current = document.querySelectorAll(`.block[data-block-type="${where}"]`);
      const randomize = database.functions.randomNumber(min,max);
      const count = max - min;
      for (let i = 0; i <= randomize;i++) {
        const randomize2 = database.functions.randomNumber(0,current.length);
        current[randomize2].setAttribute('data-block-type',what);
        console.log(i);
      }
    },

    listeners: () => {
      const blocks = document.querySelectorAll('.block');
      blocks.forEach(e => e.addEventListener('click', (e) =>  {
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
      if (database.functions.mineable(e)) {
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
      if (type === 'mine' && database.inventory[block] === 0) {
        database.inventory[block] += 1;
        const div = document.createElement('div');
        div.classList.add('item');
        div.classList.add('blockitem');
        div.setAttribute('data-inventory',block);
        const span = document.createElement('span');
        span.classList.add('inventoryCount');
        span.textContent = database.inventory[block];
        div.appendChild(span);
        const toolbar = document.querySelector('.toolbar');
        toolbar.append(div);
        div.addEventListener('click',database.functions.pickBlock);
      } else if (type === 'mine' && database.inventory[block] > 0 ) {
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

    randomNumber: (min,max) => parseInt(Math.random() * (max - min) + min),
    randomFloatNumber: (min,max) => (Math.random() * (max - min) + min).toFixed(2),
  }
};

// Start Menu Gone
const startButton = document.querySelector('.btn-1');
startButton.addEventListener('click', el => {
  // const landingPage = document.querySelector('.start-menu');
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
  database.functions.listeners();
  database.functions.generateUnderground();
});

// Toolbar
const tools = document.querySelectorAll('.tool');
tools.forEach(tool => tool.addEventListener('click', database.functions.pickTool));
const listen = () => {
  document.querySelectorAll('.block').forEach(e => {
  e.addEventListener('click', database.functions.mineBlock);
});
}