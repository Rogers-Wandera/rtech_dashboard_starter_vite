import { Text, TextProps, Button } from "@mantine/core";
import DOMPurify from "dompurify";
import htmlTruncate from "html-truncate";
import React, { useState, useMemo } from "react";

type Props = {
  html: string;
  length?: number;
  textProps?: TextProps;
  withToggle?: boolean;
};

function TruncatedHtml({
  html,
  length,
  textProps = {},
  withToggle = false,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const content = useMemo(() => {
    const cleanHtml = DOMPurify.sanitize(html);

    if (!length || cleanHtml.length <= length) {
      return (
        <Text
          component="div"
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
          {...textProps}
        />
      );
    }

    if (isExpanded && withToggle) {
      return (
        <Text
          component="div"
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
          {...textProps}
        />
      );
    }

    const truncatedHtml = htmlTruncate(cleanHtml, length, {
      ellipsis: "...",
    });

    return (
      <Text
        component="div"
        dangerouslySetInnerHTML={{ __html: truncatedHtml }}
        {...textProps}
      />
    );
  }, [html, length, isExpanded, withToggle, textProps]);

  const shouldShowToggle = withToggle && length && html.length > length;

  return (
    <div>
      {content}
      {shouldShowToggle && (
        <Button
          variant="subtle"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ padding: 0 }}
        >
          {isExpanded ? "Show Less" : "Read More"}
        </Button>
      )}
    </div>
  );
}

export default React.memo(TruncatedHtml);
