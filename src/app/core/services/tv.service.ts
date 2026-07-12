import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TvShow, TvResponse } from '../models/tv.interface';
import { GenreService } from './genre.service';

@Injectable({
  providedIn: 'root',
})
export class TvService {
  private readonly http = inject(HttpClient);
  private readonly genreService = inject(GenreService);
  private readonly baseUrl = environment.tmdbBaseUrl;
  private readonly apiKey = environment.tmdbApiKey;

  // ===================== Signals =====================
  private readonly _trendingShows = signal<TvShow[]>([]);
  private readonly _popularShows = signal<TvShow[]>([]);
  private readonly _topRatedShows = signal<TvShow[]>([]);
  private readonly _airingToday = signal<TvShow[]>([]);
  private readonly _onTheAir = signal<TvShow[]>([]);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  // ===================== Public Signals =====================
  readonly trendingShows = this._trendingShows.asReadonly();
  readonly popularShows = this._popularShows.asReadonly();
  readonly topRatedShows = this._topRatedShows.asReadonly();
  readonly airingToday = this._airingToday.asReadonly();
  readonly onTheAir = this._onTheAir.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // ===================== TV Lists =====================

  getTrendingShows(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http
      .get<TvResponse>(`${this.baseUrl}/trending/tv/day?api_key=${this.apiKey}&language=en-US`)
      .subscribe({
        next: (response) => {
          this._trendingShows.set(response.results);
          this._isLoading.set(false);
        },
        error: (err) => {
          this._error.set('Failed to load trending TV shows');
          this._isLoading.set(false);
          console.error('Error loading trending TV shows:', err);
        },
      });
  }

  getPopularShows(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http
      .get<TvResponse>(`${this.baseUrl}/tv/popular?api_key=${this.apiKey}&language=en-US`)
      .subscribe({
        next: (response) => {
          this._popularShows.set(response.results);
          this._isLoading.set(false);
        },
        error: (err) => {
          this._error.set('Failed to load popular TV shows');
          this._isLoading.set(false);
          console.error('Error loading popular TV shows:', err);
        },
      });
  }

  getTopRatedShows(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http
      .get<TvResponse>(`${this.baseUrl}/tv/top_rated?api_key=${this.apiKey}&language=en-US`)
      .subscribe({
        next: (response) => {
          this._topRatedShows.set(response.results);
          this._isLoading.set(false);
        },
        error: (err) => {
          this._error.set('Failed to load top rated TV shows');
          this._isLoading.set(false);
          console.error('Error loading top rated TV shows:', err);
        },
      });
  }

  getAiringToday(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http
      .get<TvResponse>(`${this.baseUrl}/tv/airing_today?api_key=${this.apiKey}&language=en-US`)
      .subscribe({
        next: (response) => {
          this._airingToday.set(response.results);
          this._isLoading.set(false);
        },
        error: (err) => {
          this._error.set('Failed to load airing today');
          this._isLoading.set(false);
          console.error('Error loading airing today:', err);
        },
      });
  }

  getOnTheAir(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http
      .get<TvResponse>(`${this.baseUrl}/tv/on_the_air?api_key=${this.apiKey}&language=en-US`)
      .subscribe({
        next: (response) => {
          this._onTheAir.set(response.results);
          this._isLoading.set(false);
        },
        error: (err) => {
          this._error.set('Failed to load on the air');
          this._isLoading.set(false);
          console.error('Error loading on the air:', err);
        },
      });
  }

  // ===================== TV Details (Observable) =====================

  // ✅ TV Details
  getTvDetails(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/tv/${id}?api_key=${this.apiKey}&language=en-US`
    );
  }

  // ✅ TV Credits (Cast & Crew)
  getTvCredits(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/tv/${id}/credits?api_key=${this.apiKey}&language=en-US`
    );
  }

  // ✅ Similar Shows
  getSimilarShows(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/tv/${id}/similar?api_key=${this.apiKey}&language=en-US`
    );
  }

  // ✅ TV Videos (Trailers)
  getTvVideos(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/tv/${id}/videos?api_key=${this.apiKey}&language=en-US`
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