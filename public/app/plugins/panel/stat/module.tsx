import { PanelPlugin } from '@grafana/data';
import { BigValueColorMode, BigValueGraphMode, BigValueJustifyMode, BigValueTextMode } from '@grafana/schema';
import { commonOptionsBuilder, sharedSingleStatMigrationHandler } from '@grafana/ui';

import { statPanelChangedHandler } from './StatMigrations';
import { StatPanel } from './StatPanel';
import { addStandardDataReduceOptions, addOrientationOption } from './common';
import { defaultPanelOptions, PanelOptions } from './panelcfg.gen';
import { StatSuggestionsSupplier } from './suggestions';
import { t } from 'app/core/internationalization';

export const plugin = new PanelPlugin<PanelOptions>(StatPanel)
  .useFieldConfig()
  .setPanelOptions((builder) => {
    const mainCategory = [t('app.panel.stat.stat-styles','Stat styles')];

    addStandardDataReduceOptions(builder);
    addOrientationOption(builder, mainCategory);
    commonOptionsBuilder.addTextSizeOptions(builder);

    builder.addSelect({
      path: 'textMode',
      name: t('app.panel.stat.text-mode','Text mode'),
      description: t('app.panel.stat.textModeDescription','Control if name and value is displayed or just name'),
      category: mainCategory,
      settings: {
        options: [
          { value: BigValueTextMode.Auto, label: t('app.panel.stat.auto','Auto') },
          { value: BigValueTextMode.Value, label: t('app.panel.stat.value','Value') },
          { value: BigValueTextMode.ValueAndName, label: t('app.panel.stat.value-and-name','Value and name') },
          { value: BigValueTextMode.Name, label: t('app.panel.stat.name','Name') },
          { value: BigValueTextMode.None, label: t('app.panel.stat.none','None') },
        ],
      },
      defaultValue: defaultPanelOptions.textMode,
    });

    builder
      .addRadio({
        path: 'colorMode',
        name: t('app.panel.stat.color-mode','Color mode'),
        defaultValue: BigValueColorMode.Value,
        category: mainCategory,
        settings: {
          options: [
            { value: BigValueColorMode.None, label: t('app.panel.stat.none','None') },
            { value: BigValueColorMode.Value, label: t('app.panel.stat.value','Value') },
            { value: BigValueColorMode.Background, label: t('app.panel.stat.background','Background') },
          ],
        },
      })
      .addRadio({
        path: 'graphMode',
        name: t('app.panel.stat.graph-mode','Graph mode'),
        description: t('app.panel.stat.graph-mode-description','Stat panel graph / sparkline mode'),
        category: mainCategory,
        defaultValue: defaultPanelOptions.graphMode,
        settings: {
          options: [
            { value: BigValueGraphMode.None, label: t('app.panel.stat.none','None') },
            { value: BigValueGraphMode.Area, label: t('app.panel.stat.area','Area') },
          ],
        },
      })
      .addRadio({
        path: 'justifyMode',
        name: t('app.panel.stat.text-alignment','Text alignment'),
        defaultValue: defaultPanelOptions.justifyMode,
        category: mainCategory,
        settings: {
          options: [
            { value: BigValueJustifyMode.Auto, label: t('app.panel.stat.auto','Auto') },
            { value: BigValueJustifyMode.Center, label: t('app.panel.stat.center','Center') },
          ],
        },
      });
  })
  .setNoPadding()
  .setPanelChangeHandler(statPanelChangedHandler)
  .setSuggestionsSupplier(new StatSuggestionsSupplier())
  .setMigrationHandler(sharedSingleStatMigrationHandler);
