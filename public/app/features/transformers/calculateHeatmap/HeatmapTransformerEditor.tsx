import React, { useEffect } from 'react';

import {
  PanelOptionsEditorBuilder,
  PluginState,
  StandardEditorContext,
  TransformerRegistryItem,
  TransformerUIProps,
} from '@grafana/data';
import { t } from 'app/core/internationalization';

import { getDefaultOptions, getTransformerOptionPane } from '../spatial/optionsHelper';

import { addHeatmapCalculationOptions } from './editor/helper';
import { HeatmapTransformerOptions, heatmapTransformer } from './heatmap';

// Nothing defined in state
const supplier = (
  builder: PanelOptionsEditorBuilder<HeatmapTransformerOptions>,
  context: StandardEditorContext<HeatmapTransformerOptions>
) => {
  const options = context.options ?? {};

  addHeatmapCalculationOptions('', builder, options);
};

export const HeatmapTransformerEditor: React.FC<TransformerUIProps<HeatmapTransformerOptions>> = (props) => {
  useEffect(() => {
    if (!props.options.xBuckets?.mode) {
      const opts = getDefaultOptions(supplier);
      props.onChange({ ...opts, ...props.options });
      console.log('geometry useEffect', opts);
    }
  });

  // Shared with spatial transformer
  const pane = getTransformerOptionPane<HeatmapTransformerOptions>(props, supplier);
  return (
    <div>
      <div>{pane.items.map((v) => v.render())}</div>
    </div>
  );
};

export const getHeatmapTransformRegistryItem = (): TransformerRegistryItem<HeatmapTransformerOptions> => ({
  id: heatmapTransformer.id,
  editor: HeatmapTransformerEditor,
  transformation: heatmapTransformer,
  name: t('features.transformers.create-heatmap.name', 'Create heatmap'),
  description: t('features.transformers.create-heatmap.description', 'calculate heatmap from source data'),
  state: PluginState.alpha,
});

export const heatmapTransformRegistryItem: TransformerRegistryItem<HeatmapTransformerOptions> = {
  id: heatmapTransformer.id,
  editor: HeatmapTransformerEditor,
  transformation: heatmapTransformer,
  name: heatmapTransformer.name,
  description: heatmapTransformer.description,
  state: PluginState.alpha,
};
