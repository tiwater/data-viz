import { css } from '@emotion/css';
import React from 'react';

import { GrafanaTheme2, SelectableValue } from '@grafana/data';
import { useStyles2, Select, Button, Field, InlineField, InlineSwitch, Alert } from '@grafana/ui';
import { notifyApp } from 'app/core/actions';
import appEvents from 'app/core/app_events';
import { createSuccessNotification } from 'app/core/copy/appNotification';
import { MAX_HISTORY_ITEMS } from 'app/core/history/RichHistoryLocalStorage';
import { t } from 'app/core/internationalization';
import { dispatch } from 'app/store/store';

import { supportedFeatures } from '../../../core/history/richHistoryStorageProvider';
import { ShowConfirmModalEvent } from '../../../types/events';

export interface RichHistorySettingsProps {
  retentionPeriod: number;
  starredTabAsFirstTab: boolean;
  activeDatasourceOnly: boolean;
  onChangeRetentionPeriod: (option: SelectableValue<number>) => void;
  toggleStarredTabAsFirstTab: () => void;
  toggleactiveDatasourceOnly: () => void;
  deleteRichHistory: () => void;
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css`
      font-size: ${theme.typography.bodySmall.fontSize};
    `,
    spaceBetween: css`
      margin-bottom: ${theme.spacing(3)};
    `,
    input: css`
      max-width: 200px;
    `,
    bold: css`
      font-weight: ${theme.typography.fontWeightBold};
    `,
    bottomMargin: css`
      margin-bottom: ${theme.spacing(1)};
    `,
  };
};

const retentionPeriodOptions = [
  { value: 2, label: '2 days' },
  { value: 5, label: '5 days' },
  { value: 7, label: '1 week' },
  { value: 14, label: '2 weeks' },
];

export function RichHistorySettingsTab(props: RichHistorySettingsProps) {
  const {
    retentionPeriod,
    starredTabAsFirstTab,
    activeDatasourceOnly,
    onChangeRetentionPeriod,
    toggleStarredTabAsFirstTab,
    toggleactiveDatasourceOnly,
    deleteRichHistory,
  } = props;
  const styles = useStyles2(getStyles);
  const selectedOption = retentionPeriodOptions.find((v) => v.value === retentionPeriod);

  const onDelete = () => {
    appEvents.publish(
      new ShowConfirmModalEvent({
        title: t('explore.rich-history.Delete', 'Delete'),
        text: t(
          'explore.rich-history.Are-you-sure-you-want-to-permanentl',
          'Are you sure you want to permanently delete your query history?'
        ),
        yesText: t('explore.rich-history.Delete', 'Delete'),
        icon: 'trash-alt',
        onConfirm: () => {
          deleteRichHistory();
          dispatch(
            notifyApp(
              createSuccessNotification(t('explore.rich-history.Query-history-deleted', 'Query history deleted'))
            )
          );
        },
      })
    );
  };

  return (
    <div className={styles.container}>
      {supportedFeatures().changeRetention ? (
        <Field
          label={t('explore.rich-history.History-time-span', 'History time span')}
          description={t(
            'explore.rich-history.Select-the-period-of-time-for-which',
            'Select the period of time for which Grafana will save your query history. Up to {{MAX_HISTORY_ITEMS}} entries will be stored.',
            { MAX_HISTORY_ITEMS }
          )}
        >
          <div className={styles.input}>
            <Select value={selectedOption} options={retentionPeriodOptions} onChange={onChangeRetentionPeriod}></Select>
          </div>
        </Field>
      ) : (
        <Alert severity="info" title={t('explore.rich-history.History-time-span', 'History time span')}>
          {t('explore.rich-history.Grafana-will-keep-entries-up-to', 'Grafana will keep entries up to')}{' '}
          {selectedOption?.label}.
        </Alert>
      )}
      <InlineField
        label={t(
          'explore.rich-history.Change-the-default-active-tab',
          'Change the default active tab from “Query history” to “Starred”'
        )}
        className={styles.spaceBetween}
      >
        <InlineSwitch
          id="explore-query-history-settings-default-active-tab"
          value={starredTabAsFirstTab}
          onChange={toggleStarredTabAsFirstTab}
        />
      </InlineField>
      {supportedFeatures().onlyActiveDataSource && (
        <InlineField
          label={t(
            'explore.rich-history.Only-show-queries-for-data-source-currently',
            'Only show queries for data source currently active in Explore'
          )}
          className={styles.spaceBetween}
        >
          <InlineSwitch
            id="explore-query-history-settings-data-source-behavior"
            value={activeDatasourceOnly}
            onChange={toggleactiveDatasourceOnly}
          />
        </InlineField>
      )}
      {supportedFeatures().clearHistory && (
        <div>
          <div className={styles.bold}>Clear query history</div>
          <div className={styles.bottomMargin}>Delete all of your query history, permanently.</div>
          <Button variant="destructive" onClick={onDelete}>
            {t('explore.rich-history.Clear-query-history', 'Clear query history')}
          </Button>
        </div>
      )}
    </div>
  );
}
