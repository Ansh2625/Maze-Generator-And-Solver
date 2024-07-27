const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 20;
const cols = 25;
const rows = 25;
canvas.width = cellSize*cols;
canvas.height = cellSize*rows;

let maze = [];
let stack = [];
let currentCell;

function Cell(x,y)
{
    this.x = x;
    this.y = y;
    this.walls = [true,true,true,true];
    this.visited = false;

    this.show = function()
    {
        const x = this.x * cellSize;
        const y = this.y * cellSize;
        ctx.strokeStyle = 'black';

        if(this.walls[0])
            ctx.beginPath(), ctx.moveTo(x,y), ctx.lineTo(x + cellSize,y), ctx.stroke();
        if(this.walls[1])
            ctx.beginPath(), ctx.moveTo(x + cellSize,y), ctx.lineTo(x + cellSize, y + cellSize), ctx.stroke();
        if(this.walls[2])
            ctx.beginPath(), ctx.moveTo(x,y + cellSize), ctx.lineTo(x + cellSize, y + cellSize), ctx.stroke();
        if(this.walls[3])
            ctx.beginPath(), ctx.moveTo(x,y), ctx.lineTo(x, y+cellSize), ctx.stroke();

        if(this.visited)
        {
            ctx.fillStyle = 'white';
            ctx.fillRect(x,y,cellSize,cellSize);
        }

        if(this.x === 0 && this.y === 0)
        {
            ctx.fillStyle = 'green';
            ctx.fillRect(x,y,cellSize,cellSize);
        }
        else if(this.x === cols-1 && this.y === rows-1)
        {
            ctx.fillStyle = 'red';
            ctx.fillRect(x,y,cellSize,cellSize);
        }
    };

    this.checkNeighbors = function()
    {
        const neighbors = [];
        const top = maze[getIndex(this.x,this.y-1)];
        const right = maze[getIndex(this.x+1,this.y)];
        const bottom = maze[getIndex(this.x,this.y+1)];
        const left = maze[getIndex(this.x-1,this.y)];

        if(top && !top.visited) neighbors.push(top);
        if(right && !right.visited) neighbors.push(right);
        if(bottom && !bottom.visited) neighbors.push(bottom);
        if(left && !left.visited) neighbors.push(left);

        if(neighbors.length > 0)
        {
            const randomIndex = Math.floor(Math.random()*neighbors.length);
            return neighbors[randomIndex];
        }
        else
        {
            return undefined;
        }
    };
}

function generateMaze()
{
    maze = [];

    for(let y=0; y<rows; y++)
    {
        for(let x=0; x<cols; x++)
        {
            maze.push(new Cell(x,y));
        }
    }

    currentCell = maze[0];
    stack = [];
    animateMazeGeneration();
}

function animateMazeGeneration()
{
    const interval = setInterval(() =>
    {
        currentCell.visited = true;
        currentCell.show();

        const next = currentCell.checkNeighbors();
        if(next)
        {
            next.visited = true;
            stack.push(currentCell);

            const x = currentCell.x - next.x;
            const y = currentCell.y - next.y;
            if(x === 1)
            {
                currentCell.walls[3] = false;
                next.walls[1] = false;
            }
            else if(x === -1)
            {
                currentCell.walls[1] = false;
                next.walls[3] = false;
            }
            if(y === 1)
            {
                currentCell.walls[0] = false;
                next.walls[2] = false;
            }
            else if(y === -1)
            {
                currentCell.walls[2] = false;
                next.walls[0] = false;
            }

            currentCell = next;
        }
        else if(stack.length > 0)
        {
            currentCell = stack.pop();
        }
        else
        {
            clearInterval(interval);
            maze[0].show();
            maze[maze.length-1].show();
        }
    },10);
}

function solveMaze()
{
    const start = maze[0];
    const end = maze[maze.length-1];
    const queue = [start];
    const cameFrom = new Map();
    cameFrom.set(start,null);
    const wrongPath = new Set();

    while(queue.length > 0)
    {
        const current = queue.shift();
        wrongPath.add(current);

        if(current === end)
        {
            reconstructPath(cameFrom,end,wrongPath);
            return;
        }

        const neighbors = 
        [
            {cell: maze[getIndex(current.x, current.y-1)], dir:0},
            {cell: maze[getIndex(current.x+1, current.y)], dir:1},
            {cell: maze[getIndex(current.x,current.y+1)], dir:2},
            {cell: maze[getIndex(current.x-1, current.y)], dir:3}
        ];

        for(const neighbor of neighbors)
        {
            if(neighbor.cell && !cameFrom.has(neighbor.cell) && !current.walls[neighbor.dir])
            {
                queue.push(neighbor.cell);
                cameFrom.set(neighbor.cell,current);
            }
        }

    }

}

function reconstructPath(cameFrom,current,wrongPath)
{
    const path = [];
    while(current)
    {
        path.push(current);
        current = cameFrom.get(current);
    }
    path.reverse();

    for(const cell of wrongPath)
    {
        if(!path.includes(cell))
        {
            ctx.fillStyle = 'red';
            ctx.fillRect(cell.x * cellSize + cellSize/4, cell.y * cellSize + cellSize/4, cellSize/2, cellSize/2);
        }
    }

    for(const cell of path)
    {
        ctx.fillStyle = 'blue';
        ctx.fillRect(cell.x * cellSize + cellSize/4, cell.y * cellSize + cellSize/4, cellSize/2, cellSize/2);
    }

    maze[0].show();
    maze[maze.length-1].show();
}

function getIndex(x,y)
{
    if(x<0 || y<0 || x>=cols || y>=rows)
        return -1;
    return x + y*cols;
}
