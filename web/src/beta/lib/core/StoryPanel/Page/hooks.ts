import { useCallback, useEffect, useMemo, useState } from "react";

import { ValueTypes } from "@reearth/beta/utils/value";

import type { Page } from "../hooks";
import { getFieldValue } from "../utils";

export type { Page } from "../hooks";

export default ({
  page,
  onBlockCreate,
}: {
  page?: Page;
  onBlockCreate?: (
    extensionId?: string | undefined,
    pluginId?: string | undefined,
    index?: number | undefined,
  ) => Promise<void> | undefined;
}) => {
  const storyBlocks = useMemo(() => page?.blocks, [page?.blocks]);

  const [items, setItems] = useState(storyBlocks ? storyBlocks : []);
  const [openBlocksIndex, setOpenBlocksIndex] = useState<number>();

  const propertyItems = useMemo(() => page?.property.items, [page?.property]);

  const padding = useMemo(
    () => getFieldValue(propertyItems ?? [], "padding", "panel") as ValueTypes["spacing"],
    [propertyItems],
  );

  const gap = useMemo(
    () => getFieldValue(propertyItems ?? [], "gap", "panel") as ValueTypes["number"],
    [propertyItems],
  );

  const titleProperty = useMemo(
    () => propertyItems?.find(i => i.schemaGroup === "title"),
    [propertyItems],
  );

  const handleBlockOpen = useCallback(
    (index: number) => {
      if (openBlocksIndex === index) {
        setOpenBlocksIndex(undefined);
      } else {
        setOpenBlocksIndex(index);
      }
    },
    [openBlocksIndex],
  );

  const titleId = useMemo(() => `${page?.id}/title`, [page?.id]);

  const handleBlockCreate = useCallback(
    (index: number) => (extensionId?: string | undefined, pluginId?: string | undefined) =>
      onBlockCreate?.(extensionId, pluginId, index),
    [onBlockCreate],
  );

  useEffect(() => {
    storyBlocks && setItems(storyBlocks);
  }, [storyBlocks]);

  return {
    openBlocksIndex,
    titleId,
    titleProperty,
    propertyItems,
    padding,
    gap,
    storyBlocks,
    items,
    setItems,
    handleBlockOpen,
    handleBlockCreate,
  };
};