import { Alert, Box, Group, Text } from "@mantine/core";
import { IconInbox } from "@tabler/icons-react";

interface EmptyListProps {
  title?: string;
  message?: string;
}

const EmptyList = ({
  title = "List is empty",
  message = "Couldn't find any items to list here.",
}: EmptyListProps) => {
  return (
    <Alert
      variant="outline"
      color="dark.7"
      radius="md"
      icon={<IconInbox color="var(--mantine-color-gray-7)" size={20} />}
      bg="dark.8"
      styles={{
        icon: { alignSelf: "center" },
        body: { justifyContent: "center" },
      }}
    >
      <Group justify="space-between" align="center" wrap="nowrap" gap="md">
        <Box>
          <Text size="md" fw={600}>
            {title}
          </Text>
          <Text size="sm" c="dimmed" lineClamp={2} mt={2}>
            {message}
          </Text>
        </Box>
      </Group>
    </Alert>
  );
};

export default EmptyList;
