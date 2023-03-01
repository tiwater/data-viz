import { PanelOptionsEditorBuilder } from '@grafana/data';
import { OptionsWithTooltip, TooltipDisplayMode, SortOrder } from '@grafana/schema';
import { t } from '../../../src/utils/i18n';

export function addTooltipOptions<T extends OptionsWithTooltip>(
  builder: PanelOptionsEditorBuilder<T>,
  singleOnly = false
) {
  const category = [t("grafana-ui.options.tooltip",'Tooltip')];
  const modeOptions = singleOnly
    ? [
        { value: TooltipDisplayMode.Single, label: t('grafana-ui.options.single','Single') },
        { value: TooltipDisplayMode.None, label: t('grafana-ui.options.hidden','Hidden') },
      ]
    : [
        { value: TooltipDisplayMode.Single, label: t('grafana-ui.options.single','Single') },
        { value: TooltipDisplayMode.Multi, label: t('grafana-ui.options.all','All') },
        { value: TooltipDisplayMode.None, label: t('grafana-ui.options.hidden','Hidden') },
      ];

  const sortOptions = [
    { value: SortOrder.None, label: t('grafana-ui.options.none','None') },
    { value: SortOrder.Ascending, label: t('grafana-ui.options.ascending','Ascending') },
    { value: SortOrder.Descending, label: t('grafana-ui.options.descending','Descending') },
  ];

  builder
    .addRadio({
      path: 'tooltip.mode',
      name: t("grafana-ui.options.tooltip-mode",'Tooltip mode'),
      category,
      defaultValue: 'single',
      settings: {
        options: modeOptions,
      },
    })
    .addRadio({
      path: 'tooltip.sort',
      name: t("grafana-ui.options.values-sort-order",'Values sort order'),
      category,
      defaultValue: SortOrder.None,
      showIf: (options: T) => options.tooltip.mode === TooltipDisplayMode.Multi,
      settings: {
        options: sortOptions,
      },
    });
}
