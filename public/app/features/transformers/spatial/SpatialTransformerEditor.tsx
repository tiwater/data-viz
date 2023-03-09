import { css } from '@emotion/css';
import React, { useEffect } from 'react';

import {
  DataTransformerID,
  GrafanaTheme2,
  PanelOptionsEditorBuilder,
  PluginState,
  StandardEditorContext,
  TransformerRegistryItem,
  TransformerUIProps,
} from '@grafana/data';
import { FrameGeometrySource, FrameGeometrySourceMode } from '@grafana/schema';
import { useTheme2 } from '@grafana/ui';
import { t } from 'app/core/internationalization';
import { addLocationFields } from 'app/features/geo/editor/locationEditor';

import { SpatialCalculation, SpatialOperation, SpatialAction, SpatialTransformOptions } from './models.gen';
import { getDefaultOptions, getTransformerOptionPane } from './optionsHelper';
import { isLineBuilderOption, spatialTransformer } from './spatialTransformer';

// Nothing defined in state
const supplier = (
  builder: PanelOptionsEditorBuilder<SpatialTransformOptions>,
  context: StandardEditorContext<SpatialTransformOptions>
) => {
  const options = context.options ?? {};

  builder.addSelect({
    path: `action`,
    name: 'Action',
    description: '',
    defaultValue: SpatialAction.Prepare,
    settings: {
      options: [
        {
          value: SpatialAction.Prepare,
          label: t('features.transformers.spatial-operations.prepare-spatial-field', 'Prepare spatial field'),
          description: t(
            'features.transformers.spatial-operations.set-a-geometry',
            'Set a geometry field based on the results of other fields'
          ),
        },
        {
          value: SpatialAction.Calculate,
          label: t('features.transformers.spatial-operations.calculate-value', 'Calculate value'),
          description: t(
            'features.transformers.spatial-operations.use-the-geometry',
            'Use the geometry to define a new field (heading/distance/area)'
          ),
        },
        {
          value: SpatialAction.Modify,
          label: t('features.transformers.spatial-operations.transform', 'Transform'),
          description: t(
            'features.transformers.spatial-operations.apply-spatial-operations',
            'Apply spatial operations to the geometry'
          ),
        },
      ],
    },
  });

  if (options.action === SpatialAction.Calculate) {
    builder.addSelect({
      path: `calculate.calc`,
      name: 'Function',
      description: '',
      defaultValue: SpatialCalculation.Heading,
      settings: {
        options: [
          {
            value: SpatialCalculation.Heading,
            label: t('features.transformers.spatial-operations.heading', 'Heading'),
          },
          { value: SpatialCalculation.Area, label: t('features.transformers.spatial-operations.area', 'Area') },
          {
            value: SpatialCalculation.Distance,
            label: t('features.transformers.spatial-operations.distance', 'Distance'),
          },
        ],
      },
    });
  } else if (options.action === SpatialAction.Modify) {
    builder.addSelect({
      path: `modify.op`,
      name: 'Operation',
      description: '',
      defaultValue: SpatialOperation.AsLine,
      settings: {
        options: [
          {
            value: SpatialOperation.AsLine,
            label: t('features.transformers.spatial-operations.as-line', 'As line'),
            description: t(
              'features.transformers.create-a-single-line',
              'Create a single line feature with a vertex at each row'
            ),
          },
          {
            value: SpatialOperation.LineBuilder,
            label: t('features.transformers.spatial-operations.line-builder', 'Line builder'),
            description: t(
              'features.transformers.spatial-operations.create-a-line-between',
              'Create a line between two points'
            ),
          },
        ],
      },
    });
  }

  if (isLineBuilderOption(options)) {
    builder.addNestedOptions({
      category: ['Source'],
      path: 'source',
      build: (b, c) => {
        const loc = (options.source ?? {}) as FrameGeometrySource;
        if (!loc.mode) {
          loc.mode = FrameGeometrySourceMode.Auto;
        }
        addLocationFields('Point', '', b, loc);
      },
    });

    builder.addNestedOptions({
      category: ['Target'],
      path: 'modify',
      build: (b, c) => {
        const loc = (options.modify?.target ?? {}) as FrameGeometrySource;
        if (!loc.mode) {
          loc.mode = FrameGeometrySourceMode.Auto;
        }
        addLocationFields('Point', 'target.', b, loc);
      },
    });
  } else {
    addLocationFields('Location', 'source.', builder, options.source);
  }
};

export const SetGeometryTransformerEditor: React.FC<TransformerUIProps<SpatialTransformOptions>> = (props) => {
  // a new component is created with every change :(
  useEffect(() => {
    if (!props.options.source?.mode) {
      const opts = getDefaultOptions(supplier);
      props.onChange({ ...opts, ...props.options });
      console.log('geometry useEffect', opts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const styles = getStyles(useTheme2());

  const pane = getTransformerOptionPane<SpatialTransformOptions>(props, supplier);
  return (
    <div>
      <div>{pane.items.map((v) => v.render())}</div>
      <div>
        {pane.categories.map((c) => {
          return (
            <div key={c.props.id} className={styles.wrap}>
              <h5>{c.props.title}</h5>
              <div className={styles.item}>{c.items.map((s) => s.render())}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    wrap: css`
      margin-bottom: 20px;
    `,
    item: css`
      border-left: 4px solid ${theme.colors.border.strong};
      padding-left: 10px;
    `,
  };
};

export const getSpatialTransformRegistryItem = (): TransformerRegistryItem<SpatialTransformOptions> => ({
  id: DataTransformerID.spatial,
  editor: SetGeometryTransformerEditor,
  transformation: spatialTransformer,
  name: t('features.transformers.spatial-operations.name', 'Spatial operations'),
  description: t('features.transformers.spatial-operations.description', 'Apply spatial operations to query results'),
  state: PluginState.alpha,
});

export const spatialTransformRegistryItem: TransformerRegistryItem<SpatialTransformOptions> = {
  id: DataTransformerID.spatial,
  editor: SetGeometryTransformerEditor,
  transformation: spatialTransformer,
  name: spatialTransformer.name,
  description: spatialTransformer.description,
  state: PluginState.alpha,
};
