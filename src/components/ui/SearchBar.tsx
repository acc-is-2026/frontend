import { TextInput, ActionIcon } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useState, useEffect, type KeyboardEvent } from "react";

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export const SearchBar = ({
  onSearch,
  placeholder = "Search movies or tv shows...",
  initialValue = "",
}: SearchBarProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.trim() !== initialValue.trim()) {
        onSearch(value.trim());
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [value, initialValue, onSearch]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <TextInput
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      size="md"
      radius="lg"
      style={{ flex: 1, maxWidth: 500 }}
      leftSection={<IconSearch size={18} color="var(--mantine-color-gray-5)" />}
      rightSection={
        value ? (
          <ActionIcon
            radius="xl"
            variant="subtle"
            color="gray"
            onClick={handleClear}
          >
            <IconX size={16} />
          </ActionIcon>
        ) : null
      }
    />
  );
};
