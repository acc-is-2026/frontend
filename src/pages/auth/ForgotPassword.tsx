import { useForgotPasswordForm } from "@/hooks/auth/useForgotPasswordForm";
import {
  Alert,
  Button,
  Center,
  Paper,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconLock,
  IconMail,
} from "@tabler/icons-react";
import { Form, Link } from "react-router-dom";

const ForgotPassword = () => {
  const { email, setEmail, error, isLoading, isSent, handleSubmit } =
    useForgotPasswordForm();

  return (
    <Center mih={{ base: "auto", sm: "80vh" }}>
      <Paper
        withBorder
        radius="lg"
        p={{ base: "xl", lg: 48 }}
        w="100%"
        maw={570}
        shadow="sm"
      >
        <Stack align="center" mb={40} gap="xs">
          <ThemeIcon size={64} mb="sm">
            <IconLock size={32} />
          </ThemeIcon>

          <Title ta="center" order={1} size="h3">
            Forgot your password?
          </Title>

          <Text ta="center" c={"dimmed"} size="sm">
            Type in your email address associated with this account for a reset
            link.
          </Text>
        </Stack>

        {isSent ? (
          <Stack align="center">
            <Text ta="center" fw={500} c="green">
              Check your email!
            </Text>
            <Text ta="center" c="dimmed" size="sm">
              If the address <b>{email}</b> is associated with an account, you
              will get a reset password link.
            </Text>
            <Text
              component={Link}
              to={"/login"}
              c="primary"
              fw={600}
              size="sm"
              mt="xs"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <IconArrowLeft size={16} stroke={2} />
              Back to log in
            </Text>
          </Stack>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="name@example.com"
                leftSection={<IconMail size={18} />}
                type="email"
                withAsterisk
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />

              {error && (
                <Alert
                  variant="light"
                  color="red"
                  radius="md"
                  icon={<IconAlertCircle size={18} />}
                  mt="sm"
                >
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                size="lg"
                radius="md"
                fullWidth
                mt="xl"
                loading={isLoading}
              >
                Send link
              </Button>

              <Text
                component={Link}
                to={"/login"}
                c="primary"
                fw={600}
                size="sm"
                mt="xs"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <IconArrowLeft size={16} stroke={2} />
                Back to log in
              </Text>
            </Stack>
          </Form>
        )}
      </Paper>
    </Center>
  );
};

export default ForgotPassword;
