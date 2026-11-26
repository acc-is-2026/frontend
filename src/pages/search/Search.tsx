import {
  Box,
  Container,
  SimpleGrid,
  Group,
  Stack,
  Loader,
  Center,
  Title,
} from "@mantine/core";
import { useFilterStore } from "@/store/useFilterStore";
import { SearchBar } from "@/components/ui/SearchBar";
import { MediaFilterTabs } from "@/components/layout/MediaFilterTabs";
import { normalizeTmdbItem } from "@/utils/media.util";
import EmptyList from "@/components/ui/EmptyList";
import { AnimatePresence, motion } from "framer-motion";
import ErrorAlert from "@/components/ui/ErrorAlert";
import useSearch from "@/hooks/useSearch";
import DetailedMediaListCard from "@/components/media/DetailedMediaListCard";

export const Search = () => {
  const { mediaType } = useFilterStore();
  const { query, handleSearch, error, isLoading, results, refetch } =
    useSearch(mediaType);

  let pageTitle;
  if (!query) pageTitle = "Top Searches";
  else if (mediaType === "ALL") pageTitle = "Media";
  else if (mediaType === "MOVIE") pageTitle = "Movies";
  else pageTitle = "Shows";

  return (
    <Container size="xl" px={0} pb={40}>
      <Stack gap="lg" mb="xl">
        <Box display="flex" style={{ justifyContent: "center" }}>
          <SearchBar onSearch={handleSearch} initialValue={query} />
        </Box>

        <Group justify="center">
          <MediaFilterTabs />
        </Group>
      </Stack>

      <Title size="xl" mb="lg">
        {pageTitle}
      </Title>

      {error && !isLoading && (
        <ErrorAlert
          title="Something went wrong"
          message={error}
          onRetry={refetch}
        />
      )}

      {isLoading ? (
        <Center h={100}>
          <Loader color="primary.6" type="dots" />
        </Center>
      ) : results.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          <AnimatePresence mode="popLayout">
            {results.map((item) => {
              return (
                <motion.div
                  key={`${item.media_type}-${item.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    layout: { type: "spring", stiffness: 350, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <DetailedMediaListCard
                    key={item.id}
                    media={normalizeTmdbItem(
                      item,
                      mediaType === "TV" ? "TV" : "MOVIE",
                    )}
                    showTypeIcon={mediaType === "ALL"}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </SimpleGrid>
      ) : (
        query && !isLoading && <EmptyList title="No results..." />
      )}
    </Container>
  );
};
