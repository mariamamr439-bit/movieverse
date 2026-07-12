import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SearchService, SearchResult } from '../../core/services/search.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-search',
  imports: [CommonModule, RouterLink, FormsModule, MovieCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  private readonly searchService = inject(SearchService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly searchQuery = signal('');
  readonly searchResults = this.searchService.searchResults;
  readonly isLoading = this.searchService.isLoading;
  readonly error = this.searchService.error;
  readonly query = this.searchService.query;

  readonly filterType = signal<'all' | 'movie' | 'tv' | 'person'>('all');

  readonly filteredResults = computed(() => {
    const results = this.searchResults();
    const filter = this.filterType();
    if (filter === 'all') return results;
    return results.filter(r => r.media_type === filter);
  });

  readonly movieResults = computed(() => {
    return this.searchResults().filter(r => r.media_type === 'movie');
  });

  readonly tvResults = computed(() => {
    return this.searchResults().filter(r => r.media_type === 'tv');
  });

  readonly personResults = computed(() => {
    return this.searchResults().filter(r => r.media_type === 'person');
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const q = params['q'];
      if (q) {
        this.searchQuery.set(q);
        this.searchService.search(q);
      }
    });
  }

  onSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
      this.searchService.search(query);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchService.clearResults();
    this.router.navigate(['/search']);
  }

  setFilter(type: 'all' | 'movie' | 'tv' | 'person'): void {
    this.filterType.set(type);
  }

  getYear(result: SearchResult): string {
    return this.searchService.getYear(result);
  }

  getTitle(result: SearchResult): string {
    return this.searchService.getTitle(result);
  }

  getPosterUrl(path: string | null | undefined): string {
    return this.searchService.getPosterUrl(path);
  }

  getProfileUrl(path: string | null | undefined): string {
    return this.searchService.getProfileUrl(path);
  }

  getMediaType(result: SearchResult): string {
    return this.searchService.getMediaType(result);
  }

  getMediaIcon(result: SearchResult): string {
    return this.searchService.getMediaIcon(result);
  }

  getKnownFor(result: SearchResult): string {
    return this.searchService.getKnownFor(result);
  }

  getLink(result: SearchResult): string {
    if (!result || !result.id) return '#';
    switch (result.media_type) {
      case 'movie': return `/movie/${result.id}`;
      case 'tv': return `/tv/${result.id}`;
      case 'person': return `/person/${result.id}`;
      default: return '#';
    }
  }

  getRating(voteAverage: number): string {
    return voteAverage ? voteAverage.toFixed(1) : '0.0';
  }
}