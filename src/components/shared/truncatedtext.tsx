import { useState } from "react";
import { Text, Button } from "@mantine/core";

type props = {
  text: string;
  maxLength?: number;
};
const TruncatedText = ({ text, maxLength = 100 }: props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded((prev) => !prev);
  };

  const displayText = isExpanded
    ? text
    : `${text.slice(0, maxLength)}${text.length > maxLength ? "..." : ""}`;

  return (
    <>
      <Text fz="sm" c="dimmed" mt={5}>
        {displayText}
        {text.length > maxLength && (
          <Button
            variant="transparent"
            size="xs"
            mt={5}
            onClick={toggleReadMore}
          >
            {isExpanded ? "Read Less" : "Read More"}
          </Button>
        )}
      </Text>
    </>
  );
};

export default TruncatedText;
