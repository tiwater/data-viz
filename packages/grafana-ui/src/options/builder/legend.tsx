import { PanelOptionsEditorBuilder, standardEditorsRegistry, StatsPickerConfigSettings } from '@grafana/data';
import { LegendDisplayMode, OptionsWithLegend } from '@grafana/schema';
import { t } from '../../../src/utils/i18n';

/**
 * @alpha
 */
export function addLegendOptions<T extends OptionsWithLegend>(
  builder: PanelOptionsEditorBuilder<T>,
  includeLegendCalcs = true
) {
  builder
    .addBooleanSwitch({
      path: 'legend.showLegend',
      name: t('grafana-ui.options.visibility', 'Visibility'),
      category: [t('grafana-ui.options.legend', 'Legend')],
      description: '',
      defaultValue: true,
    })
    .addRadio({
      path: 'legend.displayMode',
      name: t('grafana-ui.options.mode', 'Mode'),
      category: [t('grafana-ui.options.legend', 'Legend')],
      description: '',
      defaultValue: LegendDisplayMode.List,
      settings: {
        options: [
          { value: LegendDisplayMode.List, label: t('grafana-ui.options.list', 'List') },
          { value: LegendDisplayMode.Table, label: t('grafana-ui.options.table', 'Table') },
        ],
      },
      showIf: (c) => c.legend.showLegend,
    })
    .addRadio({
      path: 'legend.placement',
      name: t('grafana-ui.options.placement', 'Placement'),
      category: [t('grafana-ui.options.legend', 'Legend')],
      description: '',
      defaultValue: 'bottom',
      settings: {
        options: [
          { value: 'bottom', label: t('grafana-ui.options.bottom', 'Bottom') },
          { value: 'right', label: t('grafana-ui.options.right', 'Right') },
        ],
      },
      showIf: (c) => c.legend.showLegend,
    })
    .addNumberInput({
      path: 'legend.width',
      name: t('grafana-ui.options.width', 'Width'),
      category: [t('grafana-ui.options.legend', 'Legend')],
      settings: {
        placeholder: t('grafana-ui.options.auto', 'Auto'),
      },
      showIf: (c) => c.legend.showLegend && c.legend.placement === 'right',
    });

  if (includeLegendCalcs) {
    builder.addCustomEditor<StatsPickerConfigSettings, string[]>({
      id: 'legend.calcs',
      path: 'legend.calcs',
      name: t('grafana-ui.options.values', 'Values'),
      category: [t('grafana-ui.options.legend', 'Legend')],
      description: t('grafana-ui.options.select-description', 'Select values or calculations to show in legend'),
      editor: standardEditorsRegistry.get('stats-picker').editor,
      defaultValue: [],
      settings: {
        allowMultiple: true,
      },
      showIf: (currentConfig) => currentConfig.legend.showLegend !== false,
    });
  }
}
