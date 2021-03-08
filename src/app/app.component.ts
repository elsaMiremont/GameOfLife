import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GameComponent} from './game/game.component';
import {Subject} from 'rxjs';
import {MatInput} from '@angular/material/input';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  // Injects a reference to the game component, and to the
  @ViewChild('game') gameComponent: GameComponent | undefined;
  @ViewChild('sizeInput') sizeInput: MatInput | undefined;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  title = 'GameOfLife';
  mobileQuery: MediaQueryList;
  showGrid = true;
  tileSize = 20;
  // Temporary value of tileSize
  tileSizeTmp = 20;
  resizeSub = new Subject<number>();

  private mobileQueryListener: () => void;

  // shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  shouldRun = true;

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  // Randomly fills board
  populate(): void {
    this.gameComponent?.populate();
  }

  // Clear the board
  empty(): void {
    this.gameComponent?.empty();
  }

  // Content executed after Angular has initialized all data-bound properties
  ngOnInit(): void {
    // Prevent from overload calls of the resize method
    this.resizeSub.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(size => this.tileSize = size);
  }

  // Takes the value of the last call to resize after more than 200ms
  tileSizeChange(): void {
    this.resizeSub.next(this.tileSizeTmp);
  }
}
