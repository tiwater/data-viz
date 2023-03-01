// These are used in some other plugins for some reason

import {
  escapeStringForRegex,
  FieldOverrideContext,
  getFieldDisplayName,
  PanelOptionsEditorBuilder,
  ReducerID,
  standardEditorsRegistry,
} from '@grafana/data';
import { SingleStatBaseOptions, VizOrientation } from '@grafana/schema';
import { t } from 'app/core/internationalization';

export function addStandardDataReduceOptions<T extends SingleStatBaseOptions>(
  builder: PanelOptionsEditorBuilder<T>,
  includeFieldMatcher = true
) {
  const valueOptionsCategory = [t('app.panel.common.value-options','Value options')];

  builder.addRadio({
    path: 'reduceOptions.values',
    name: t('app.panel.common.show','Show'),
    description: t('app.panel.common.valueOptionsDescription','Calculate a single value per column or series or show each row'),
    settings: {
      options: [
        { value: false, label: t('app.panel.common.calculate','Calculate') },
        { value: true, label: t('app.panel.common.all-values','All values') },
      ],
    },
    category: valueOptionsCategory,
    defaultValue: false,
  });

  builder.addNumberInput({
    path: 'reduceOptions.limit',
    name: t('app.panel.common.limit','Limit'),
    description: t('app.panel.common.limitDescription','Max number of rows to display'),
    category: valueOptionsCategory,
    settings: {
      placeholder: '25',
      integer: true,
      min: 1,
      max: 5000,
    },
    showIf: (options) => options.reduceOptions.values === true,
  });

  builder.addCustomEditor({
    id: 'reduceOptions.calcs',
    path: 'reduceOptions.calcs',
    name: t('app.panel.common.calculation','Calculation'),
    description: t('app.panel.common.calculationDescription','Choose a reducer function / calculation'),
    category: valueOptionsCategory,
    editor: standardEditorsRegistry.get('stats-picker').editor,
    // TODO: Get ReducerID from generated schema one day?
    defaultValue: [ReducerID.lastNotNull],
    // Hides it when all values mode is on
    showIf: (currentConfig) => currentConfig.reduceOptions.values === false,
  });

  if (includeFieldMatcher) {
    builder.addSelect({
      path: 'reduceOptions.fields',
      name: t('app.panel.common.fields','Fields'),
      description: t('app.panel.common.fieldsDescription','Select the fields that should be included in the panel'),
      category: valueOptionsCategory,
      settings: {
        allowCustomValue: true,
        options: [],
        getOptions: async (context: FieldOverrideContext) => {
          const options = [
            { value: '', label: t('app.panel.common.numeric-fields','Numeric Fields') },
            { value: '/.*/', label: t('app.panel.common.all-fields','All Fields') },
          ];
          if (context && context.data) {
            for (const frame of context.data) {
              for (const field of frame.fields) {
                const name = getFieldDisplayName(field, frame, context.data);
                const value = `/^${escapeStringForRegex(name)}$/`;
                options.push({ value, label: name });
              }
            }
          }
          return Promise.resolve(options);
        },
      },
      defaultValue: '',
    });
  }
}

export function addOrientationOption<T extends SingleStatBaseOptions>(
  builder: PanelOptionsEditorBuilder<T>,
  category?: string[]
) {
  builder.addRadio({
    path: 'orientation',
    name: t('app.panel.common.orientation','Orientation'),
    description: t('app.panel.common.layout-orientation','Layout orientation'),
    category,
    settings: {
      options: [
        { value: VizOrientation.Auto, label: t('app.panel.common.auto','Auto') },
        { value: VizOrientation.Horizontal, label: t('app.panel.common.horizontal','Horizontal') },
        { value: VizOrientation.Vertical, label: t('app.panel.common.vertical','Vertical') },
      ],
    },
    defaultValue: VizOrientation.Auto,
  });
}
