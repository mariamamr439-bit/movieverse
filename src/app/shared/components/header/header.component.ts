import { Component, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WatchlistService } from '../../../core/services/watchlist.service';
import { SearchService, SearchResult } from '../../../core/services/search.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly watchlistService = inject(WatchlistService);
  private readonly searchService = inject(SearchService);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  searchQuery = '';
  isMobileMenuOpen = signal(false);
  isSearchFocused = signal(false);

  // Watchlist count for badge
  readonly watchlistCount = this.watchlistService.watchlistCount;

  // Search results for autocomplete
  readonly searchResults = this.searchService.searchResults;
  readonly isLoading = this.searchService.isLoading;

  onSearchInput(): void {
    const query = this.searchQuery.trim();
    if (query.length >= 2) {
      this.searchService.search(query);
      this.isSearchFocused.set(true);
    } else if (query.length === 0) {
      this.searchService.clearResults();
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
      this.searchQuery = '';
      this.isSearchFocused.set(false);
      this.isMobileMenuOpen.set(false);
    }
  }

  onInputFocus(): void {
    // ✅ Only show suggestions if there's a query
    if (this.searchQuery.trim().length >= 2) {
      this.isSearchFocused.set(true);
      this.searchService.search(this.searchQuery);
    } else {
      // ✅ Don't show empty suggestions box
      this.isSearchFocused.set(false);
      this.searchService.clearResults();
    }
  }

  onInputBlur(): void {
    setTimeout(() => {
      this.isSearchFocused.set(false);
    }, 300);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchService.clearResults();
    this.isSearchFocused.set(false);
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  selectSuggestion(result: SearchResult): void {
    const title = result.title || result.name || '';
    if (title) {
      this.searchQuery = title;
      this.router.navigate(['/search'], { queryParams: { q: title } });
      this.searchQuery = '';
      this.isSearchFocused.set(false);
      this.isMobileMenuOpen.set(false);
      this.searchService.clearResults();
    }
  }

  getTitle(result: SearchResult): string {
    return result.title || result.name || 'Untitled';
  }

  getYear(result: SearchResult): string {
    const date = result.release_date || result.first_air_date;
    return date ? new Date(date).getFullYear().toString() : '';
  }

  getMediaType(result: SearchResult): string {
    const types: { [key: string]: string } = {
      movie: 'Movie',
      tv: 'TV Show',
      person: 'Person',
    };
    return types[result.media_type] || result.media_type;
  }

  getPosterUrl(path: string | null | undefined): string {
    if (!path) return '';
    return `https://image.tmdb.org/t/p/w92${path}`;
  }

  getProfileUrl(path: string | null | undefined): string {
    if (!path) return '';
    return `https://image.tmdb.org/t/p/w92${path}`;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}