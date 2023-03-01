import React from 'react';

import {
  FieldConfigPropertyItem,
  FieldType,
  standardEditorsRegistry,
  StandardEditorsRegistryItem,
  ThresholdsConfig,
  ThresholdsFieldConfigSettings,
  ThresholdsMode,
  thresholdsOverrideProcessor,
  ValueMapping,
  ValueMappingFieldConfigSettings,
  valueMappingsOverrideProcessor,
  DataLink,
  dataLinksOverrideProcessor,
  NumberFieldConfigSettings,
  numberOverrideProcessor,
  StringFieldConfigSettings,
  stringOverrideProcessor,
  identityOverrideProcessor,
  TimeZone,
  FieldColor,
  FieldColorConfigSettings,
  StatsPickerConfigSettings,
  displayNameOverrideProcessor,
  FieldNamePickerConfigSettings,
} from '@grafana/data';
import { RadioButtonGroup, TimeZonePicker, Switch } from '@grafana/ui';
import { FieldNamePicker } from '@grafana/ui/src/components/MatchersUI/FieldNamePicker';
import { ThresholdsValueEditor } from 'app/features/dimensions/editors/ThresholdsEditor/thresholds';
import { ValueMappingsEditor } from 'app/features/dimensions/editors/ValueMappingsEditor/ValueMappingsEditor';

import { DashboardPicker, DashboardPickerOptions } from './DashboardPicker';
import { ColorValueEditor } from './color';
import { FieldColorEditor } from './fieldColor';
import { DataLinksValueEditor } from './links';
import { MultiSelectValueEditor } from './multiSelect';
import { NumberValueEditor } from './number';
import { SelectValueEditor } from './select';
import { SliderValueEditor } from './slider';
import { StatsPickerEditor } from './stats';
import { StringValueEditor } from './string';
import { StringArrayEditor } from './strings';
import { UnitValueEditor } from './units';

import { t } from 'app/core/internationalization';

/**
 * Returns collection of standard option editors definitions
 */
