import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv' | 'person';
  profile_path?: string | null;
  known_for?: any[];
}

export interface SearchResponse {
  page: number;
  results: SearchResult[];
  total_pages: number;
  total_results: number;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.tmdbBaseUrl;
  private readonly apiKey = environment.tmdbApiKey;

  // ===================== Signals =====================
  private readonly _searchResults = signal<SearchResult[]>([]);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _query = signal<string>('');

  // ===================== Public Signals =====================
  readonly searchResults = this._searchResults.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly query = this._query.asReadonly();

  // ===================== Methods =====================

  search(query: string, page: number = 1): void {
    if (!query.trim()) {
      this._searchResults.set([]);
      this._query.set('');
      return;
    }

    this._isLoading.set(true);
    this._error.set(null);
    this._query.set(query);

    this.http
      .get<SearchResponse>(
        `${this.baseUrl}/search/multi?api_key=${this.apiKey}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=${page}&include_adult=false`
      )
      .subscribe({
        next: (response) => {
          this._searchResults.set(response.results);
          this._isLoading.set(false);
        },
        error: (err) => {
          this._error.set('Failed to load search results');
          this._isLoading.set(false);
          console.error('Error searching:', err);
        },
      });
  }

  searchMovies(query: string, page: number = 1): void {
    if (!query.trim()) {
      this._searchResults.set([]);
      return;
    }

    this._isLoading.set(true);
    this._error.set(null);
    this._query.set(query);

    this.http
      .get<SearchResponse>(
        `${this.baseUrl}/search/movie?api_key=${this.apiKey}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=${page}`
      )
      .subscribe({
        next: (response) => {
          this._searchResults.set(response.results);
          this._isLoading.set(false);
        },
        error: (err) => {
          this._error.set('Failed to search movies');
          this._isLoading.set(false);
          console.error('Error searching movies:', err);
        },
      });
  }

  searchTv(query: string, page: number = 1): void {
    if (!query.trim()) {
      this._searchResults.set([]);
      return;
    }

    this._isLoading.set(true);
    this._error.set(null);
    this._query.set(query);

    this.http
      .get<SearchResponse>(
        `${this.baseUrl}/search/tv?api_key=${this.apiKey}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=${page}`
      )
      .subscribe({
        next: (response) => {
          this._searchResults.set(response.results);
          this._isLoading.set(false);
        },
        error: (err) => {
          this._error.set('Failed to search TV shows');
          this._isLoading.set(false);
          console.error('Error searching TV shows:', err);
        },
      });
  }

  clearResults(): void {
    this._searchResults.set([]);
    this._query.set('');
    this._error.set(null);
  }

  // ✅ Fixed: Handle null/undefined poster_path
  getPosterUrl(path: string | null | undefined): string {
    if (!path) return '/assets/images/no-poster.jpg';
    return `${environment.tmdbImageUrl}/${environment.posterSize}${path}`;
  }

  // ✅ Fixed: Handle null/undefined profile_path
  getProfileUrl(path: string | null | undefined): string {
    if (!path) return '/assets/images/no-avatar.jpg';
    return `${environment.tmdbImageUrl}/w185${path}`;
  }

  getTitle(result: SearchResult): string {
    return result?.title || result?.name || 'Untitled';
  }

  getDate(result: SearchResult): string {
    return result?.release_date || result?.first_air_date || '';
  }

  getYear(result: SearchResult): string {
    const date = this.getDate(result);
    return date ? new Date(date).getFullYear().toString() : '';
  }

  getMediaType(result: SearchResult): string {
    const types: { [key: string]: string } = {
      movie: 'Movie',
      tv: 'TV Show',
      person: 'Person',
    };
    return types[result?.media_type] || result?.media_type || 'Unknown';
  }

  getMediaIcon(result: SearchResult): string {
    const icons: { [key: string]: string } = {
      movie: 'fa-solid fa-film',
      tv: 'fa-solid fa-tv',
      person: 'fa-solid fa-user',
    };
    return icons[result?.media_type] || 'fa-solid fa-circle';
  }

  getKnownFor(result: SearchResult): string {
    if (!result?.known_for) return '';
    return result.known_for
      .map((k: any) => k.title || k.name || '')
      .filter(Boolean)
      .join(', ');
  }
}