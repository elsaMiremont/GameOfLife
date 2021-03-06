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

  // Declares DOM event listener on resizing the window to adapt width and height
  // tslint:disable-next-line:typedef
  @HostListener('window:resize', ['$event']) onResize(event: any) {
    this.updateSize(window.innerWidth, window.innerHeight);
  }

  // Calling the content after Angular has fully initialized the component's view
  ngAfterViewInit(): void {
    this.game = new Game(20, this.cnv, this.ctx);
    this.game.nextGenLoop();
  }

  updateSize(width: number, height: number): void {
    this.game?.updateSize(width, height);
  }
}
