import {
  DataFrame,
  FieldColorModeId,
  FieldConfigProperty,
  FieldType,
  getFieldDisplayName,
  identityOverrideProcessor,
  PanelPlugin,
  VizOrientation,
} from '@grafana/data';
import { config } from '@grafana/runtime';
import { GraphTransform, GraphTresholdsStyleMode, StackingMode, VisibilityMode } from '@grafana/schema';
import { graphFieldOptions, commonOptionsBuilder } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { ThresholdsStyleEditor } from '../timeseries/ThresholdsStyleEditor';

import { BarChartPanel } from './BarChartPanel';
import { TickSpacingEditor } from './TickSpacingEditor';
import { PanelFieldConfig, PanelOptions, defaultPanelFieldConfig, defaultPanelOptions } from './models.gen';
import { BarChartSuggestionsSupplier } from './suggestions';
import { prepareBarChartDisplayValues } from './utils';

export const plugin = new PanelPlugin<PanelOptions, PanelFieldConfig>(BarChartPanel)
  .useFieldConfig({
    standardOptions: {
      [FieldConfigProperty.Color]: {
        settings: {
          byValueSupport: true,
          preferThresholdsMode: false,
        },
        defaultValue: {
          mode: FieldColorModeId.PaletteClassic,
        },
      },
    },
    useCustomConfig: (builder) => {
      const cfg = defaultPanelFieldConfig;

      builder
        .addSliderInput({
          path: 'lineWidth',
          name: t('features.dimensions.line-width', 'Line width'),
          defaultValue: cfg.lineWidth,
          settings: {
            min: 0,
            max: 10,
            step: 1,
          },
        })
        .addSliderInput({
          path: 'fillOpacity',
          name: t('features.dimensions.fill-opacity', 'Fill opacity'),
          defaultValue: cfg.fillOpacity,
          settings: {
            min: 0,
            max: 100,
            step: 1,
          },
        })
        .addRadio({
          path: 'gradientMode',
          name: t('features.dimensions.gradient-mode', 'Gradient mode'),
          defaultValue: graphFieldOptions().fillGradient[0].value,
          settings: {
            options: graphFieldOptions().fillGradient,
          },
        });

      builder.addSelect({
        category: [t('features.dimensions.graph-styles', 'Graph styles')],
        name: 'Transform',
        path: 'transform',
        settings: {
          options: [
            {
              label: t('features.dimensions.constant', 'Constant'),
              value: GraphTransform.Constant,
              description: 'The first value will be shown as a constant line',
            },
            {
              label: t('features.dimensions.negative-y', 'Negative Y'),
              value: GraphTransform.NegativeY,
              description: 'Flip the results to negative values on the y axis',
            },
          ],
          isClearable: true,
        },
        hideFromDefaults: true,
      });

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

      commonOptionsBuilder.addAxisConfig(builder, cfg, false);
      commonOptionsBuilder.addHideFrom(builder);
    },
  })
  .setPanelOptions((builder, context) => {
    const disp = prepareBarChartDisplayValues(context.data, config.theme2, context.options ?? ({} as any));
    let xaxisPlaceholder = t('app.plugins.first-string-or-time-field', 'First string or time field');
    const viz = 'viz' in disp ? disp.viz[0] : undefined;
    if (viz?.fields?.length) {
      const first = viz.fields[0];
      xaxisPlaceholder += ` (${getFieldDisplayName(first, viz)})`;
    }

    builder
      .addFieldNamePicker({
        path: 'xField',
        name: t('features.dimensions.x-axis', 'X Axis'),
        settings: {
          placeholderText: xaxisPlaceholder,
        },
      })
      .addRadio({
        path: 'orientation',
        name: t('features.dimensions.orientation', 'Orientation'),
        settings: {
          options: [
            { value: VizOrientation.Auto, label: t('features.dimensions.Auto', 'Auto') },
            { value: VizOrientation.Horizontal, label: t('features.dimensions.horizontal', 'Horizontal') },
            { value: VizOrientation.Vertical, label: t('features.dimensions.vertical', 'Vertical') },
          ],
        },
        defaultValue: defaultPanelOptions.orientation,
      })
      .addSliderInput({
        path: 'xTickLabelRotation',
        name: t('features.dimensions.rotate-x-tick-labels', 'Rotate X tick labels'),
        defaultValue: defaultPanelOptions.xTickLabelRotation,
        settings: {
          min: -90,
          max: 90,
          step: 15,
          marks: { '-90': '-90°', '-45': '-45°', 0: '0°', 45: '45°', 90: '90°' },
          included: false,
        },
      })
      .addNumberInput({
        path: 'xTickLabelMaxLength',
        name: t('features.dimensions.addNumberInputValue', 'X tick label max length'),
        description: t(
          'features.dimensions.addNumberInputDescription',
          'X labels will be truncated to the length provided'
        ),
        settings: {
          placeholder: t('features.dimensions.none', 'None'),
          min: 0,
        },
        showIf: (opts) => opts.xTickLabelRotation !== 0,
      })
      .addCustomEditor({
        id: 'xTickLabelSpacing',
        path: 'xTickLabelSpacing',
        name: t('features.dimensions.addCustomEditorName', 'Bar labels minimum spacing'),
        defaultValue: defaultPanelOptions.xTickLabelSpacing,
        editor: TickSpacingEditor,
      })
      .addRadio({
        path: 'showValue',
        name: t('features.dimensions.addRadioName', 'Show values'),
        settings: {
          options: [
            { value: VisibilityMode.Auto, label: t('features.dimensions.auto', 'Auto') },
            { value: VisibilityMode.Always, label: t('features.dimensions.always', 'Always') },
            { value: VisibilityMode.Never, label: t('features.dimensions.never', 'Never') },
          ],
        },
        defaultValue: defaultPanelOptions.showValue,
      })
      .addRadio({
        path: 'stacking',
        name: t('features.dimensions.stacking', 'Stacking'),
        settings: {
          options: graphFieldOptions().stacking,
        },
        defaultValue: defaultPanelOptions.stacking,
      })
      .addSliderInput({
        path: 'groupWidth',
        name: t('features.dimensions.group-width', 'Group width'),
        defaultValue: defaultPanelOptions.groupWidth,
        settings: {
          min: 0,
          max: 1,
          step: 0.01,
        },
        showIf: (c, data) => {
          if (c.stacking && c.stacking !== StackingMode.None) {
            return false;
          }
          return countNumberFields(data) !== 1;
        },
      })
      .addSliderInput({
        path: 'barWidth',
        name: t('features.dimensions.bar-width', 'Bar width'),
        defaultValue: defaultPanelOptions.barWidth,
        settings: {
          min: 0,
          max: 1,
          step: 0.01,
        },
      })
      .addSliderInput({
        path: 'barRadius',
        name: t('features.dimensions.bar-radius', 'Bar radius'),
        defaultValue: defaultPanelOptions.barRadius,
        settings: {
          min: 0,
          max: 0.5,
          step: 0.05,
        },
      })
      .addBooleanSwitch({
        path: 'fullHighlight',
        name: t('features.dimensions.addBooleanSwitchName', 'Highlight full area on hover'),
        defaultValue: defaultPanelOptions.fullHighlight,
      });

    builder.addFieldNamePicker({
      path: 'colorByField',
      name: t('features.dimensions.addFieldNamePickerName', 'Color by field'),
      description: t(
        'features.dimensions.addFieldNamePickerDescription',
        'Use the color value for a sibling field to color each bar value.'
      ),
    });

    if (!context.options?.fullHighlight || context.options?.stacking === StackingMode.None) {
      commonOptionsBuilder.addTooltipOptions(builder);
    }

    commonOptionsBuilder.addLegendOptions(builder);
    commonOptionsBuilder.addTextSizeOptions(builder, false);
  })
  .setSuggestionsSupplier(new BarChartSuggestionsSupplier());

function countNumberFields(data?: DataFrame[]): number {
  let count = 0;
  if (data) {
    for (const frame of data) {
      for (const field of frame.fields) {
        if (field.type === FieldType.number) {
          count++;
        }
      }
    }
  }
  return count;
}
