import { memo, type ReactNode } from "react";
import { Skeleton, Box } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { MediaSection } from "./MediaSection";
import DetailedMediaCard from "./DetailedMediaCard";
import type { NormalizedMedia } from "@/utils/media.util";

interface MediaShelfBaseProps {
  title: string;
  subtitle?: string;
  href?: string;
  action?: ReactNode;
  isLoading: boolean;
  showTypeIcon?: boolean;
  variant?: "poster" | "landscape";
  scrollToId?: string | number;
}

export type MediaShelfProps<T> = MediaShelfBaseProps &
  (
    | { items: T[]; renderItem: (item: T) => ReactNode }
    | { items: NormalizedMedia[]; renderItem?: undefined }
  );

const MediaShelfComponent = <T extends { id: string | number }>(
  props: MediaShelfProps<T>,
) => {
  const {
    title,
    subtitle,
    href,
    action,
    isLoading,
    showTypeIcon = false,
    variant = "poster",
    scrollToId,
  } = props;

  if (!isLoading && props.items.length === 0) return null;
  const isLandscape = variant === "landscape";

  const scrollToIndex =
    isLoading || scrollToId == null
      ? undefined
      : (props.items as { id: string | number }[]).findIndex(
          (item) => item.id === scrollToId,
        );

  const renderCards = (): { id: string | number; node: ReactNode }[] => {
    if (props.renderItem) {
      const { items, renderItem } = props;
      return items.map((item) => ({ id: item.id, node: renderItem(item) }));
    }
    return props.items.map((media) => ({
      id: media.id,
      node: <DetailedMediaCard media={media} showTypeIcon={showTypeIcon} />,
    }));
  };

  return (
    <MediaSection
      title={title}
      subtitle={subtitle}
      href={href}
      action={action}
      scrollToIndex={scrollToIndex}
    >
      {isLoading ? (
        Array.from({ length: 7 }).map((_, index) => (
          <Box
            key={index}
            style={{
              flex: "0 0 auto",
              width: isLandscape
                ? "clamp(240px, 26vw, 320px)"
                : "clamp(135px, 15vw, 190px)",
            }}
          >
            <Skeleton
              radius="12px"
              mb={8}
              style={{
                width: "100%",
                aspectRatio: isLandscape ? "16 / 9" : "2 / 3",
                height: "auto",
              }}
            />
            <Skeleton height={14} width="80%" radius="sm" mb={4} />
            <Skeleton height={10} width="40%" radius="sm" />
          </Box>
        ))
      ) : (
        <AnimatePresence mode="popLayout">
          {renderCards().map(({ id, node }) => (
            <motion.div
              key={id}
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                layout: { type: "spring", stiffness: 350, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              style={{ flex: "0 0 auto" }}
            >
              {node}
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </MediaSection>
  );
};

export const MediaShelf = memo(
  MediaShelfComponent,
) as typeof MediaShelfComponent;
