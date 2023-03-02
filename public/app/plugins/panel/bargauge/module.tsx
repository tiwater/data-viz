import { PanelPlugin, VizOrientation } from '@grafana/data';
import { BarGaugeDisplayMode } from '@grafana/schema';
import { commonOptionsBuilder, sharedSingleStatPanelChangedHandler } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { addOrientationOption, addStandardDataReduceOptions } from '../stat/common';

import { barGaugePanelMigrationHandler } from './BarGaugeMigrations';
import { BarGaugePanel } from './BarGaugePanel';
import { PanelOptions, defaultPanelOptions } from './models.gen';
import { BarGaugeSuggestionsSupplier } from './suggestions';

export const plugin = new PanelPlugin<PanelOptions>(BarGaugePanel)
  .useFieldConfig()
  .setPanelOptions((builder) => {
    addStandardDataReduceOptions(builder);
    addOrientationOption(builder);
    commonOptionsBuilder.addTextSizeOptions(builder);

    builder
      .addRadio({
        path: 'displayMode',
        name: t('plugins.bar-gauge.display-mode', 'Display mode'),
        settings: {
          options: [
            { value: BarGaugeDisplayMode.Gradient, label: t('plugins.bar-gauge.gradient', 'Gradient') },
            { value: BarGaugeDisplayMode.Lcd, label: t('plugins.bar-gauge.retro-LCD', 'Retro LCD') },
            { value: BarGaugeDisplayMode.Basic, label: t('plugins.bar-gauge.basic', 'Basic') },
          ],
        },
        defaultValue: defaultPanelOptions.displayMode,
      })
      .addBooleanSwitch({
        path: 'showUnfilled',
        name: t('plugins.bar-gauge.show-unfilled-area', 'Show unfilled area'),
        description: t(
          'plugins.bar-gauge.when-enabled-renders-the-unfilled',
          'When enabled renders the unfilled region as gray'
        ),
        defaultValue: defaultPanelOptions.showUnfilled,
        showIf: (options) => options.displayMode !== 'lcd',
      })
      .addNumberInput({
        path: 'minVizWidth',
        name: t('plugins.bar-gauge.min-width', 'Min width'),
        description: t('plugins.bar-gauge.minimum-column-width', 'Minimum column width'),
        defaultValue: defaultPanelOptions.minVizWidth,
        showIf: (options) => options.orientation === VizOrientation.Vertical,
      })
      .addNumberInput({
        path: 'minVizHeight',
        name: t('plugins.bar-gauge.min-height', 'Min height'),
        description: t('plugins.bar-gauge.minimum-row-height', 'Minimum row height'),
        defaultValue: defaultPanelOptions.minVizHeight,
        showIf: (options) => options.orientation === VizOrientation.Horizontal,
      });
  })
  .setPanelChangeHandler(sharedSingleStatPanelChangedHandler)
  .setMigrationHandler(barGaugePanelMigrationHandler)
  .setSuggestionsSupplier(new BarGaugeSuggestionsSupplier());
