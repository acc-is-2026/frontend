import { useMediaDetails } from "@/hooks/media/useMediaDetails";
import { MediaListCard } from "./MediaListCard";
import type { NormalizedMedia } from "@/utils/media.util";

interface DetailedMediaListCardProps {
  media: NormalizedMedia;
  showTypeIcon: boolean;
  onRemove?: () => Promise<void>;
}

const DetailedMediaListCard = ({
  media,
  showTypeIcon,
  onRemove,
}: DetailedMediaListCardProps) => {
  const details = useMediaDetails(media.id, media.mediaType);

  return (
    <MediaListCard
      id={media.id}
      title={media.title}
      mediaType={media.mediaType}
      posterPath={media.posterPath}
      backdropPath={details.backdropPath ?? media.backdropPath}
      year={media.year ?? details.year}
      genres={details.genres}
      runtime={details.runtime}
      certification={details.certification}
      showTypeIcon={showTypeIcon}
      onRemove={onRemove}
    />
  );
};

export default DetailedMediaListCard;
