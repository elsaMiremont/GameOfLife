import {ElementRef, HostListener, ViewChild} from '@angular/core';

export class Game {

  public BOARD: boolean[][];

  private readonly tileSize: number;
  private readonly tilesX: number;
  private readonly tilesY: number;

  public width = window.innerWidth;
  private height = window.innerHeight;

  // Injects a reference to the canvas
  @ViewChild('canvas', {static: true}) cnv: ElementRef<HTMLCanvasElement> | undefined;
  private ctx: CanvasRenderingContext2D | null = null;

  // Declares DOM event listener on resizing the window to adapt width and height
  // tslint:disable-next-line:typedef
  @HostListener('window:resize', ['$event']) onResize(event: any) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  constructor(tileSize: number) {
    // Will be used to increased or decreased grid size
    this.tileSize = tileSize;
    this.tilesX = this.width / tileSize;
    this.tilesY = this.height / tileSize;

    // Set canvas width and height, initialize context
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.BOARD = this.prepareBoard();
  }

  // METHODS

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
    this.ctx.fillStyle = 'rgb(100, 240, 150)';
    this.ctx.strokeStyle = 'rgb(200, 200, 200)';
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

    this.BOARD = this.prepareBoard();
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

  // Set the initial board to a boolean 2D array
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

  // Check if a cell is alive, also set to 0 all values outside the bounds
  isAlive(x: number, y: number): number {
    if ( x < 0 || x >= this.tilesX || y < 0 || y >= this.tilesY ) {
      return 0;
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

  /////////////// WIP
  evolveGeneration(): boolean[][] {
    const currentBoard = this.BOARD;

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
}
