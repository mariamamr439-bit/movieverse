import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css',
})
export class MovieCardComponent {
  readonly movie = input<any>();
  readonly type = input<'movie' | 'tv'>('movie');

  readonly posterUrl = computed(() => {
    const path = this.movie()?.poster_path;
    if (!path) return '/assets/images/no-poster.jpg';
    return `https://image.tmdb.org/t/p/w500${path}`;
  });

  readonly title = computed(() => {
    const movie = this.movie();
    return movie?.title || movie?.name || 'Untitled';
  });

  readonly year = computed(() => {
    const movie = this.movie();
    const date = movie?.release_date || movie?.first_air_date;
    return date ? new Date(date).getFullYear() : null;
  });

  readonly rating = computed(() => {
    const movie = this.movie();
    return movie?.vote_average ? movie.vote_average.toFixed(1) : null;
  });

  readonly link = computed(() => {
    const id = this.movie()?.id;
    return this.type() === 'movie' ? `/movie/${id}` : `/tv/${id}`;
  });
}