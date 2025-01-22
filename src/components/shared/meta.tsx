import { useAppDispatch } from "@/hooks/store.hooks";
import { setHeaderText } from "@/lib/store/services/defaults/defaults";
import React, { useCallback, useEffect } from "react";

export interface MetaProps {
  title: string;
  description?: string;
  keywords?: string;
  author?: string;
  header?: string;
  [key: string]: string | undefined;
}

const Meta: React.FC<MetaProps> = ({
  title,
  description,
  keywords,
  author,
  header,
  ...extra
}) => {
  const appName = import.meta.env.VITE_APP_NAME as string;
  const dispatch = useAppDispatch();
  const addedTags: string[] = [];
  const updateMetaTag = useCallback((name: string, content?: string) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag && content) {
      tag = document.createElement("meta");
      tag.setAttribute("name", name);
      document.head.appendChild(tag);
    }
    if (tag && content) {
      tag.setAttribute("content", content);
    } else if (tag && !content) {
      tag.remove();
    }
  }, []);

  const addOrUpdateMeta = (name: string, content?: string) => {
    const existingTag = document.querySelector(`meta[name="${name}"]`);
    if (!existingTag && content) {
      addedTags.push(name);
    }
    updateMetaTag(name, content);
  };
  useEffect(() => {
    if (title) {
      document.title = appName + " - " + title;
    }

    if (header) {
      dispatch(setHeaderText(header));
    }

    addOrUpdateMeta("description", description);
    addOrUpdateMeta("keywords", keywords);
    addOrUpdateMeta("author", author);

    Object.entries(extra).forEach(([key, value]) => {
      addOrUpdateMeta(key, value);
    });

    return () => {
      addedTags.forEach((name) => {
        const tag = document.querySelector(`meta[name="${name}"]`);
        if (tag) {
          tag.remove();
        }
      });
      if (title) {
        document.title = appName;
      }
      if (header) {
        dispatch(
          setHeaderText(`Welecome to your ${appName.toLowerCase()} Dashboard`)
        );
      }
    };
  }, [title, description, keywords, author, header, extra]);
  return null;
};

export default Meta;