export const getAllOptionEditors = () => {
  const number: StandardEditorsRegistryItem<number> = {
    id: 'number',
    name: t('app.core.optionsUi.registry.number','Number'),
    description: t('app.core.optionsUi.registry.numberDescription','Allows numeric values input'),
    editor: NumberValueEditor as any,
  };

  const slider: StandardEditorsRegistryItem<number> = {
    id: 'slider',
    name: t('app.core.optionsUi.registry.slider','Slider'),
    description: t('app.core.optionsUi.registry.sliderDescription','Allows numeric values input'),
    editor: SliderValueEditor as any,
  };

  const text: StandardEditorsRegistryItem<string> = {
    id: 'text',
    name: t('app.core.optionsUi.registry.text','Text'),
    description: t('app.core.optionsUi.registry.textDescription','Allows string values input'),
    editor: StringValueEditor as any,
  };

  const strings: StandardEditorsRegistryItem<string[]> = {
    id: 'strings',
    name: t('app.core.optionsUi.registry.string-array','String array'),
    description: t('app.core.optionsUi.registry.stringDescription','An array of strings'),
    editor: StringArrayEditor as any,
  };

  const boolean: StandardEditorsRegistryItem<boolean> = {
    id: 'boolean',
    name: t('app.core.optionsUi.registry.boolean','Boolean'),
    description: t('app.core.optionsUi.registry.booleanDescription','Allows boolean values input'),
    editor(props) {
      const { id, ...rest } = props; // Remove id from properties passed into switch
      return <Switch {...rest} onChange={(e) => props.onChange(e.currentTarget.checked)} />;
    },
  };

  const select: StandardEditorsRegistryItem<any> = {
    id: 'select',
    name: t('app.core.optionsUi.registry.select','Select'),
    description: t('app.core.optionsUi.registry.selectDescription','Allows option selection'),
    editor: SelectValueEditor as any,
  };

  const multiSelect: StandardEditorsRegistryItem<any> = {
    id: 'multi-select',
    name: t('app.core.optionsUi.registry.multi-select','Multi select'),
    description: t('app.core.optionsUi.registry.multiSelectDescription','Allows for multiple option selection'),
    editor: MultiSelectValueEditor as any,
  };

  const radio: StandardEditorsRegistryItem<any> = {
    id: 'radio',
    name: t('app.core.optionsUi.registry.radio','Radio'),
    description: t('app.core.optionsUi.registry.radioDescription','Allows option selection'),
    editor(props) {
      return <RadioButtonGroup {...props} options={props.item.settings?.options} />;
    },
  };

  const unit: StandardEditorsRegistryItem<string> = {
    id: 'unit',
    name: t('app.core.optionsUi.registry.unit','Unit'),
    description: t('app.core.optionsUi.registry.unitDescription','Allows unit input'),
    editor: UnitValueEditor as any,
  };

  const color: StandardEditorsRegistryItem<string> = {
    id: 'color',
    name: t('app.core.optionsUi.registry.color','Color'),
    description: t('app.core.optionsUi.registry.colorDescription','Allows color selection'),
    editor(props) {
      return <ColorValueEditor value={props.value} onChange={props.onChange} />;
    },
  };

  const fieldColor: StandardEditorsRegistryItem<FieldColor> = {
    id: 'fieldColor',
    name: t('app.core.optionsUi.registry.field-color','Field Color'),
    description: t('app.core.optionsUi.registry.fieldColorDescription','Field color selection'),
    editor: FieldColorEditor as any,
  };

  const links: StandardEditorsRegistryItem<DataLink[]> = {
    id: 'links',
    name: t('app.core.optionsUi.registry.links','Links'),
    description: t('app.core.optionsUi.registry.linksDescription','Allows defining data links'),
    editor: DataLinksValueEditor as any,
  };

  const statsPicker: StandardEditorsRegistryItem<string[], StatsPickerConfigSettings> = {
    id: 'stats-picker',
    name: t('app.core.optionsUi.registry.stats-picker','Stats Picker'),
    editor: StatsPickerEditor as any,
    description: '',
  };

  const timeZone: StandardEditorsRegistryItem<TimeZone> = {
    id: 'timezone',
    name: t('app.core.optionsUi.registry.time-zone','Time zone'),
    description: t('app.core.optionsUi.registry.timeZoneDescription','Time zone selection'),
    editor: TimeZonePicker as any,
  };

  const fieldName: StandardEditorsRegistryItem<string, FieldNamePickerConfigSettings> = {
    id: 'field-name',
    name: t('app.core.optionsUi.registry.field-name','Field name'),
    description: t('app.core.optionsUi.registry.fieldNameDescription','Allows selecting a field name from a data frame'),
    editor: FieldNamePicker as any,
  };

  const dashboardPicker: StandardEditorsRegistryItem<string, DashboardPickerOptions> = {
    id: 'dashboard-uid',
    name: t('app.core.optionsUi.registry.dashboard','Dashboard'),
    description: t('app.core.optionsUi.registry.dashboardDescription','Select dashboard'),
    editor: DashboardPicker as any,
  };

  const mappings: StandardEditorsRegistryItem<ValueMapping[]> = {
    id: 'mappings',
    name: t('app.core.optionsUi.registry.mappings','Mappings'),
    description: t('app.core.optionsUi.registry.mappingsDescription','Allows defining value mappings'),
    editor: ValueMappingsEditor as any,
  };

  const thresholds: StandardEditorsRegistryItem<ThresholdsConfig> = {
    id: 'thresholds',
    name: t('app.core.optionsUi.registry.thresholds','Thresholds'),
    description: t('app.core.optionsUi.registry.thresholdsDescription','Allows defining thresholds'),
    editor: ThresholdsValueEditor as any,
  };

  return [
    text,
    number,
    slider,
    boolean,
    radio,
    select,
    unit,
    links,
    statsPicker,
    strings,
    timeZone,
    fieldColor,
    color,
    multiSelect,
    fieldName,
    dashboardPicker,
    mappings,
    thresholds,
  ];
};

/**
 * Returns collection of common field config properties definitions
 */
