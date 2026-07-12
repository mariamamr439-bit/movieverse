export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  gender: number;
  known_for_department: string;
  popularity: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  gender: number;
  popularity: number;
}

export interface CreditsResponse {
  id: number;
  cast: Cast[];
  crew: Crew[];
}