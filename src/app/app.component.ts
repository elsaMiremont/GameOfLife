import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GameComponent} from './game/game.component';
import {Observable, Subject, Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {

  @ViewChild('game') gameComponent: GameComponent | undefined;
  @ViewChild('sizeInput') sizeInput: MatInput | undefined;
  tileSizeTmp = 20;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }
  title = 'GameOfLife';
  mobileQuery: MediaQueryList;
  showGrid = true;
  tileSize = 20;
  resizeSub = new Subject<number>();

  private mobileQueryListener: () => void;

  // shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  shouldRun = true;

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  populate(): void {
    this.gameComponent?.populate();
  }

  empty(): void {
    this.gameComponent?.empty();
  }

  //
  ngOnInit(): void {
    this.resizeSub.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(size => this.tileSize = size);
  }

  //
  tileSizeChange(): void {
    this.resizeSub.next(this.tileSizeTmp);
  }
}
