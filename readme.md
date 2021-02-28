# Minecraft 2D

Minecraft 2D is a game based on Minecraft using Javascript, DOM Methods and CSS
an HTML.

## Features

- The game contain 4 tools: pickaxe, axe, shovel and bucket.
- Each tool can mine different blocks.
- Inventory with quantities.
- Randomize generation of the world.
- Responsive.

## Functions

| Name of Function | What it do                                                         |
| ---------------- | ------------------------------------------------------------------ |
| Generators       | 7 functions about generation of the world                          |
| mineable         | Check that the block mineable by the current tool.                 |
| mineBlock        | Mine the block if possible                                         |
| pickTool         | Change the current tool                                            |
| pickBlock        | Change the current block                                           |
| placeable        | Check if the block can be placed. (Only on sky block)              |
| duplicateWorld   | Save copy of the world                                             |
| resetWorld       | Delete the current world and using the copy                        |
| newWorld         | Delete the current world and generate new one                      |
| updateInventory  | Check for inventory and update it if necessary                     |
| replaceAll       | Replace all given blocks to a different blocks                     |
| replaceRandom    | Replace random given blocks to a different blocks with min and max |
| randomNumber     | Get min and max and give random number                             |
| createButtons    | Create all game buttons                                            |
| backToMenu       | Remove game screen and show menu                                   |
| listeners        | Attach listeners to necessary elements                             |
| MultiCalls       | Calls a given function multiple times                              |
| showTutorial     | Show/Hide the tutorial windows                                     |
| startGame        | Hide the landing page and show game page                           |

**Made as a weekend project of Fullstack Bootcamp.**
