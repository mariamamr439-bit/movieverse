import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

import { MovieService } from '../../core/services/movie.service';
import { GenreService } from '../../core/services/genre.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

export type MovieTab = 'popular' | 'top_rated' | 'now_playing' | 'upcoming';

@Component({
  selector: 'app-movies',
  imports: [CommonModule, RouterLink, MovieCardComponent],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css',
})
export class MoviesComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly genreService = inject(GenreService);
  private readonly route = inject(ActivatedRoute);

  // ===================== Tabs =====================
  readonly activeTab = signal<MovieTab>('popular');
  readonly selectedGenreId = signal<number | null>(null);

  readonly tabs: { id: MovieTab; label: string; icon: string }[] = [
    { id: 'popular', label: 'Popular', icon: 'fa-solid fa-fire' },
    { id: 'top_rated', label: 'Top Rated', icon: 'fa-solid fa-trophy' },
    { id: 'now_playing', label: 'Now Playing', icon: 'fa-solid fa-play' },
    { id: 'upcoming', label: 'Upcoming', icon: 'fa-solid fa-calendar' },
  ];

  // ===================== Pagination =====================
  readonly currentPage = signal(1);
  readonly itemsPerPage = 10;

  // ===================== Signals =====================
  readonly popularMovies = this.movieService.popularMovies;
  readonly topRatedMovies = this.movieService.topRatedMovies;
  readonly nowPlayingMovies = this.movieService.nowPlayingMovies;
  readonly upcomingMovies = this.movieService.upcomingMovies;
  readonly isLoading = this.movieService.isLoading;

  // ===================== Computed =====================
  readonly allMovies = computed(() => {
    const genreId = this.selectedGenreId();
    const currentMovies = this.getCurrentMovies();
    
    // ✅ Fix: Only filter if genreId is not null
    if (genreId !== null) {
      return currentMovies.filter(movie => movie.genre_ids?.includes(genreId));
    }
    return currentMovies;
  });

  getCurrentMovies(): any[] {
    switch (this.activeTab()) {
      case 'popular': return this.popularMovies();
      case 'top_rated': return this.topRatedMovies();
      case 'now_playing': return this.nowPlayingMovies();
      case 'upcoming': return this.upcomingMovies();
      default: return [];
    }
  }

  readonly totalItems = computed(() => this.allMovies().length);
  readonly totalPagesComputed = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage));

  readonly currentMovies = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.allMovies().slice(start, end);
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
    this.route.queryParams.subscribe(params => {
      const genreId = params['genre'];
      if (genreId) {
        this.selectedGenreId.set(Number(genreId));
      }
    });

    this.loadMovies();
    this.genreService.getMovieGenres();
  }

  // ===================== Methods =====================
  loadMovies(): void {
    switch (this.activeTab()) {
      case 'popular':
        this.movieService.getPopularMovies();
        break;
      case 'top_rated':
        this.movieService.getTopRatedMovies();
        break;
      case 'now_playing':
        this.movieService.getNowPlayingMovies();
        break;
      case 'upcoming':
        this.movieService.getUpcomingMovies();
        break;
    }
  }

  setTab(tab: MovieTab): void {
    this.activeTab.set(tab);
    this.currentPage.set(1);
    this.selectedGenreId.set(null);
    this.loadMovies();
  }

  clearGenreFilter(): void {
    this.selectedGenreId.set(null);
    this.currentPage.set(1);
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

  getGenreName(id: number): string {
    return this.genreService.getGenreName(id, 'movie');
  }
}