import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  size?: string;
}

const BackButton = ({ size = "compact-sm" }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="subtle"
      color="gray"
      size={size}
      onClick={() => navigate(-1)}
    >
      <IconArrowLeft size={18} />
    </Button>
  );
};

export default BackButton;
