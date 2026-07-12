import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WatchlistService } from '../../../core/services/watchlist.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly watchlistService = inject(WatchlistService);

  searchQuery = '';
  isMobileMenuOpen = signal(false);

  // ✅ Watchlist count for badge
  readonly watchlistCount = this.watchlistService.watchlistCount;

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
      this.searchQuery = '';
      this.isMobileMenuOpen.set(false);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}