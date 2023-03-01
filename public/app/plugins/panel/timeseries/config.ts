import {
  FieldColorModeId,
  FieldConfigProperty,
  FieldType,
  identityOverrideProcessor,
  SetFieldConfigOptionsArgs,
  Field,
} from '@grafana/data';
import {
  BarAlignment,
  GraphDrawStyle,
  GraphFieldConfig,
  GraphGradientMode,
  LineInterpolation,
  LineStyle,
  VisibilityMode,
  StackingMode,
  GraphTresholdsStyleMode,
  GraphTransform,
} from '@grafana/schema';
import { graphFieldOptions, commonOptionsBuilder } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { LineStyleEditor } from './LineStyleEditor';
import { SpanNullsEditor } from './SpanNullsEditor';
import { ThresholdsStyleEditor } from './ThresholdsStyleEditor';

export const defaultGraphConfig: GraphFieldConfig = {
  drawStyle: GraphDrawStyle.Line,
  lineInterpolation: LineInterpolation.Linear,
  lineWidth: 1,
  fillOpacity: 0,
  gradientMode: GraphGradientMode.None,
  barAlignment: BarAlignment.Center,
  stacking: {
    mode: StackingMode.None,
    group: 'A',
  },
  axisGridShow: true,
  axisCenteredZero: false,
};

const categoryStyles = [t('grafana-ui.options.graph-styles', 'Graph styles')];

export function getGraphFieldConfig(cfg: GraphFieldConfig): SetFieldConfigOptionsArgs<GraphFieldConfig> {
  return {
    standardOptions: {
      [FieldConfigProperty.Color]: {
        settings: {
          byValueSupport: true,
          bySeriesSupport: true,
          preferThresholdsMode: false,
        },
        defaultValue: {
          mode: FieldColorModeId.PaletteClassic,
        },
      },
    },
    useCustomConfig: (builder) => {
      builder
        .addRadio({
          path: 'drawStyle',
          name: t('features.dimensions.style', 'Style'),
          category: categoryStyles,
          defaultValue: cfg.drawStyle,
          settings: {
            options: graphFieldOptions().drawStyle,
          },
        })
        .addRadio({
          path: 'lineInterpolation',
          name: t('features.dimensions.line-interpolation', 'Line interpolation'),
          category: categoryStyles,
          defaultValue: cfg.lineInterpolation,
          settings: {
            options: graphFieldOptions().lineInterpolation,
          },
          showIf: (c) => c.drawStyle === GraphDrawStyle.Line,
        })
        .addRadio({
          path: 'barAlignment',
          name: t('features.dimensions.bar-alignment', 'Bar alignment'),
          category: categoryStyles,
          defaultValue: cfg.barAlignment,
          settings: {
            options: graphFieldOptions().barAlignment,
          },
          showIf: (c) => c.drawStyle === GraphDrawStyle.Bars,
        })
        .addSliderInput({
          path: 'lineWidth',
          name: t('features.dimensions.line-width', 'Line width'),
          category: categoryStyles,
          defaultValue: cfg.lineWidth,
          settings: {
            min: 0,
            max: 10,
            step: 1,
            ariaLabelForHandle: t('features.dimensions.line-width', 'Line width'),
          },
          showIf: (c) => c.drawStyle !== GraphDrawStyle.Points,
        })
        .addSliderInput({
          path: 'fillOpacity',
          name: t('features.dimensions.fill-opacity', 'Fill opacity'),
          category: categoryStyles,
          defaultValue: cfg.fillOpacity,
          settings: {
            min: 0,
            max: 100,
            step: 1,
            ariaLabelForHandle: t('features.dimensions.fill-opacity', 'Fill opacity'),
          },
          showIf: (c) => c.drawStyle !== GraphDrawStyle.Points,
        })
        .addRadio({
          path: 'gradientMode',
          name: t('features.dimensions.gradient-mode', 'Gradient mode'),
          category: categoryStyles,
          defaultValue: graphFieldOptions().fillGradient[0].value,
          settings: {
            options: graphFieldOptions().fillGradient,
          },
          showIf: (c) => c.drawStyle !== GraphDrawStyle.Points,
        })
        .addFieldNamePicker({
          path: 'fillBelowTo',
          name: t('features.dimensions.fill-below-to', 'Fill below to'),
          category: categoryStyles,
          hideFromDefaults: true,
          settings: {
            filter: (field: Field) => field.type === FieldType.number,
          },
        })
        .addCustomEditor<void, LineStyle>({
          id: 'lineStyle',
          path: 'lineStyle',
          name: t('features.dimensions.line-style', 'Line style'),
          category: categoryStyles,
          showIf: (c) => c.drawStyle === GraphDrawStyle.Line,
          editor: LineStyleEditor,
          override: LineStyleEditor,
          process: identityOverrideProcessor,
          shouldApply: (f) => f.type === FieldType.number,
        })
        .addCustomEditor<void, boolean>({
          id: 'spanNulls',
          path: 'spanNulls',
          name: t('features.dimensions.connect-null-values', 'Connect null values'),
          category: categoryStyles,
          defaultValue: false,
          editor: SpanNullsEditor,
          override: SpanNullsEditor,
          showIf: (c) => c.drawStyle === GraphDrawStyle.Line,
          shouldApply: (f) => f.type !== FieldType.time,
          process: identityOverrideProcessor,
        })
        .addRadio({
          path: 'showPoints',
          name: t('features.dimensions.show-points', 'Show points'),
          category: categoryStyles,
          defaultValue: graphFieldOptions().showPoints[0].value,
          settings: {
            options: graphFieldOptions().showPoints,
          },
          showIf: (c) => c.drawStyle !== GraphDrawStyle.Points,
        })
        .addSliderInput({
          path: 'pointSize',
          name: t('features.dimensions.point-size', 'Point size'),
          category: categoryStyles,
          defaultValue: 5,
          settings: {
            min: 1,
            max: 40,
            step: 1,
            ariaLabelForHandle: 'Point size',
          },
          showIf: (c) => c.showPoints !== VisibilityMode.Never || c.drawStyle === GraphDrawStyle.Points,
        });

      commonOptionsBuilder.addStackingConfig(builder, cfg.stacking, categoryStyles);

      builder.addSelect({
        category: categoryStyles,
        name: t('features.dimensions.transform', 'Transform'),
        path: 'transform',
        settings: {
          options: [
            {
              label: t('features.dimensions.constant', 'Constant'),
              value: GraphTransform.Constant,
              description: t('features.dimensions.constantDescription', 'The first value will be shown as a constant line'),
            },
            {
              label: t('features.dimensions.negative-y', 'Negative Y'),
              value: GraphTransform.NegativeY,
              description: t('features.dimensions.negative-description', 'Flip the results to negative values on the y axis'),
            },
          ],
          isClearable: true,
        },
        hideFromDefaults: true,
      });

      commonOptionsBuilder.addAxisConfig(builder, cfg);
      commonOptionsBuilder.addHideFrom(builder);

      builder.addCustomEditor({
        id: 'thresholdsStyle',
        path: 'thresholdsStyle',
        name: t('features.dimensions.show-thresholds', 'Show thresholds'),
        category: [t('features.dimensions.thresholds', 'Thresholds')],
        defaultValue: { mode: GraphTresholdsStyleMode.Off },
        settings: {
          options: graphFieldOptions().thresholdsDisplayModes,
        },
        editor: ThresholdsStyleEditor,
        override: ThresholdsStyleEditor,
        process: identityOverrideProcessor,
        shouldApply: () => true,
      });
    },
  };
}