export const getAllStandardFieldConfigs = () => {
  const category = [t('app.core.optionsUi.registry.standard-options','Standard options')];
  const displayName: FieldConfigPropertyItem<any, string, StringFieldConfigSettings> = {
    id: 'displayName',
    path: 'displayName',
    name: t('app.core.optionsUi.registry.display-name','Display name'),
    description: t('app.core.optionsUi.registry.displayNameDescription','Change the field or series name'),
    editor: standardEditorsRegistry.get('text').editor as any,
    override: standardEditorsRegistry.get('text').editor as any,
    process: displayNameOverrideProcessor,
    settings: {
      placeholder: t('app.core.optionsUi.registry.none','none'),
      expandTemplateVars: true,
    },
    shouldApply: () => true,
    category,
  };

  const unit: FieldConfigPropertyItem<any, string, StringFieldConfigSettings> = {
    id: 'unit',
    path: 'unit',
    name: t('app.core.optionsUi.registry.unit','Unit'),
    description: '',

    editor: standardEditorsRegistry.get('unit').editor as any,
    override: standardEditorsRegistry.get('unit').editor as any,
    process: stringOverrideProcessor,

    settings: {
      placeholder: t('app.core.optionsUi.registry.none','none'),
    },

    shouldApply: () => true,
    category,
  };

  const min: FieldConfigPropertyItem<any, number, NumberFieldConfigSettings> = {
    id: 'min',
    path: 'min',
    name: t('app.core.optionsUi.registry.min','Min'),
    description: t('app.core.optionsUi.registry.minDescription','Leave empty to calculate based on all values'),

    editor: standardEditorsRegistry.get('number').editor as any,
    override: standardEditorsRegistry.get('number').editor as any,
    process: numberOverrideProcessor,

    settings: {
      placeholder: t('app.core.optionsUi.registry.auto','auto'),
    },
    shouldApply: (field) => field.type === FieldType.number,
    category,
  };

  const max: FieldConfigPropertyItem<any, number, NumberFieldConfigSettings> = {
    id: 'max',
    path: 'max',
    name: t('app.core.optionsUi.registry.max','Max'),
    description: t('app.core.optionsUi.registry.maxDescription','Leave empty to calculate based on all values'),

    editor: standardEditorsRegistry.get('number').editor as any,
    override: standardEditorsRegistry.get('number').editor as any,
    process: numberOverrideProcessor,

    settings: {
      placeholder: t('app.core.optionsUi.registry.auto','auto'),
    },

    shouldApply: (field) => field.type === FieldType.number,
    category,
  };

  const decimals: FieldConfigPropertyItem<any, number, NumberFieldConfigSettings> = {
    id: 'decimals',
    path: 'decimals',
    name: t('app.core.optionsUi.registry.decimals','Decimals'),

    editor: standardEditorsRegistry.get('number').editor as any,
    override: standardEditorsRegistry.get('number').editor as any,
    process: numberOverrideProcessor,

    settings: {
      placeholder: t('app.core.optionsUi.registry.auto','auto'),
      min: 0,
      max: 15,
      integer: true,
    },

    shouldApply: (field) => field.type === FieldType.number,
    category,
  };

  const noValue: FieldConfigPropertyItem<any, string, StringFieldConfigSettings> = {
    id: 'noValue',
    path: 'noValue',
    name: t('app.core.optionsUi.registry.no-value','No value'),
    description: t('app.core.optionsUi.registry.noValueDescription','What to show when there is no value'),

    editor: standardEditorsRegistry.get('text').editor as any,
    override: standardEditorsRegistry.get('text').editor as any,
    process: stringOverrideProcessor,

    settings: {
      placeholder: '-',
    },
    // ??? any optionsUi with no value
    shouldApply: () => true,
    category,
  };

  const links: FieldConfigPropertyItem<any, DataLink[], StringFieldConfigSettings> = {
    id: 'links',
    path: 'links',
    name: t('app.core.optionsUi.registry.data-links','Data links'),
    editor: standardEditorsRegistry.get('links').editor as any,
    override: standardEditorsRegistry.get('links').editor as any,
    process: dataLinksOverrideProcessor,
    settings: {
      placeholder: '-',
    },
    shouldApply: () => true,
    category: [t('app.core.optionsUi.registry.data-links','Data links')],
    getItemsCount: (value) => (value ? value.length : 0),
  };

  const color: FieldConfigPropertyItem<any, FieldColor | undefined, FieldColorConfigSettings> = {
    id: 'color',
    path: 'color',
    name: t('app.core.optionsUi.registry.color-scheme','Color scheme'),
    editor: standardEditorsRegistry.get('fieldColor').editor as any,
    override: standardEditorsRegistry.get('fieldColor').editor as any,
    process: identityOverrideProcessor,
    shouldApply: () => true,
    settings: {
      byValueSupport: true,
      preferThresholdsMode: true,
    },
    category,
  };

  const mappings: FieldConfigPropertyItem<any, ValueMapping[], ValueMappingFieldConfigSettings> = {
    id: 'mappings',
    path: 'mappings',
    name: t('app.core.optionsUi.registry.value-mappings','Value mappings'),
    description: t('app.core.optionsUi.registry.valueMappingsDescription','Modify the display text based on input value'),

    editor: standardEditorsRegistry.get('mappings').editor as any,
    override: standardEditorsRegistry.get('mappings').editor as any,
    process: valueMappingsOverrideProcessor,
    settings: {},
    defaultValue: [],
    shouldApply: (x) => x.type !== FieldType.time,
    category: [t('app.core.optionsUi.registry.value-mappings','Value mappings')],
    getItemsCount: (value?) => (value ? value.length : 0),
  };

  const thresholds: FieldConfigPropertyItem<any, ThresholdsConfig, ThresholdsFieldConfigSettings> = {
    id: 'thresholds',
    path: 'thresholds',
    name: t('app.core.optionsUi.registry.thresholds','Thresholds'),
    editor: standardEditorsRegistry.get('thresholds').editor as any,
    override: standardEditorsRegistry.get('thresholds').editor as any,
    process: thresholdsOverrideProcessor,
    settings: {},
    defaultValue: {
      mode: ThresholdsMode.Absolute,
      steps: [
        { value: -Infinity, color: 'green' },
        { value: 80, color: 'red' },
      ],
    },
    shouldApply: () => true,
    category: [t('app.core.optionsUi.registry.thresholds','Thresholds')],
    getItemsCount: (value) => (value ? value.steps.length : 0),
  };

  return [unit, min, max, decimals, displayName, color, noValue, links, mappings, thresholds];
};
