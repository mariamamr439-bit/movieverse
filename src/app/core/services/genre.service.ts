import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Genre, GenreResponse } from '../models/genre.interface';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.tmdbBaseUrl;
  private readonly apiKey = environment.tmdbApiKey;

  // ===================== Signals =====================
  private readonly _movieGenres = signal<Genre[]>([]);
  private readonly _tvGenres = signal<Genre[]>([]);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  // ===================== Public Signals =====================
  readonly movieGenres = this._movieGenres.asReadonly();
  readonly tvGenres = this._tvGenres.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // ===================== Methods =====================

  getMovieGenres(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http
      .get<GenreResponse>(`${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=en-US`)
      .subscribe({
        next: (response) => {
          this._movieGenres.set(response.genres);
          this._isLoading.set(false);
        },
        error: (err) => {
          this._error.set('Failed to load movie genres');
          this._isLoading.set(false);
          console.error('Error loading movie genres:', err);
        },
      });
  }

  getTvGenres(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http
      .get<GenreResponse>(`${this.baseUrl}/genre/tv/list?api_key=${this.apiKey}&language=en-US`)
      .subscribe({
        next: (response) => {
          this._tvGenres.set(response.genres);
          this._isLoading.set(false);
        },
        error: (err) => {
          this._error.set('Failed to load TV genres');
          this._isLoading.set(false);
          console.error('Error loading TV genres:', err);
        },
      });
  }

  // ===================== Helper Methods =====================

  getGenreName(id: number, type: 'movie' | 'tv' = 'movie'): string {
    const genres = type === 'movie' ? this._movieGenres() : this._tvGenres();
    const genre = genres.find(g => g.id === id);
    return genre?.name || 'Unknown';
  }

  getGenreNames(ids: number[], type: 'movie' | 'tv' = 'movie'): string[] {
    const genres = type === 'movie' ? this._movieGenres() : this._tvGenres();
    return ids
      .map(id => genres.find(g => g.id === id)?.name)
      .filter((name): name is string => name !== undefined);
  }

  getGenresString(ids: number[], type: 'movie' | 'tv' = 'movie', limit: number = 3): string {
    const names = this.getGenreNames(ids, type);
    return names.slice(0, limit).join(' • ');
  }

  clearError(): void {
    this._error.set(null);
  }
}