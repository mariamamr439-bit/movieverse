import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('./features/movies/movies.component').then((c) => c.MoviesComponent),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./features/movie-details/movie-details.component').then(
        (c) => c.MovieDetailsComponent
      ),
  },
  {
    path: 'tv',
    loadComponent: () =>
      import('./features/tv-shows/tv-shows.component').then((c) => c.TvShowsComponent),
  },
  {
    path: 'tv/:id',
    loadComponent: () =>
      import('./features/tv-details/tv-details.component').then(
        (c) => c.TvDetailsComponent
      ),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search.component').then((c) => c.SearchComponent),
  },
  {
    path: 'genres',
    loadComponent: () =>
      import('./features/genres/genres.component').then((c) => c.GenresComponent),
  },
  {
    path: 'watchlist',
    loadComponent: () =>
      import('./features/watchlist/watchlist.component').then((c) => c.WatchlistComponent),
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(
        (c) => c.NotFoundComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];