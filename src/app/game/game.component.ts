import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Game} from './Classes/Game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {
  // Initialize default values of isShowGrid and tileSizeValue
  private isShowGrid = true;
  private tileSizeValue = 20;

  // Give a way to communicate with parent component
  @Input() set showGrid(value: boolean) {
    // Set the value of isShowGrid to the value given
    value ? this.game?.showGrid() : this.game?.hideGrid();
    this.isShowGrid = value;
  }

  @Input() set tileSize(value: number) {
    this.game?.updateTileSize(value);
    this.tileSizeValue = value;
  }

  constructor() {}

  // Injects a reference to the canvas
  @ViewChild('canvas', {static: true}) cnv: ElementRef<HTMLCanvasElement> | undefined;
  private ctx: CanvasRenderingContext2D | null = null;

  // Declare game as an object Game or undefined
  game: Game | undefined;

  // Calling the content after Angular has fully initialized the component's view
  ngAfterViewInit(): void {
    // Instantiate new game
    this.game = new Game(20, this.cnv, this.ctx);

    // Make game interactive : event on click to add or suppress a cell
    if (!this.cnv) {
      return;
    }
    this.cnv.nativeElement.addEventListener('click', e => {
      if (!this.cnv || !this.game) {
        return;
      }
      // Get coordinate of the MouseEvent interface, where event occurred
      const x = Math.floor( (e.clientX - this.cnv.nativeElement.offsetLeft) / this.game.getTileSize());
      const y = Math.floor( (e.clientY - this.cnv.nativeElement.offsetTop - 64) / this.game.getTileSize());
      // Set to true if false and to false if true
      this.game.BOARD[x][y] = !this.game.BOARD[x][y];
      // Fills the living cells on the board
      this.game.drawAll();
    });

    // this.updateSize(window.innerWidth, window.innerHeight);

    // Set living cells for tests
    this.game.BOARD[1][0] = true;
    this.game.BOARD[2][1] = true;
    this.game.BOARD[0][2] = true;
    this.game.BOARD[1][2] = true;
    this.game.BOARD[2][2] = true;

    // Set game on loop
    this.game.nextGenLoop();

    // Accessing showGrid method from Game class to display grid
    if (this.isShowGrid) {
      this.game.showGrid();
    }

    // Adapt tile size to new value
    this.game?.updateTileSize(this.tileSizeValue);
  }

  /*// Update canvas size
  updateSize(width: number, height: number): void {
    this.game?.updateSize(width, height);
  }*/

  // Get method from class Game to fill randomly board
  populate(): void {
    this.game?.populate();
  }

  // Get method from class Game to empty board
  empty(): void {
    this.game?.empty();
  }
}
