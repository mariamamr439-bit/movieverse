import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

import { TvService } from '../../core/services/tv.service';
import { GenreService } from '../../core/services/genre.service';
import { WatchlistService } from '../../core/services/watchlist.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-tv-details',
  imports: [CommonModule, RouterLink, MovieCardComponent],
  templateUrl: './tv-details.component.html',
  styleUrl: './tv-details.component.css',
})
export class TvDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly tvService = inject(TvService);
  private readonly genreService = inject(GenreService);
  private readonly watchlistService = inject(WatchlistService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly tvId = signal<number | null>(null);
  readonly tvShow = signal<any>(null);
  readonly credits = signal<any>(null);
  readonly similarShows = signal<any[]>([]);
  readonly videos = signal<any[]>([]);
  readonly isLoading = signal(false);
  readonly activeTab = signal<'overview' | 'cast' | 'seasons' | 'similar'>('overview');

  // Check if TV show is in watchlist
  readonly isInWatchlist = computed(() => {
    const tv = this.tvShow();
    if (!tv) return false;
    return this.watchlistService.isInWatchlist(tv.id, 'tv');
  });

  // Get main cast (top 10)
  readonly mainCast = computed(() => {
    const cast = this.credits()?.cast || [];
    return cast.slice(0, 10);
  });

  // Get creators
  readonly creators = computed(() => {
    const createdBy = this.tvShow()?.created_by || [];
    return createdBy.map((c: any) => c.name).join(', ');
  });

  // Get genre names
  readonly genreNames = computed(() => {
    const tv = this.tvShow();
    if (!tv?.genres) return [];
    return tv.genres.map((g: any) => g.name);
  });

  // Get seasons
  readonly seasons = computed(() => {
    return this.tvShow()?.seasons || [];
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

  // Get status badge color
  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'returning series':
        return '#22C55E';
      case 'ended':
        return '#EF4444';
      case 'canceled':
        return '#EF4444';
      case 'in production':
        return '#F59E0B';
      default:
        return '#64748B';
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (id) {
        this.tvId.set(id);
        this.loadTvDetails(id);
      }
    });
  }

  loadTvDetails(id: number): void {
    this.isLoading.set(true);

    this.tvService.getTvDetails(id).subscribe({
      next: (data) => {
        this.tvShow.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading TV details:', err);
        this.isLoading.set(false);
      },
    });

    this.tvService.getTvCredits(id).subscribe({
      next: (data) => {
        this.credits.set(data);
      },
      error: (err) => {
        console.error('Error loading credits:', err);
      },
    });

    this.tvService.getSimilarShows(id).subscribe({
      next: (data) => {
        this.similarShows.set(data.results || []);
      },
      error: (err) => {
        console.error('Error loading similar shows:', err);
      },
    });

    this.tvService.getTvVideos(id).subscribe({
      next: (data) => {
        this.videos.set(data.results || []);
      },
      error: (err) => {
        console.error('Error loading videos:', err);
      },
    });
  }

  // ✅ Toggle Watchlist
  toggleWatchlist(): void {
    const tv = this.tvShow();
    if (!tv) return;

    const watchlistItem = {
      id: tv.id,
      name: tv.name,
      poster_path: tv.poster_path,
      vote_average: tv.vote_average,
      first_air_date: tv.first_air_date,
      media_type: 'tv' as const,
    };

    this.watchlistService.toggle(watchlistItem);

    const isNowInWatchlist = this.watchlistService.isInWatchlist(tv.id, 'tv');

    Swal.fire({
      icon: 'success',
      title: isNowInWatchlist ? 'Added to Watchlist' : 'Removed from Watchlist',
      text: isNowInWatchlist 
        ? `${tv.name} has been added to your watchlist.`
        : `${tv.name} has been removed from your watchlist.`,
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      background: '#0f172a',
      color: '#f8fafc',
    });
  }

  getPosterUrl(path: string | null): string {
    return this.tvService.getPosterUrl(path);
  }

  getBackdropUrl(path: string | null): string {
    return this.tvService.getBackdropUrl(path);
  }

  setTab(tab: 'overview' | 'cast' | 'seasons' | 'similar'): void {
    this.activeTab.set(tab);
  }

  getGenreName(id: number): string {
    return this.genreService.getGenreName(id, 'tv');
  }
}