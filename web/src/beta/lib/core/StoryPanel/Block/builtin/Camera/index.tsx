import { useCallback, useEffect, useMemo } from "react";

import { type ValueTypes } from "@reearth/beta/utils/value";

import type { CommonProps as BlockProps } from "../../types";
import usePropertyValueUpdate from "../common/useActionPropertyApi";
import BlockWrapper from "../common/Wrapper";

import CameraEditor, { type CameraBlock as CameraBlockType } from "./Editor";

export type Props = BlockProps;

const CameraBlock: React.FC<Props> = ({ block, isSelected, ...props }) => {
  const {
    handlePropertyValueUpdate,
    handleAddPropertyItem,
    handleRemovePropertyItem,
    handleMovePropertyItem,
  } = usePropertyValueUpdate();

  const cameraButtons = useMemo(
    () => Object.values(block?.property?.default) as CameraBlockType[],
    [block?.property?.default],
  );

  const handleUpdate = useCallback(
    (
      itemId: string,
      fieldId: string,
      fieldType: keyof ValueTypes,
      updatedValue: ValueTypes[keyof ValueTypes],
    ) => {
      if (!block?.propertyId || !itemId) return;

      handlePropertyValueUpdate(
        "default",
        block?.propertyId,
        fieldId,
        fieldType,
        itemId,
      )(updatedValue);
    },
    [block?.propertyId, handlePropertyValueUpdate],
  );

  const handleItemAdd = useCallback(() => {
    if (!block?.propertyId) return;
    handleAddPropertyItem(block.propertyId, "default");
  }, [block?.propertyId, handleAddPropertyItem]);

  const handleItemRemove = useCallback(
    (itemId: string) => {
      if (!block?.propertyId || !itemId) return;

      handleRemovePropertyItem(block.propertyId, "default", itemId);
    },
    [block?.propertyId, handleRemovePropertyItem],
  );

  const handleItemMove = useCallback(
    ({ id }: { id: string }, index: number) => {
      if (!block?.propertyId || !id) return;

      handleMovePropertyItem(block.propertyId, "default", { id }, index);
    },
    [block?.propertyId, handleMovePropertyItem],
  );

  // if there's no item add 1 button.
  // TODO: Should be added to block creationAPI for generic blocks that require at least 1 item
  useEffect(() => {
    if (!cameraButtons || cameraButtons.length === 0) {
      handleItemAdd();
      return;
    }
  }, [cameraButtons, handleItemAdd, handleUpdate]);

  return (
    <BlockWrapper
      name={block?.name}
      icon={block?.extensionId}
      isSelected={isSelected}
      propertyId={block?.propertyId}
      property={block?.property}
      settingsEnabled={false}
      {...props}>
      <CameraEditor
        items={cameraButtons}
        onUpdate={handleUpdate}
        onItemRemove={handleItemRemove}
        onItemAdd={handleItemAdd}
        onItemMove={handleItemMove}
        inEditor={!!props.isEditable}
      />
    </BlockWrapper>
  );
};

export default CameraBlock;