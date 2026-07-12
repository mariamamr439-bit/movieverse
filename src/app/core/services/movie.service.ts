import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Movie, MovieResponse } from '../models/movies.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.tmdbBaseUrl;
  private readonly apiKey = environment.tmdbApiKey;

  // ===================== Signals =====================

  private readonly _popularMovies = signal<Movie[]>([]);
  private readonly _topRatedMovies = signal<Movie[]>([]);
  private readonly _nowPlayingMovies = signal<Movie[]>([]);
  private readonly _upcomingMovies = signal<Movie[]>([]);
  private readonly _trendingMovies = signal<Movie[]>([]);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  // ===================== Public Readonly Signals =====================

  readonly popularMovies = this._popularMovies.asReadonly();
  readonly topRatedMovies = this._topRatedMovies.asReadonly();
  readonly nowPlayingMovies = this._nowPlayingMovies.asReadonly();
  readonly upcomingMovies = this._upcomingMovies.asReadonly();
  readonly trendingMovies = this._trendingMovies.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // ===================== Movie Lists =====================

  getPopularMovies(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http
      .get<MovieResponse>(
        `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=en-US`
      )
      .subscribe({
        next: (response) => {
          this._popularMovies.set(response.results);
          this._isLoading.set(false);
        },
        error: (err) => {
          this._error.set('Failed to load popular movies');
          this._isLoading.set(false);
          console.error('Error loading popular movies:', err);
        },
      });
  }

  getTopRatedMovies(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http
      .get<MovieResponse>(
        `${this.baseUrl}/movie/top_rated?api_key=${this.apiKey}&language=en-US`
      )
      .subscribe({
        next: (response) => {
          this._topRatedMovies.set(response.results);
          this._isLoading.set(false);
        },
        error: (err) => {
          this._error.set('Failed to load top rated movies');
          this._isLoading.set(false);
          console.error('Error loading top rated movies:', err);
        },
      });
  }

  getNowPlayingMovies(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http
      .get<MovieResponse>(
        `${this.baseUrl}/movie/now_playing?api_key=${this.apiKey}&language=en-US`
      )
      .subscribe({
        next: (response) => {
          this._nowPlayingMovies.set(response.results);
          this._isLoading.set(false);
        },
        error: (err) => {
          this._error.set('Failed to load now playing movies');
          this._isLoading.set(false);
          console.error('Error loading now playing movies:', err);
        },
      });
  }

  getUpcomingMovies(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http
      .get<MovieResponse>(
        `${this.baseUrl}/movie/upcoming?api_key=${this.apiKey}&language=en-US`
      )
      .subscribe({
        next: (response) => {
          this._upcomingMovies.set(response.results);
          this._isLoading.set(false);
        },
        error: (err) => {
          this._error.set('Failed to load upcoming movies');
          this._isLoading.set(false);
          console.error('Error loading upcoming movies:', err);
        },
      });
  }

  getTrendingMovies(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http
      .get<MovieResponse>(
        `${this.baseUrl}/trending/movie/day?api_key=${this.apiKey}&language=en-US`
      )
      .subscribe({
        next: (response) => {
          this._trendingMovies.set(response.results);
          this._isLoading.set(false);
        },
        error: (err) => {
          this._error.set('Failed to load trending movies');
          this._isLoading.set(false);
          console.error('Error loading trending movies:', err);
        },
      });
  }

  // ===================== Movie Details (Observable) =====================

  // ✅ Movie Details
  getMovieDetails(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&language=en-US`
    );
  }

  // ✅ Movie Credits (Cast & Crew)
  getMovieCredits(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/movie/${id}/credits?api_key=${this.apiKey}&language=en-US`
    );
  }

  // ✅ Similar Movies
  getSimilarMovies(id: number): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.baseUrl}/movie/${id}/similar?api_key=${this.apiKey}&language=en-US`
    );
  }

  // ✅ Movie Videos (Trailers)
  getMovieVideos(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/movie/${id}/videos?api_key=${this.apiKey}&language=en-US`
    );
  }

  // ===================== Image Helpers =====================

  getPosterUrl(path: string | null): string {
    if (!path) return '/assets/images/no-poster.jpg';
    return `${environment.tmdbImageUrl}/${environment.posterSize}${path}`;
  }

  getBackdropUrl(path: string | null): string {
    if (!path) return '/assets/images/no-backdrop.jpg';
    return `${environment.tmdbImageUrl}/${environment.backdropSize}${path}`;
  }

  clearError(): void {
    this._error.set(null);
  }
}