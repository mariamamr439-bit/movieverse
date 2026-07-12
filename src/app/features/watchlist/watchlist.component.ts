import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { WatchlistService, WatchlistItem } from '../../core/services/watchlist.service';

@Component({
  selector: 'app-watchlist',
  imports: [CommonModule, RouterLink],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css',
})
export class WatchlistComponent {
  private readonly watchlistService = inject(WatchlistService);

  readonly watchlist = this.watchlistService.watchlist;
  readonly watchlistCount = this.watchlistService.watchlistCount;

  readonly filterType = signal<'all' | 'movie' | 'tv'>('all');

  readonly filteredWatchlist = computed(() => {
    const items = this.watchlist();
    const filter = this.filterType();
    if (filter === 'all') return items;
    return items.filter(item => item.media_type === filter);
  });

  readonly movieCount = computed(() => {
    return this.watchlist().filter(item => item.media_type === 'movie').length;
  });

  readonly tvCount = computed(() => {
    return this.watchlist().filter(item => item.media_type === 'tv').length;
  });

  setFilter(type: 'all' | 'movie' | 'tv'): void {
    this.filterType.set(type);
  }

  removeFromWatchlist(item: WatchlistItem): void {
    Swal.fire({
      title: 'Remove from Watchlist?',
      text: `Remove "${item.title || item.name}" from your watchlist?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel',
      background: '#0f172a',
      color: '#f8fafc',
    }).then((result) => {
      if (result.isConfirmed) {
        this.watchlistService.remove(item.id, item.media_type);
        Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: 'Item removed from watchlist.',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
          background: '#0f172a',
          color: '#f8fafc',
        });
      }
    });
  }

  clearWatchlist(): void {
    if (this.watchlist().length === 0) return;

    Swal.fire({
      title: 'Clear Watchlist?',
      text: 'This will remove all items from your watchlist.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Clear All',
      cancelButtonText: 'Cancel',
      background: '#0f172a',
      color: '#f8fafc',
    }).then((result) => {
      if (result.isConfirmed) {
        this.watchlistService.clear();
        Swal.fire({
          icon: 'success',
          title: 'Cleared!',
          text: 'Watchlist has been cleared.',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
          background: '#0f172a',
          color: '#f8fafc',
        });
      }
    });
  }

  getTitle(item: WatchlistItem): string {
    return item.title || item.name || 'Untitled';
  }

  getYear(item: WatchlistItem): string {
    const date = item.release_date || item.first_air_date;
    return date ? new Date(date).getFullYear().toString() : '';
  }

  // ✅ Fixed: Handle undefined poster_path
  getPosterUrl(path: string | null | undefined): string {
    if (!path) return '/assets/images/no-poster.jpg';
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  getLink(item: WatchlistItem): string {
    return item.media_type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;
  }
}