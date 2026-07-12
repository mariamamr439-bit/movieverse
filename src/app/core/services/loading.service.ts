import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private count = 0;

  isVisible = signal(false);
  isLeaving = signal(false);

  show(): void {
    this.count++;
    this.isLeaving.set(false);
    this.isVisible.set(true);
  }

  hide(): void {
    this.count--;

    if (this.count <= 0) {
      this.isLeaving.set(true);

      setTimeout(() => {
        this.isVisible.set(false);
        this.isLeaving.set(false);
        this.count = 0;
      }, 300);
    }
  }
}