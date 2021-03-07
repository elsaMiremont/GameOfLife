import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Platform} from '@angular/cdk/platform';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {
  // Injects a reference to the canvas
  @ViewChild('canvas', {static: true}) cnv: ElementRef<HTMLCanvasElement> | undefined;
  // Set canvas width and height, initialize context
  width = window.innerWidth;
  height = window.innerHeight;
  private ctx: CanvasRenderingContext2D | null = null;

  // Declares DOM event listener on resizing the window to adapt width and height
  // tslint:disable-next-line:typedef
  @HostListener('window:resize', ['$event']) onResize(event: any) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  constructor() {
  }
  // Calling the content after Angular has fully initialized the component's view
  ngAfterViewInit(): void {
    if (!this.cnv) {
      return;
    }
    // Get the canvas drawing context
    this.ctx = this.cnv.nativeElement.getContext('2d');

    // Will be used to increased or decreased grid size
    const tileSize = 20;
    const tilesX = this.width / tileSize;
    const tilesY = this.height / tileSize;

    // Canvas context styling
    if (!this.ctx) {
      return;
    }
    this.ctx.fillStyle = 'rgb(100, 240, 150)';
    this.ctx.strokeStyle = 'rgb(200, 200, 200)';
    this.ctx.lineWidth = 1;

    // Draw the grid on the board
    const drawGrid = () => {
      if (!this.ctx) {
        return;
      }
      for ( let i = 0; i < tilesX; i++ ) {
        this.ctx.beginPath();
        this.ctx.moveTo(i * tileSize - 0.5, 0);
        this.ctx.lineTo(i * tileSize - 0.5, this.height);
        this.ctx.stroke();
      }
      for ( let j = 0; j < tilesY; j++ ) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, j * tileSize - 0.5);
        this.ctx.lineTo(this.width, j * tileSize - 0.5);
        this.ctx.stroke();
      }
    };
    // Set the initial board to a boolean 2D array
    const prepareBoard = (): boolean[][] => {
      const board = [];
      for ( let i = 0; i < tilesX; i++ ) {
        const row = [];
        for ( let j = 0; j < tilesY; j++ ) {
          row.push(false);
        }
        board.push(row);
      }
      return board;
    };
    let BOARD = prepareBoard();

    // Check if a cell is alive, also set to 0 all values outside the bounds
    const isAlive = (x: number, y: number): number => {
      if ( x < 0 || x >= tilesX || y < 0 || y >= tilesY ) {
        return 0;
      }
      return BOARD[x][y] ? 1 : 0;
    };
    // Counts living neighbours around a cell
    const surroundingCells = (x: number, y: number): number => {
      let count = 0;
      for (const i of [-1, 0, 1]) {
        for (const j of [-1, 0, 1]) {
          if (!(i === 0 && j === 0)) {
            count += isAlive(x + i, y + j);
          }
        }
      }
      return count;
    };
    //
    const drawBoard = () => {
      for ( let i = 0; i < tilesX; i++ ) {
        for ( let j = 0; j < tilesY; j++ ) {
          if (!isAlive(i, j)) {
            continue;
          }
          this.ctx?.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
        }
      }
    };
    /////////////// WIP
    const evolveGeneration = (): boolean[][] => {
      const board = prepareBoard();
      for ( let i = 0; i < tilesX; i ++ ) {
        for ( let j = 0; j < tilesY; j++) {
          if (isAlive(i, j)) {
            const count = surroundingCells(i, j);
            if (count === 2 || count === 3) {
              board[i][j] = true;
            }
          } else {
            if ( surroundingCells(i, j) === 3) {
              board[i][j] = true;
            }
          }
        }
      }
      return board;
    };

    const clear = () => {
      this.ctx?.clearRect(0, 0, this.width, this.height);
    };
    const drawAll = () => {
      clear();
      drawBoard();
      drawGrid();
    };
    const nextGen = () => {
      drawAll();
      BOARD = evolveGeneration();
    };

    const nextGenLoop = () => {
      nextGen();
      setTimeout(nextGenLoop, 100);
    };

    BOARD[1][0] = true;
    BOARD[2][1] = true;
    BOARD[0][2] = true;
    BOARD[1][2] = true;
    BOARD[2][2] = true;

    nextGenLoop();
  }
}
