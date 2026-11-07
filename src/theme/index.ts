import {
  createTheme,
  TextInput,
  PasswordInput,
  Select,
  NumberInput,
} from "@mantine/core";
import { Textarea, type MantineColorsTuple } from "@mantine/core";

const primaryColors: MantineColorsTuple = [
  "#fff1ee",
  "#ffe2dc",
  "#ffc4b8",
  "#ffa38f",
  "#fe876e",
  "#fe7055",
  "#fe6348",
  "#e14c33",
  "#c83c25",
  "#ad2b17",
];

const inputStyles = {
  label: {
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.031em",
    marginBottom: "6px",
    color: "var(--mantine-color-dimmed)",
  },
  input: {
    borderRadius: "8px",
    color: "var(--mantine-color-gray-2)",
  },
  section: {
    color: "var(--mantine-color-gray-2)",
  },
};

export const theme = createTheme({
  colors: {
    primary: primaryColors,
  },
  primaryColor: "primary",
  fontFamily: "Inter, sans-serif",

  components: {
    Card: {
      defaultProps: {
        radius: "md",
        padding: "md",
        bg: "var(--mantine-color-dark-8)",
        c: "var(--mantine-color-gray-2)",
      },
    },
    Paper: {
      defaultProps: {
        radius: "md",
        bg: "var(--mantine-color-dark-8)",
        c: "white",
      },
    },
    Title: {
      defaultProps: {
        c: "white",
      },
    },

    TextInput: TextInput.extend({
      styles: inputStyles,
    }),

    PasswordInput: PasswordInput.extend({
      styles: inputStyles,
    }),

    Select: Select.extend({
      styles: inputStyles,
    }),

    Textarea: Textarea.extend({
      styles: inputStyles,
    }),

    NumberInput: NumberInput.extend({
      styles: inputStyles,
    }),

    ThemeIcon: {
      defaultProps: {
        radius: "100%",
        variant: "light",
        color: "primary.5",
        c: "primary.0",
      },
    },
  },
});
