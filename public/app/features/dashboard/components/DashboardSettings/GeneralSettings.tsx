import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { TimeZone } from '@grafana/data';
import { config } from '@grafana/runtime';
import { CollapsableSection, Field, Input, RadioButtonGroup, TagsInput } from '@grafana/ui';
import { Page } from 'app/core/components/PageNew/Page';
import { FolderPicker } from 'app/core/components/Select/FolderPicker';
import { t } from 'app/core/internationalization';
import { updateTimeZoneDashboard, updateWeekStartDashboard } from 'app/features/dashboard/state/actions';

import { DeleteDashboardButton } from '../DeleteDashboard/DeleteDashboardButton';

import { PreviewSettings } from './PreviewSettings';
import { TimePickerSettings } from './TimePickerSettings';
import { SettingsPageProps } from './types';

export type Props = SettingsPageProps & ConnectedProps<typeof connector>;

export function GeneralSettingsUnconnected({
  dashboard,
  updateTimeZone,
  updateWeekStart,
  sectionNav,
}: Props): JSX.Element {
  const [renderCounter, setRenderCounter] = useState(0);
  const GRAPH_TOOLTIP_OPTIONS = [
    { value: 0, label: t('features.dashboard.setting.default', 'Default') },
    { value: 1, label: t('features.dashboard.setting.shared-crosshair', 'Shared crosshair') },
    { value: 2, label: t('features.dashboard.setting.shared-tooltip', 'Shared Tooltip') },
  ];
  const onFolderChange = (folder: { uid: string; title: string }) => {
    dashboard.meta.folderUid = folder.uid;
    dashboard.meta.folderTitle = folder.title;
    dashboard.meta.hasUnsavedFolderChange = true;
  };

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.currentTarget.name === 'title' || event.currentTarget.name === 'description') {
      dashboard[event.currentTarget.name] = event.currentTarget.value;
    }
  };

  const onTooltipChange = (graphTooltip: number) => {
    dashboard.graphTooltip = graphTooltip;
    setRenderCounter(renderCounter + 1);
  };

  const onRefreshIntervalChange = (intervals: string[]) => {
    dashboard.timepicker.refresh_intervals = intervals.filter((i) => i.trim() !== '');
  };

  const onNowDelayChange = (nowDelay: string) => {
    dashboard.timepicker.nowDelay = nowDelay;
  };

  const onHideTimePickerChange = (hide: boolean) => {
    dashboard.timepicker.hidden = hide;
    setRenderCounter(renderCounter + 1);
  };

  const onLiveNowChange = (v: boolean) => {
    dashboard.liveNow = v;
    setRenderCounter(renderCounter + 1);
  };

  const onTimeZoneChange = (timeZone: TimeZone) => {
    dashboard.timezone = timeZone;
    setRenderCounter(renderCounter + 1);
    updateTimeZone(timeZone);
  };

  const onWeekStartChange = (weekStart: string) => {
    dashboard.weekStart = weekStart;
    setRenderCounter(renderCounter + 1);
    updateWeekStart(weekStart);
  };

  const onTagsChange = (tags: string[]) => {
    dashboard.tags = tags;
    setRenderCounter(renderCounter + 1);
  };

  const onEditableChange = (value: boolean) => {
    dashboard.editable = value;
    setRenderCounter(renderCounter + 1);
  };

  const editableOptions = [
    { label: t('features.dashboard.setting.editable', 'Editable'), value: true },
    { label: t('features.dashboard.setting.read-only', 'Read-only'), value: false },
  ];

  return (
    <Page navModel={sectionNav}>
      <div style={{ maxWidth: '600px' }}>
        <div className="gf-form-group">
          <Field label={t('features.dashboard.setting.name-label', 'Name')}>
            <Input id="title-input" name="title" onBlur={onBlur} defaultValue={dashboard.title} />
          </Field>
          <Field label={t('features.dashboard.setting.description-label', 'Description')}>
            <Input id="description-input" name="description" onBlur={onBlur} defaultValue={dashboard.description} />
          </Field>
          <Field label={t('features.dashboard.setting.tags-label', 'Tags')}>
            <TagsInput id="tags-input" tags={dashboard.tags} onChange={onTagsChange} width={40} />
          </Field>
          <Field label={t('features.dashboard.setting.folder-label', 'Folder')}>
            <FolderPicker
              inputId="dashboard-folder-input"
              initialTitle={dashboard.meta.folderTitle}
              initialFolderUid={dashboard.meta.folderUid}
              onChange={onFolderChange}
              enableCreateNew={true}
              dashboardId={dashboard.id}
              skipInitialLoad={true}
            />
          </Field>

          <Field
            label={t('features.dashboard.setting.editable-label', 'Editable')}
            description={t(
              'features.dashboard.setting.set-to-read-only',
              'Set to read-only to disable all editing. Reload the dashboard for changes to take effect'
            )}
          >
            <RadioButtonGroup value={dashboard.editable} options={editableOptions} onChange={onEditableChange} />
          </Field>
        </div>

        {config.featureToggles.dashboardPreviews && config.featureToggles.dashboardPreviewsAdmin && (
          <PreviewSettings uid={dashboard.uid} />
        )}

        <TimePickerSettings
          onTimeZoneChange={onTimeZoneChange}
          onWeekStartChange={onWeekStartChange}
          onRefreshIntervalChange={onRefreshIntervalChange}
          onNowDelayChange={onNowDelayChange}
          onHideTimePickerChange={onHideTimePickerChange}
          onLiveNowChange={onLiveNowChange}
          refreshIntervals={dashboard.timepicker.refresh_intervals}
          timePickerHidden={dashboard.timepicker.hidden}
          nowDelay={dashboard.timepicker.nowDelay}
          timezone={dashboard.timezone}
          weekStart={dashboard.weekStart}
          liveNow={dashboard.liveNow}
        />

        {/* @todo: Update "Graph tooltip" description to remove prompt about reloading when resolving #46581 */}
        <CollapsableSection label={t('features.dashboard.setting.panel-options-label', 'Panel options')} isOpen={true}>
          <Field
            label={t('features.dashboard.setting.graph-tooltip', 'Graph tooltip')}
            description={t(
              'features.dashboard.setting.controls-tooltip-and-hover',
              'Controls tooltip and hover highlight behavior across different panels. Reload the dashboard for changes to take effect'
            )}
          >
            <RadioButtonGroup
              onChange={onTooltipChange}
              options={GRAPH_TOOLTIP_OPTIONS}
              value={dashboard.graphTooltip}
            />
          </Field>
        </CollapsableSection>

        <div className="gf-form-button-row">
          {dashboard.meta.canDelete && <DeleteDashboardButton dashboard={dashboard} />}
        </div>
      </div>
    </Page>
  );
}

const mapDispatchToProps = {
  updateTimeZone: updateTimeZoneDashboard,
  updateWeekStart: updateWeekStartDashboard,
};

const connector = connect(null, mapDispatchToProps);

export const GeneralSettings = connector(GeneralSettingsUnconnected);
