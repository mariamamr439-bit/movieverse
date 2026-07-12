import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { GenreService } from '../../core/services/genre.service';

@Component({
  selector: 'app-genres',
  imports: [CommonModule, RouterLink],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.css',
})
export class GenresComponent implements OnInit {
  private readonly genreService = inject(GenreService);

  readonly movieGenres = this.genreService.movieGenres;
  readonly isLoading = this.genreService.isLoading;
  readonly error = this.genreService.error;

  // Genre icons mapping
  readonly genreIcons: { [key: string]: string } = {
    'Action': 'fa-solid fa-fist-raised',
    'Adventure': 'fa-solid fa-compass',
    'Animation': 'fa-solid fa-film',
    'Comedy': 'fa-solid fa-laugh',
    'Crime': 'fa-solid fa-gavel',
    'Documentary': 'fa-solid fa-video',
    'Drama': 'fa-solid fa-mask',
    'Family': 'fa-solid fa-users',
    'Fantasy': 'fa-solid fa-hat-wizard',
    'History': 'fa-solid fa-landmark',
    'Horror': 'fa-solid fa-skull',
    'Music': 'fa-solid fa-music',
    'Mystery': 'fa-solid fa-question',
    'Romance': 'fa-solid fa-heart',
    'Science Fiction': 'fa-solid fa-rocket',
    'Thriller': 'fa-solid fa-bolt',
    'War': 'fa-solid fa-tank',
    'Western': 'fa-solid fa-hat-cowboy',
  };

  // Genre colors
  readonly genreColors: { [key: string]: string } = {
    'Action': '#E50914',
    'Adventure': '#F59E0B',
    'Animation': '#8B5CF6',
    'Comedy': '#22C55E',
    'Crime': '#EF4444',
    'Documentary': '#3B82F6',
    'Drama': '#EC4899',
    'Family': '#06B6D4',
    'Fantasy': '#A855F7',
    'History': '#F97316',
    'Horror': '#DC2626',
    'Music': '#8B5CF6',
    'Mystery': '#6366F1',
    'Romance': '#EC4899',
    'Science Fiction': '#3B82F6',
    'Thriller': '#F59E0B',
    'War': '#DC2626',
    'Western': '#D97706',
  };

  // Random movie counts for each genre (mock data)
  readonly genreCounts: { [key: string]: number } = {
    'Action': 1224,
    'Adventure': 987,
    'Animation': 456,
    'Comedy': 1548,
    'Crime': 789,
    'Documentary': 321,
    'Drama': 2345,
    'Family': 567,
    'Fantasy': 678,
    'History': 234,
    'Horror': 876,
    'Music': 123,
    'Mystery': 456,
    'Romance': 789,
    'Science Fiction': 543,
    'Thriller': 987,
    'War': 234,
    'Western': 123,
  };

  ngOnInit(): void {
    this.genreService.getMovieGenres();
  }

  getGenreCount(genreName: string): number {
    return this.genreCounts[genreName] || Math.floor(Math.random() * 2000) + 100;
  }

  getGenreIcon(genreName: string): string {
    return this.genreIcons[genreName] || 'fa-solid fa-tag';
  }

  getGenreColor(genreName: string): string {
    return this.genreColors[genreName] || '#8B5CF6';
  }

  getGenreBgColor(genreName: string): string {
    const color = this.getGenreColor(genreName);
    return color + '15';
  }

  // ✅ Add this method to expose clearError to template
  clearError(): void {
    this.genreService.clearError();
  }

  // ✅ Add this method to expose retry to template
  retry(): void {
    this.genreService.clearError();
    this.genreService.getMovieGenres();
  }
}