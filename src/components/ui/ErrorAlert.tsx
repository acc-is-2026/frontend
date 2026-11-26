import { Alert, Box, Button, Group, Text } from "@mantine/core";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

const ErrorAlert = ({ title = "Error", message, onRetry }: ErrorAlertProps) => {
  return (
    <Alert
      variant="outline"
      color="red.9"
      radius="md"
      icon={<IconAlertCircle size={20} />}
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

        {onRetry && (
          <Button
            size="compact-sm"
            variant="light"
            color="red"
            leftSection={<IconRefresh size={14} />}
            onClick={onRetry}
            style={{ flexShrink: 0 }}
          >
            Try again
          </Button>
        )}
      </Group>
    </Alert>
  );
};

export default ErrorAlert;
