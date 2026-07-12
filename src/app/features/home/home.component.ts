import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MovieService } from '../../core/services/movie.service';
import { TvService } from '../../core/services/tv.service';
import { HeroSliderComponent } from '../hero-slider/hero-slider.component';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, HeroSliderComponent, MovieCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly tvService = inject(TvService);

  // Movies
  readonly trendingMovies = this.movieService.trendingMovies;
  readonly popularMovies = this.movieService.popularMovies;
  readonly topRatedMovies = this.movieService.topRatedMovies;
  readonly nowPlayingMovies = this.movieService.nowPlayingMovies;

  // TV Shows
  readonly trendingTvShows = this.tvService.trendingShows;
  readonly popularTvShows = this.tvService.popularShows;
  readonly topRatedTvShows = this.tvService.topRatedShows;

  ngOnInit(): void {
    // Movies
    this.movieService.getTrendingMovies();
    this.movieService.getPopularMovies();
    this.movieService.getTopRatedMovies();
    this.movieService.getNowPlayingMovies();

    // TV Shows
    this.tvService.getTrendingShows();
    this.tvService.getPopularShows();
    this.tvService.getTopRatedShows();
  }
}