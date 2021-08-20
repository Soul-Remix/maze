import { shuffle } from './shuffle';
import * as Matter from './matter';

export function createGrid() {
  const {
    Engine,
    Runner,
    World,
    Bodies,
    Render,
    Body,
    Events,
    MouseConstraint,
    Mouse,
  } = Matter;
  const width = window.innerWidth - 3;
  const height = window.innerHeight - 4;
  const cellsHorizontal = Math.floor(width / 60);
  const cellsVertical = Math.floor(height / 60);
  const unitLengthX = width / cellsHorizontal;
  const unitLengthY = height / cellsVertical;

  const engine = Engine.create();
  engine.world.gravity.y = 0;
  const { world } = engine;
  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      wireframes: false,
      width,
      height,
    },
  });
  Render.run(render);
  Runner.run(Runner.create(), engine);
  World.add(
    world,
    MouseConstraint.create(engine, {
      mouse: Mouse.create(render.canvas),
    })
  );

  const walls = [
    Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
    Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
    Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
  ];

  World.add(world, walls);

  const grid = Array(cellsVertical)
    .fill(null)
    .map((x) => Array(cellsHorizontal).fill(false));

  const verticals = Array(grid.length)
    .fill(null)
    .map((x) => Array(grid[0].length - 1).fill(false));

  const horizontals = Array(grid.length - 1)
    .fill(null)
    .map((x) => Array(grid[0].length).fill(false));

  const rowStart = Math.floor(Math.random() * cellsVertical);
  const colStart = Math.floor(Math.random() * cellsHorizontal);

  const moveThroughGrid = (row, column) => {
    if (grid[row][column] === true) {
      return;
    }
    grid[row][column] = true;

    const neighbors = shuffle([
      [row, column - 1, 'left'],
      [row, column + 1, 'right'],
      [row - 1, column, 'up'],
      [row + 1, column, 'down'],
    ]);

    for (let x of neighbors) {
      if (
        x[0] < 0 ||
        x[0] >= cellsVertical ||
        x[1] < 0 ||
        x[1] >= cellsHorizontal
      ) {
        continue;
      }
      if (grid[x[0]][x[1]] === true) {
        continue;
      }
      if (x[2] === 'left') {
        verticals[row][column - 1] = true;
      } else if (x[2] === 'right') {
        verticals[row][column] = true;
      } else if (x[2] === 'up') {
        horizontals[row - 1][column] = true;
      } else if (x[2] === 'down') {
        horizontals[row][column] = true;
      }
      moveThroughGrid(x[0], x[1]);
    }
  };

  const drawHorizontal = () => {
    horizontals.forEach((x, rowIndex) => {
      x.forEach((open, colIndex) => {
        if (open === true) {
          return;
        }
        const wall = Bodies.rectangle(
          colIndex * unitLengthX + unitLengthX / 2,
          rowIndex * unitLengthY + unitLengthY,
          unitLengthX,
          5,
          {
            label: 'wall',
            isStatic: true,
            render: {
              fillStyle: '#f72585',
            },
          }
        );
        World.add(world, wall);
      });
    });
  };

  const drawVertical = () => {
    verticals.forEach((x, rowIndex) => {
      x.forEach((open, colIndex) => {
        if (open === true) {
          return;
        }
        const wall = Bodies.rectangle(
          colIndex * unitLengthX + unitLengthX,
          rowIndex * unitLengthY + unitLengthY / 2,
          5,
          unitLengthY,
          {
            label: 'wall',
            isStatic: true,
            render: {
              fillStyle: '#4cc9f0',
            },
          }
        );
        World.add(world, wall);
      });
    });
  };

  const addGoal = () => {
    const goal = Bodies.rectangle(
      width - unitLengthX / 2,
      height - unitLengthY / 2,
      unitLengthX * 0.7,
      unitLengthY * 0.7,
      {
        label: 'goal',
        isStatic: true,
        render: {
          fillStyle: '#06d6a0',
        },
      }
    );
    World.add(world, goal);
  };

  const addPlayer = () => {
    const ballRadius = Math.min(unitLengthX, unitLengthY);
    const ball = Bodies.circle(
      unitLengthX / 2,
      unitLengthY / 2,
      ballRadius * 0.25,
      {
        label: 'ball',
        render: {
          fillStyle: '#fdffb6',
        },
      }
    );
    World.add(world, ball);
    document.addEventListener('keydown', (e) => {
      movePlayer(e, ball);
    });
  };

  const movePlayer = (e, ball) => {
    const { x, y } = ball.velocity;

    if (e.keyCode === 87 || e.keyCode === 38) {
      Body.setVelocity(ball, { x, y: y - 5 });
    } else if (e.keyCode === 83 || e.keyCode === 40) {
      Body.setVelocity(ball, { x, y: y + 5 });
    } else if (e.keyCode === 68 || e.keyCode === 39) {
      Body.setVelocity(ball, { x: x + 5, y });
    } else if (e.keyCode === 65 || e.keyCode === 37) {
      Body.setVelocity(ball, { x: x - 5, y });
    }
  };

  const win = () => {
    world.gravity.y = 1;
    world.bodies.forEach((body) => {
      if (body.label === 'wall') {
        Body.setStatic(body, false);
      }
    });
    document.querySelector('.alert').classList.remove('hidden');
    return;
  };

  const checkCollision = () => {
    Events.on(engine, 'collisionStart', (e) => {
      console.log(e.pairs);
      e.pairs.forEach((x) => {
        const labels = ['goal', 'ball'];
        if (labels.includes(x.bodyA.label) && labels.includes(x.bodyB.label)) {
          win();
          engine.events = {};
        }
      });
    });
  };

  moveThroughGrid(rowStart, colStart);
  drawHorizontal();
  drawVertical();
  addGoal();
  addPlayer();
  checkCollision();
}
