import React from 'react';

import { DataLinksInlineEditor, Input, RadioButtonGroup, Select, Switch, TextArea } from '@grafana/ui';
import { t } from 'app/core/internationalization';
import { getPanelLinksVariableSuggestions } from 'app/features/panel/panellinks/link_srv';

import { RepeatRowSelect } from '../RepeatRowSelect/RepeatRowSelect';

import { OptionsPaneCategoryDescriptor } from './OptionsPaneCategoryDescriptor';
import { OptionsPaneItemDescriptor } from './OptionsPaneItemDescriptor';
import { OptionPaneRenderProps } from './types';

export function getPanelFrameCategory(props: OptionPaneRenderProps): OptionsPaneCategoryDescriptor {
  const { panel, onPanelConfigChange } = props;
  const descriptor = new OptionsPaneCategoryDescriptor({
    title: t('features.dashboard.panel-editor.panel-options.title', 'Panel options'),
    id: 'Panel options',
    isOpenDefault: true,
  });

  return descriptor
    .addItem(
      new OptionsPaneItemDescriptor({
        title: t('features.dashboard.panel-editor.frame-title', 'Title'),
        value: panel.title,
        popularRank: 1,
        render: function renderTitle() {
          return (
            <Input
              id="PanelFrameTitle"
              defaultValue={panel.title}
              onBlur={(e) => onPanelConfigChange('title', e.currentTarget.value)}
            />
          );
        },
      })
    )
    .addItem(
      new OptionsPaneItemDescriptor({
        title: t('features.dashboard.panel-editor.panel-options.description', 'Description'),
        description: panel.description,
        value: panel.description,
        render: function renderDescription() {
          return (
            <TextArea
              id="description-text-area"
              defaultValue={panel.description}
              onBlur={(e) => onPanelConfigChange('description', e.currentTarget.value)}
            />
          );
        },
      })
    )
    .addItem(
      new OptionsPaneItemDescriptor({
        title: t('features.dashboard.panel-editor.panel-options.transparent-background', 'Transparent background'),
        render: function renderTransparent() {
          return (
            <Switch
              value={panel.transparent}
              id="transparent-background"
              onChange={(e) => onPanelConfigChange('transparent', e.currentTarget.checked)}
            />
          );
        },
      })
    )
    .addCategory(
      new OptionsPaneCategoryDescriptor({
        title: t('features.dashboard.panel-editor.panel-options.panel-links', 'Panel links'),
        id: 'Panel links',
        isOpenDefault: false,
        itemsCount: panel.links?.length,
      }).addItem(
        new OptionsPaneItemDescriptor({
          title: t('features.dashboard.panel-editor.panel-options.panel-links', 'Panel links'),
          render: function renderLinks() {
            return (
              <DataLinksInlineEditor
                links={panel.links}
                onChange={(links) => onPanelConfigChange('links', links)}
                getSuggestions={getPanelLinksVariableSuggestions}
                data={[]}
              />
            );
          },
        })
      )
    )
    .addCategory(
      new OptionsPaneCategoryDescriptor({
        title: t('features.dashboard.panel-editor.panel-options.repeat-options', 'Repeat options'),
        id: 'Repeat options',
        isOpenDefault: false,
      })
        .addItem(
          new OptionsPaneItemDescriptor({
            title: t('features.dashboard.panel-editor.panel-options.repeat-by-variable', 'Repeat  by variable'),
            description: t(
              'features.dashboard.panel-editor.panel-options.repeat-by-variable-description',
              'Repeat this panel for each value in the selected variable. This is not visible while in edit mode. You need to go back to dashboard and then update the variable or reload the dashboard.'
            ),
            render: function renderRepeatOptions() {
              return (
                <RepeatRowSelect
                  id="repeat-by-variable-select"
                  repeat={panel.repeat}
                  onChange={(value?: string | null) => {
                    onPanelConfigChange('repeat', value);
                  }}
                />
              );
            },
          })
        )
        .addItem(
          new OptionsPaneItemDescriptor({
            title: t('features.dashboard.panel-editor.panel-options.repeat-direction', 'Repeat direction'),
            showIf: () => !!panel.repeat,
            render: function renderRepeatOptions() {
              const directionOptions = [
                { label: 'Horizontal', value: 'h' },
                { label: 'Vertical', value: 'v' },
              ];

              return (
                <RadioButtonGroup
                  options={directionOptions}
                  value={panel.repeatDirection || 'h'}
                  onChange={(value) => onPanelConfigChange('repeatDirection', value)}
                />
              );
            },
          })
        )
        .addItem(
          new OptionsPaneItemDescriptor({
            title: t('features.dashboard.panel-editor.panel-options.max-per-row', 'Max per row'),
            showIf: () => Boolean(panel.repeat && panel.repeatDirection === 'h'),
            render: function renderOption() {
              const maxPerRowOptions = [2, 3, 4, 6, 8, 12].map((value) => ({ label: value.toString(), value }));
              return (
                <Select
                  options={maxPerRowOptions}
                  value={panel.maxPerRow}
                  onChange={(value) => onPanelConfigChange('maxPerRow', value.value)}
                />
              );
            },
          })
        )
    );
}
