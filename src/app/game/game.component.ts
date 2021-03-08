import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Game} from './Classes/Game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {
  private isShowGrid = true;
  private tileSizeValue = 20;

  @Input() set showGrid(value: boolean) {
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

  game: Game | undefined;

  // Calling the content after Angular has fully initialized the component's view
  ngAfterViewInit(): void {
    // Instantiate new game
    this.game = new Game(10, this.cnv, this.ctx);

    // Make game interactive : event on click to add or suppress a cell
    if (!this.cnv) {
      return;
    }
    this.cnv.nativeElement.addEventListener('click', e => {
      if (!this.cnv || !this.game) {
        return;
      }
      const x = Math.floor( (e.clientX - this.cnv.nativeElement.offsetLeft) / this.game.getTileSize());
      const y = Math.floor( (e.clientY - this.cnv.nativeElement.offsetTop - 64) / this.game.getTileSize());
      this.game.BOARD[x][y] = !this.game.BOARD[x][y];
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

    if (this.isShowGrid) {
      this.game.showGrid();
    }

    this.game?.updateTileSize(this.tileSizeValue);
  }

  // Update canvas size
  updateSize(width: number, height: number): void {
    this.game?.updateSize(width, height);
  }

  //
  populate(): void {
    this.game?.populate();
  }

  //
  empty(): void {
    this.game?.empty();
  }
}
