import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TvService } from '../../core/services/tv.service';
import { GenreService } from '../../core/services/genre.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

export type TvTab = 'popular' | 'top_rated' | 'airing_today' | 'on_the_air';

@Component({
  selector: 'app-tv-shows',
  imports: [CommonModule, RouterLink , MovieCardComponent],
  templateUrl: './tv-shows.component.html',
  styleUrl: './tv-shows.component.css',
})
export class TvShowsComponent implements OnInit {
  private readonly tvService = inject(TvService);
  private readonly genreService = inject(GenreService);

  // ===================== Tabs =====================
  readonly activeTab = signal<TvTab>('popular');

  readonly tabs: { id: TvTab; label: string; icon: string }[] = [
    { id: 'popular', label: 'Popular', icon: 'fa-solid fa-fire' },
    { id: 'top_rated', label: 'Top Rated', icon: 'fa-solid fa-trophy' },
    { id: 'airing_today', label: 'Airing Today', icon: 'fa-solid fa-calendar-day' },
    { id: 'on_the_air', label: 'On The Air', icon: 'fa-solid fa-tv' },
  ];

  // ===================== Pagination =====================
  readonly currentPage = signal(1);
  readonly itemsPerPage = 10;

  // ===================== Signals =====================
  readonly popularShows = this.tvService.popularShows;
  readonly topRatedShows = this.tvService.topRatedShows;
  readonly airingToday = this.tvService.airingToday;
  readonly onTheAir = this.tvService.onTheAir;
  readonly isLoading = this.tvService.isLoading;

  // ===================== Computed =====================
  readonly allShows = computed(() => {
    switch (this.activeTab()) {
      case 'popular': return this.popularShows();
      case 'top_rated': return this.topRatedShows();
      case 'airing_today': return this.airingToday();
      case 'on_the_air': return this.onTheAir();
    }
  });

  readonly totalItems = computed(() => this.allShows().length);
  readonly totalPagesComputed = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage));

  readonly currentShows = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.allShows().slice(start, end);
  });

  readonly pageNumbers = computed(() => {
    const total = this.totalPagesComputed();
    const current = this.currentPage();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      }
    }
    return pages;
  });

  // ===================== Lifecycle =====================
  ngOnInit(): void {
    this.loadShows();
    this.genreService.getTvGenres();
  }

  // ===================== Methods =====================
  loadShows(): void {
    switch (this.activeTab()) {
      case 'popular':
        this.tvService.getPopularShows();
        break;
      case 'top_rated':
        this.tvService.getTopRatedShows();
        break;
      case 'airing_today':
        this.tvService.getAiringToday();
        break;
      case 'on_the_air':
        this.tvService.getOnTheAir();
        break;
    }
  }

  setTab(tab: TvTab): void {
    this.activeTab.set(tab);
    this.currentPage.set(1);
    this.loadShows();
  }

  goToPage(page: number | string): void {
    if (typeof page === 'string' || page === this.currentPage()) return;
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPagesComputed()) {
      this.currentPage.update(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getStartIndex(): number {
    return (this.currentPage() - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    const end = this.currentPage() * this.itemsPerPage;
    return Math.min(end, this.totalItems());
  }
}