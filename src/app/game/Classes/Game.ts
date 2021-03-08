import {ElementRef, HostListener, ViewChild} from '@angular/core';

export class Game {

  public BOARD: boolean[][];

  private tileSize: number;
  private tilesX: number;
  private tilesY: number;
  private readonly cnv: ElementRef<HTMLCanvasElement> | undefined;
  private ctx: CanvasRenderingContext2D | null;
  private pause = false;

  public width = window.innerWidth;
  private height = window.innerHeight;

  constructor(tileSize: number, cnv: ElementRef<HTMLCanvasElement> | undefined, ctx: CanvasRenderingContext2D | null) {
    // Will be used to increased or decreased grid size
    this.tileSize = tileSize;
    this.tilesX = this.width / tileSize;
    this.tilesY = this.height / tileSize;

    // Set canvas width and height, initialize context
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.cnv = cnv;
    this.ctx = ctx;

    this.BOARD = this.prepareBoard();
    this.initGame();
    // setSize
  }

  // METHODS

  getWidth(): number {
    return this.width ? this.width : 800;
  }

  getHeight(): number {
    return this.height ? this.height : 500;
  }

  getTileSize(): number {
    return this.tileSize;
  }

  updateTileSize(tileSize: number): void {
    this.pause = true;
    setTimeout(() => {
      const nTilesX = this.width / tileSize;
      const nTilesY = this.height / tileSize;

      if (nTilesY > this.tilesY) {
        this.BOARD.forEach(row => {
          row.fill(false, this.tilesY, nTilesY);
        });
      }
      if (nTilesX > this.tilesX) {
        this.BOARD.fill(([] as boolean[]).fill(false, 0, nTilesY), this.tilesX, nTilesX);
      }
      this.tileSize = tileSize;
      this.tilesX = this.width / tileSize;
      this.tilesY = this.height / tileSize;
      this.pause = false;
      this.nextGenLoop();
    }, 100);

  }

  updateSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  // Initialisation
  initGame(): void  {
    if (!this.cnv) {
      return;
    }
    // Get the canvas drawing context
    this.ctx = this.cnv.nativeElement.getContext('2d');

    // Canvas context styling
    if (!this.ctx) {
      return;
    }
    this.ctx.fillStyle = 'rgb(200, 200, 200)';
    this.ctx.strokeStyle = '#212529';
    this.ctx.lineWidth = 1;

    this.drawGrid();
  }

  // Draw the grid on the board
  drawGrid(): void {
    if (!this.ctx) {
      return;
    }
    for ( let i = 0; i < this.tilesX; i++ ) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.tileSize - 0.5, 0);
      this.ctx.lineTo(i * this.tileSize - 0.5, this.height);
      this.ctx.stroke();
    }
    for ( let j = 0; j < this.tilesY; j++ ) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, j * this.tileSize - 0.5);
      this.ctx.lineTo(this.width, j * this.tileSize - 0.5);
      this.ctx.stroke();
    }
  }

  showGrid(): void {
    if (!this.ctx) {
      return;
    }
    this.ctx.strokeStyle = 'rgb(200, 200, 200)';
  }

  hideGrid(): void {
    if (!this.ctx) {
      return;
    }
    this.ctx.strokeStyle = '#212529';
  }

  // Set the initial board to a boolean 2D array, with only dead cells
  prepareBoard(): boolean[][] {
    const board = [];
    for ( let i = 0; i < this.tilesX; i++ ) {
      const row = [];
      for ( let j = 0; j < this.tilesY; j++ ) {
        row.push(false);
      }
      board.push(row);
    }
    return board;
  }

  // Fills the living cells on the board
  drawBoard(): void {
    for ( let i = 0; i < this.tilesX; i++ ) {
      for ( let j = 0; j < this.tilesY; j++ ) {
        if (!this.isAlive(i, j)) {
          continue;
        }
        this.ctx?.fillRect(i * this.tileSize, j * this.tileSize, this.tileSize, this.tileSize);
      }
    }
  }

  // Check if a cell is alive, also set to 0 all values outside the bounds
  isAlive(x: number, y: number): number {
    if ( x < 0 || x >= this.tilesX || y < 0 || y >= this.tilesY ) {
      return 0;
    }
    if (!this.BOARD[x]) {
      this.BOARD[x] = ([] as boolean[]).fill(false, 0, this.tilesY);
    }
    return this.BOARD[x][y] ? 1 : 0;
  }

  // Counts living neighbours around a cell
  surroundingCells(x: number, y: number): number {
    let count = 0;
    for (const i of [-1, 0, 1]) {
      for (const j of [-1, 0, 1]) {
        if (!(i === 0 && j === 0)) {
          count += this.isAlive(x + i, y + j);
        }
      }
    }
    return count;
  }

  // Evolution of the board for the next generation
  evolveGeneration(): boolean[][] {
    const currentBoard = this.prepareBoard();

    for ( let i = 0; i < this.tilesX; i ++ ) {
      for ( let j = 0; j < this.tilesY; j++) {
        if (this.isAlive(i, j)) {
          const count = this.surroundingCells(i, j);
          if (count === 2 || count === 3) {
            currentBoard[i][j] = true;
          }
        } else {
          if ( this.surroundingCells(i, j) === 3) {
            currentBoard[i][j] = true;
          }
        }
      }
    }
    return currentBoard;
  }

  // Clear the board
  clear(): void {
    this.ctx?.clearRect(0, 0, this.width, this.height);
  }

  // Clear the board, then redraw it and the grid
  drawAll(): void {
    this.clear();
    this.drawGrid();
    this.drawBoard();
  }

  // Get the next generation and clear last board, redraw new board and grid
  nextGen(): void {
    this.BOARD = this.evolveGeneration();
    this.drawAll();
  }

  // Loops on the nextGen function every 100ms
  nextGenLoop(): void {
    this.nextGen();
    setTimeout(() => { this.pause ? (() => {})() : this.nextGenLoop(); }, 100);
  }

  populate(): void {
    for ( let i = 0; i < this.tilesX; i++ ) {
      for ( let j = 0; j < this.tilesY; j++ ) {
        this.BOARD[i][j] = Boolean(Math.round(Math.random()));
      }
    }
  }

  empty(): void {
    for ( let i = 0; i < this.tilesX; i++ ) {
      for ( let j = 0; j < this.tilesY; j++ ) {
        this.BOARD[i][j] = false;
      }
    }
  }
}
