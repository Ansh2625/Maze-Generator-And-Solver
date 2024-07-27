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
            const randomIndex = Math.floor(math.random()*neighbors.length);
            return neighbors[randomIndex];
        }
        else
        {
            return undefined;
        }
    };
}
function getIndex(x,y)
{
    if(x<0 || y<0 || x>=cols || y>=rows)
        return -1;
    return x + y*cols;
}
