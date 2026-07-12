import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';

@Component({
  selector: 'app-hero-slider',
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-slider.component.html',
  styleUrl: './hero-slider.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeroSliderComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  
  // ✅ Get only first 5 trending movies
  readonly trendingMovies = computed(() => {
    return this.movieService.trendingMovies().slice(0, 5);
  });

  ngOnInit(): void {
    this.movieService.getTrendingMovies();
  }

  getBackdropUrl(path: string | null): string {
    if (!path) return 'https://image.tmdb.org/t/p/w1280/1E5baAaEse26fej7uHcjOgEE2t2.jpg';
    return `https://image.tmdb.org/t/p/w1280${path}`;
  }

  getPosterUrl(path: string | null): string {
    if (!path) return '/assets/images/no-poster.jpg';
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  getRating(voteAverage: number): string {
    return voteAverage ? voteAverage.toFixed(1) : '0.0';
  }

  getYear(releaseDate: string): string {
    return releaseDate ? new Date(releaseDate).getFullYear().toString() : '';
  }

  getTitle(movie: any): string {
    return movie?.title || movie?.name || 'Untitled';
  }

  getOverview(movie: any): string {
    return movie?.overview || '';
  }

  getLink(movie: any): string {
    const id = movie?.id;
    return movie?.title ? `/movie/${id}` : `/tv/${id}`;
  }
}