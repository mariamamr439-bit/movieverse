import { Component, inject, OnInit, signal, computed, effect, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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
export class SearchComponent implements OnInit, AfterViewInit {
  private readonly searchService = inject(SearchService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  readonly searchQuery = signal('');
  readonly searchResults = this.searchService.searchResults;
  readonly isLoading = this.searchService.isLoading;
  readonly error = this.searchService.error;
  readonly query = this.searchService.query;
  readonly isInputFocused = signal(false);

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

  readonly suggestionsList = computed(() => {
    const results = this.searchResults();
    return results.slice(0, 8);
  });

  constructor() {
    effect(() => {
      if (this.searchInput) {
        this.searchInput.nativeElement.focus();
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const q = params['q'];
      if (q) {
        this.searchQuery.set(q);
        // ✅ Trigger search immediately when navigating from nav
        this.searchService.search(q);
        this.isInputFocused.set(true);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.nativeElement.focus();
        if (this.searchQuery()) {
          this.searchService.search(this.searchQuery());
          this.isInputFocused.set(true);
        }
      }
    }, 300);
  }

  // ✅ Search as you type - triggered on every keystroke
  onSearchInput(): void {
    const query = this.searchQuery().trim();
    if (query.length >= 2) {
      // ✅ Update URL with query param
      this.router.navigate(['/search'], { queryParams: { q: query }, replaceUrl: true });
      this.searchService.search(query);
      this.isInputFocused.set(true);
    } else if (query.length === 0) {
      this.searchService.clearResults();
      this.router.navigate(['/search']);
    }
  }

  onSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
      this.searchService.search(query);
      this.isInputFocused.set(true);
    }
  }

  onInputFocus(): void {
    this.isInputFocused.set(true);
    if (this.searchQuery().trim().length >= 2) {
      this.searchService.search(this.searchQuery());
    }
  }

  onInputBlur(): void {
    setTimeout(() => {
      this.isInputFocused.set(false);
    }, 300);
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
    this.isInputFocused.set(false);
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  selectSuggestion(result: SearchResult): void {
    this.searchQuery.set(this.getTitle(result));
    this.router.navigate(['/search'], { queryParams: { q: this.getTitle(result) } });
    this.searchService.search(this.getTitle(result));
    this.isInputFocused.set(true);
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