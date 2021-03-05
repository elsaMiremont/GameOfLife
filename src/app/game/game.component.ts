import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Platform} from '@angular/cdk/platform';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {

  @ViewChild('canvas', {static: true}) cnv: ElementRef<HTMLCanvasElement> | undefined;

  width = window.innerWidth;
  height = window.innerHeight;
  ctx: CanvasRenderingContext2D | null = null;

  // tslint:disable-next-line:typedef
  @HostListener('window:resize', ['$event']) onResize(event: any) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  constructor() {
  }

  ngAfterViewInit(): void {
    if (!this.cnv) {
      return;
    }
    this.ctx = this.cnv.nativeElement.getContext('2d');
    // Will be used to increased or decreased grid size
    const tileSize = 20;
    const tileX = this.width / tileSize;
    const tileY = this.height / tileSize;

    // Canvas context styling
    if (!this.ctx) {
      return;
    }
    this.ctx.fillStyle = 'rgb(100, 240, 150)';
    this.ctx.strokeStyle = 'rgb(200, 90, 90)';
    this.ctx.lineWidth = 0.5;

    const drawGrid = () => {
      if (!this.ctx) {
        return;
      }

      for ( let i = 0; i < tileX; i++ ) {
        this.ctx.beginPath();
        this.ctx.moveTo( i * tileSize - 0.5 * tileSize, 0);
        this.ctx.lineTo( i * tileSize - 0.5 * tileSize, this.height);
        this.ctx.stroke();
        console.log(tileX);
        console.log(tileY);
      }
    };

    drawGrid();
  }
}
