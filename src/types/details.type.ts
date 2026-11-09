export interface DetailsVideo {
  key: string;
  name: string;
  type: string;
}

export interface DetailsCastMember {
  id: string;
  name: string;
  character: string;
  profilePath: string | null;
  episodeCount?: number;
}
