export interface TvShow {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  media_type?: string;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}

export interface TvResponse {
  page: number;
  results: TvShow[];
  total_pages: number;
  total_results: number;
}

export interface TvDetails extends TvShow {
  created_by: Creator[];
  last_air_date: string;
  number_of_episodes: number;
  number_of_seasons: number;
  seasons: Season[];
  status: string;
  tagline: string;
  type: string;
  networks: Network[];
  production_companies: ProductionCompany[];
  spoken_languages: SpokenLanguage[];
}

export interface Creator {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string | null;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}