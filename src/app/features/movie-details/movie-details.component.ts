import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

import { MovieService } from '../../core/services/movie.service';
import { GenreService } from '../../core/services/genre.service';
import { WatchlistService } from '../../core/services/watchlist.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule, RouterLink, MovieCardComponent],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly movieService = inject(MovieService);
  private readonly genreService = inject(GenreService);
  private readonly watchlistService = inject(WatchlistService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly movieId = signal<number | null>(null);
  readonly movie = signal<any>(null);
  readonly credits = signal<any>(null);
  readonly similarMovies = signal<any[]>([]);
  readonly videos = signal<any[]>([]);
  readonly isLoading = signal(false);
  readonly activeTab = signal<'overview' | 'cast' | 'similar'>('overview');

  // Check if movie is in watchlist
  readonly isInWatchlist = computed(() => {
    const movie = this.movie();
    if (!movie) return false;
    return this.watchlistService.isInWatchlist(movie.id, 'movie');
  });

  // Get main cast (top 10)
  readonly mainCast = computed(() => {
    const cast = this.credits()?.cast || [];
    return cast.slice(0, 10);
  });

  // Get director
  readonly director = computed(() => {
    const crew = this.credits()?.crew || [];
    return crew.find((person: any) => person.job === 'Director');
  });

  // Get writers
  readonly writerNames = computed(() => {
    const crew = this.credits()?.crew || [];
    const writers = crew.filter((person: any) => person.department === 'Writing');
    return writers.map((w: any) => w.name).join(', ');
  });

  // Get genre names
  readonly genreNames = computed(() => {
    const movie = this.movie();
    if (!movie?.genres) return [];
    return movie.genres.map((g: any) => g.name);
  });

  // Get trailer
  readonly trailerUrl = computed<SafeResourceUrl | null>(() => {
    const video = this.videos().find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
    if (video) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${video.key}`
      );
    }
    return null;
  });

  // Get runtime in hours and minutes
  readonly runtimeFormatted = computed(() => {
    const runtime = this.movie()?.runtime;
    if (!runtime) return null;
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (id) {
        this.movieId.set(id);
        this.loadMovieDetails(id);
      }
    });
  }

  loadMovieDetails(id: number): void {
    this.isLoading.set(true);

    this.movieService.getMovieDetails(id).subscribe({
      next: (data) => {
        this.movie.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading movie details:', err);
        this.isLoading.set(false);
      },
    });

    this.movieService.getMovieCredits(id).subscribe({
      next: (data) => {
        this.credits.set(data);
      },
      error: (err) => {
        console.error('Error loading credits:', err);
      },
    });

    this.movieService.getSimilarMovies(id).subscribe({
      next: (data) => {
        this.similarMovies.set(data.results || []);
      },
      error: (err) => {
        console.error('Error loading similar movies:', err);
      },
    });

    this.movieService.getMovieVideos(id).subscribe({
      next: (data) => {
        this.videos.set(data.results || []);
      },
      error: (err) => {
        console.error('Error loading videos:', err);
      },
    });
  }

  toggleWatchlist(): void {
    const movie = this.movie();
    if (!movie) return;

    const watchlistItem = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      media_type: 'movie' as const,
    };

    this.watchlistService.toggle(watchlistItem);

    Swal.fire({
      icon: 'success',
      title: this.isInWatchlist() ? 'Removed from Watchlist' : 'Added to Watchlist',
      text: this.isInWatchlist() 
        ? `${movie.title} has been removed from your watchlist.`
        : `${movie.title} has been added to your watchlist.`,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      background: '#0f172a',
      color: '#f8fafc',
    });
  }

  getPosterUrl(path: string | null): string {
    return this.movieService.getPosterUrl(path);
  }

  getBackdropUrl(path: string | null): string {
    return this.movieService.getBackdropUrl(path);
  }

  setTab(tab: 'overview' | 'cast' | 'similar'): void {
    this.activeTab.set(tab);
  }

  getGenreName(id: number): string {
    return this.genreService.getGenreName(id, 'movie');
  }
}