import React, { useCallback } from 'react';

import { SelectableValue, StandardEditorProps } from '@grafana/data';
import { InlineField, InlineFieldRow, RadioButtonGroup } from '@grafana/ui/src';
import { t } from 'app/core/internationalization';
import { BackgroundImageSize } from 'app/features/canvas';

export const BackgroundSizeEditor = ({ value, onChange }: StandardEditorProps<string, undefined, undefined>) => {
  const options: Array<SelectableValue<BackgroundImageSize>> = [
    { value: BackgroundImageSize.Original, label: t('plugins.canvas.original', 'Original') },
    { value: BackgroundImageSize.Contain, label: t('plugins.canvas.contain', 'Contain') },
    { value: BackgroundImageSize.Cover, label: t('plugins.canvas.cover', 'Cover') },
    { value: BackgroundImageSize.Fill, label: t('plugins.canvas.fill', 'Fill') },
    { value: BackgroundImageSize.Tile, label: t('plugins.canvas.tile', 'Tile') },
  ];
  const imageSize = value ?? BackgroundImageSize.Cover;

  const onImageSizeChange = useCallback(
    (size: string) => {
      onChange(size);
    },
    [onChange]
  );

  return (
    <InlineFieldRow>
      <InlineField grow={true}>
        <RadioButtonGroup value={imageSize} options={options} onChange={onImageSizeChange} fullWidth />
      </InlineField>
    </InlineFieldRow>
  );
};
