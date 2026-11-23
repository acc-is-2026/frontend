import { useState } from "react";
import { ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

interface RemoveButtonProps {
  onRemove: () => Promise<void>;
}

const RemoveButton = ({ onRemove }: RemoveButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      await onRemove();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ActionIcon
      variant="subtle"
      color="red"
      size="sm"
      pos="absolute"
      top={8}
      right={8}
      style={{ zIndex: 2 }}
      aria-label="Remove"
      loading={loading}
      onClick={handleClick}
    >
      <IconTrash size={16} />
    </ActionIcon>
  );
};

export default RemoveButton;
