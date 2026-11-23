import { useMediaDetails } from "@/hooks/media/useMediaDetails";
import { MediaCard } from "./MediaCard";
import type { NormalizedMedia } from "@/utils/media.util";

interface DetailedMediaCardProps {
  media: NormalizedMedia;
  showTypeIcon: boolean;
}

const DetailedMediaCard = ({ media, showTypeIcon }: DetailedMediaCardProps) => {
  const details = useMediaDetails(media.id, media.mediaType);

  return (
    <MediaCard
      id={media.id}
      title={media.title}
      posterPath={media.posterPath}
      year={media.year}
      runtime={details.runtime}
      mediaType={media.mediaType}
      showTypeIcon={showTypeIcon}
    />
  );
};

export default DetailedMediaCard;
