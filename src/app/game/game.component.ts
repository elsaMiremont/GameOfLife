import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {Game} from './Classes/Game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {

  constructor() {}
  // Injects a reference to the canvas
  @ViewChild('canvas', {static: true}) cnv: ElementRef<HTMLCanvasElement> | undefined;
  private ctx: CanvasRenderingContext2D | null = null;

  game: Game | undefined;

  // Calling the content after Angular has fully initialized the component's view
  ngAfterViewInit(): void {
    // Instantiate new game
    this.game = new Game(20, this.cnv, this.ctx);
    this.updateSize(window.innerWidth, window.innerHeight);

    // Set living cells for tests
    this.game.BOARD[1][0] = true;
    this.game.BOARD[2][1] = true;
    this.game.BOARD[0][2] = true;
    this.game.BOARD[1][2] = true;
    this.game.BOARD[2][2] = true;

    // Set game on loop
    this.game.nextGenLoop();
  }

  // Update canvas size
  updateSize(width: number, height: number): void {
    this.game?.updateSize(width, height);
    if (!this.ctx) {
      return;
    }
    this.ctx.canvas.width = width;
    console.log(width);
    this.ctx.canvas.height = height;
    console.log(height);
  }
}
