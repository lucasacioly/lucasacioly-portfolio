import { Component, inject, signal, OnDestroy } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [RouterOutlet, SharedModule, RouterModule],
})
export default class HomeComponent implements OnDestroy {

  private readonly destroy$ = new Subject<void>();

  private router = inject(Router);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
