import React, { ChangeEvent } from 'react';

import {
  DataTransformerID,
  SelectableValue,
  standardTransformers,
  TransformerRegistryItem,
  TransformerUIProps,
} from '@grafana/data';
import {
  ConcatenateFrameNameMode,
  ConcatenateTransformerOptions,
} from '@grafana/data/src/transformations/transformers/concat';
import { Input, Select } from '@grafana/ui';
import { t, Trans } from 'app/core/internationalization';

interface ConcatenateTransformerEditorProps extends TransformerUIProps<ConcatenateTransformerOptions> {}

const nameModes: Array<SelectableValue<ConcatenateFrameNameMode>> = [
  { value: ConcatenateFrameNameMode.FieldName, label: 'Copy frame name to field name' },
  { value: ConcatenateFrameNameMode.Label, label: 'Add a label with the frame name' },
  { value: ConcatenateFrameNameMode.Drop, label: 'Ignore the frame name' },
];
const getNameModes = () => [
  {
    value: ConcatenateFrameNameMode.FieldName,
    label: t('features.transformers.editors.copy-frame-name-to-field-name', 'Copy frame name to field name'),
  },
  {
    value: ConcatenateFrameNameMode.Label,
    label: t('features.transformers.editors.add-a-label-with-the-frame-name', 'Add a label with the frame name'),
  },
  {
    value: ConcatenateFrameNameMode.Drop,
    label: t('features.transformers.editors.ignore-the-frame-name', 'Ignore the frame name'),
  },
];

export class ConcatenateTransformerEditor extends React.PureComponent<ConcatenateTransformerEditorProps> {
  constructor(props: ConcatenateTransformerEditorProps) {
    super(props);
  }

  onModeChanged = (value: SelectableValue<ConcatenateFrameNameMode>) => {
    const { options, onChange } = this.props;
    const frameNameMode = value.value ?? ConcatenateFrameNameMode.FieldName;
    onChange({
      ...options,
      frameNameMode,
    });
  };

  onLabelChanged = (evt: ChangeEvent<HTMLInputElement>) => {
    const { options } = this.props;
    this.props.onChange({
      ...options,
      frameNameLabel: evt.target.value,
    });
  };

  //---------------------------------------------------------
  // Render
  //---------------------------------------------------------

  render() {
    const { options } = this.props;

    const frameNameMode = options.frameNameMode ?? ConcatenateFrameNameMode.FieldName;

    return (
      <div>
        <div className="gf-form-inline">
          <div className="gf-form">
            <div className="gf-form-label width-8">
              <Trans i18nKey="features.transformers.editors.name">Name</Trans>
            </div>
            <Select
              className="width-18"
              options={getNameModes()}
              value={getNameModes().find((v) => v.value === frameNameMode)}
              onChange={this.onModeChanged}
            />
          </div>
        </div>
        {frameNameMode === ConcatenateFrameNameMode.Label && (
          <div className="gf-form-inline">
            <div className="gf-form">
              <div className="gf-form-label width-8">
                <Trans i18nKey="features.transformers.editors.label">Label</Trans>
              </div>
              <Input
                className="width-18"
                value={options.frameNameLabel ?? ''}
                placeholder="frame"
                onChange={this.onLabelChanged}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
export const getConcatenateTransformRegistryItem = (): TransformerRegistryItem<ConcatenateTransformerOptions> => {
  return {
    id: DataTransformerID.concatenate,
    editor: ConcatenateTransformerEditor,
    transformation: standardTransformers.concatenateTransformer,
    name: t('features.transformers.concatenate-fields', 'Concatenate fields'),
    description: t(
      'features.transformers.editors.combine-all-fields-into-a-single-frame',
      'Combine all fields into a single frame.  Values will be appended with undefined values if not the same length.'
    ),
  };
};
//  <Trans i18nKey="features.dashboard.setting.delete-title">Delete</Trans>/
export const concatenateTransformRegistryItem: TransformerRegistryItem<ConcatenateTransformerOptions> = {
  id: DataTransformerID.concatenate,
  editor: ConcatenateTransformerEditor,
  transformation: standardTransformers.concatenateTransformer,
  name: t('features.transformers.concatenate-fields', 'Concatenate fields'),
  description: t(
    'features.transformers.editors.combine-all-fields-into-a-single-frame',
    'Combine all fields into a single frame.  Values will be appended with undefined values if not the same length.'
  ),
};
