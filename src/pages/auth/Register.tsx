import { useRegisterForm } from "@/hooks/auth/useRegisterForm";
import {
  Alert,
  Button,
  Center,
  Flex,
  Paper,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconIdBadge2,
  IconLock,
  IconMail,
  IconUserPlus,
} from "@tabler/icons-react";
import { Form, Link } from "react-router-dom";

const Register = () => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    handleSubmit,
  } = useRegisterForm();

  return (
    <Center mih={{ base: "auto", sm: "80vh" }}>
      <Paper
        withBorder
        radius="lg"
        p={{ base: "lg", lg: 40 }}
        w="100%"
        maw={570}
        shadow="sm"
      >
        <Stack align="center" mb={40} gap="xs">
          <ThemeIcon size={64} mb="sm">
            <IconUserPlus size={32} />
          </ThemeIcon>

          <Title ta="center" order={1} size="h3">
            Create a new account
          </Title>

          <Text ta="center" c={"dimmed"} size="sm">
            Create a new account to start.
          </Text>
        </Stack>

        <Form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Flex gap="md" wrap="wrap">
              <TextInput
                label="First name"
                placeholder="Your first name..."
                autoCapitalize="words"
                style={{ flex: "1 1 140px" }}
                leftSection={<IconIdBadge2 size={18} />}
                withAsterisk
                value={firstName}
                onChange={(e) => setFirstName(e.currentTarget.value)}
              />
              <TextInput
                label="Last name"
                placeholder="Your last name..."
                autoCapitalize="words"
                style={{ flex: "1 1 140px" }}
                leftSection={<IconIdBadge2 size={18} />}
                withAsterisk
                value={lastName}
                onChange={(e) => setLastName(e.currentTarget.value)}
              />
            </Flex>

            <TextInput
              label="Email"
              placeholder="nume@example.com"
              leftSection={<IconMail size={18} />}
              type="email"
              withAsterisk
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />

            <SimpleGrid cols={{ base: 1, xs: 2 }}>
              <PasswordInput
                label="Password"
                placeholder="••••••••"
                leftSection={<IconLock size={18} />}
                withAsterisk
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
              <PasswordInput
                label="Confirm password"
                placeholder="••••••••"
                leftSection={<IconLock size={18} />}
                withAsterisk
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              />
            </SimpleGrid>

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
              Create account
            </Button>

            <Text c={"dimmed"} ta="center" size="sm" mt="xs">
              Already have an account?{" "}
              <Text component={Link} to={"/login"} c="primary" fw={600}>
                Log in
              </Text>
            </Text>
          </Stack>
        </Form>
      </Paper>
    </Center>
  );
};

export default Register;
