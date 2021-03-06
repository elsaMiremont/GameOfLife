import {AfterViewInit, Component} from '@angular/core';
import {Game} from './Classes/Game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {

  private game = new Game(20);

  constructor() {}

  // Calling the content after Angular has fully initialized the component's view
  ngAfterViewInit(): void {
    this.game.initGame();
    this.game.BOARD = this.game.evolveGeneration();
  }
}
