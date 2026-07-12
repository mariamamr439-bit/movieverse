import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface WatchlistItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv';
  addedAt?: number;
}

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  private readonly STORAGE_KEY = 'movieverse_watchlist';
  
  private readonly _watchlist = signal<WatchlistItem[]>([]);

  readonly watchlist = this._watchlist.asReadonly();
  readonly watchlistCount = computed(() => this._watchlist().length);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // ✅ Only load from storage in browser
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    // ✅ Only run in browser
    if (!isPlatformBrowser(this.platformId)) return;
    
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        this._watchlist.set(JSON.parse(data));
      } catch (e) {
        this._watchlist.set([]);
      }
    }
  }

  private saveToStorage(): void {
    // ✅ Only run in browser
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._watchlist()));
  }

  add(item: WatchlistItem): void {
    const current = this._watchlist();
    if (!current.find(m => m.id === item.id && m.media_type === item.media_type)) {
      this._watchlist.set([...current, { ...item, addedAt: Date.now() }]);
      this.saveToStorage();
    }
  }

  remove(id: number, mediaType: 'movie' | 'tv'): void {
    this._watchlist.set(
      this._watchlist().filter(item => !(item.id === id && item.media_type === mediaType))
    );
    this.saveToStorage();
  }

  toggle(item: { id: number; title?: string; name?: string; poster_path?: string | null; vote_average?: number; release_date?: string; first_air_date?: string; media_type: 'movie' | 'tv' }): void {
    const isInWatchlist = this.isInWatchlist(item.id, item.media_type);
    if (isInWatchlist) {
      this.remove(item.id, item.media_type);
    } else {
      this.add(item);
    }
  }

  isInWatchlist(id: number, mediaType: 'movie' | 'tv'): boolean {
    return this._watchlist().some(item => item.id === id && item.media_type === mediaType);
  }

  clear(): void {
    this._watchlist.set([]);
    this.saveToStorage();
  }

  getWatchlistItems(): WatchlistItem[] {
    return this._watchlist();
  }
}