import React from 'react';

import { Input } from '@grafana/ui';
import { t } from 'app/core/internationalization';
import { LibraryPanelInformation } from 'app/features/library-panels/components/LibraryPanelInfo/LibraryPanelInfo';

import { isPanelModelLibraryPanel } from '../../../library-panels/guard';

import { OptionsPaneCategoryDescriptor } from './OptionsPaneCategoryDescriptor';
import { OptionsPaneItemDescriptor } from './OptionsPaneItemDescriptor';
import { OptionPaneRenderProps } from './types';

export function getLibraryPanelOptionsCategory(props: OptionPaneRenderProps): OptionsPaneCategoryDescriptor {
  const { panel, onPanelConfigChange, dashboard } = props;
  const descriptor = new OptionsPaneCategoryDescriptor({
    title: t('features.dashboard.setting.library-panel-options', 'Library panel options'),
    id: 'Library panel options',
    isOpenDefault: true,
  });

  if (isPanelModelLibraryPanel(panel)) {
    descriptor
      .addItem(
        new OptionsPaneItemDescriptor({
          title: t('features.dashboard.setting.name', 'Name'),
          value: panel.libraryPanel.name,
          popularRank: 1,
          render: function renderName() {
            return (
              <Input
                id="LibraryPanelFrameName"
                defaultValue={panel.libraryPanel.name}
                onBlur={(e) =>
                  onPanelConfigChange('libraryPanel', { ...panel.libraryPanel, name: e.currentTarget.value })
                }
              />
            );
          },
        })
      )
      .addItem(
        new OptionsPaneItemDescriptor({
          title: t('features.dashboard.setting.information', 'Information'),
          render: function renderLibraryPanelInformation() {
            return <LibraryPanelInformation panel={panel} formatDate={dashboard.formatDate} />;
          },
        })
      );
  }

  return descriptor;
}
