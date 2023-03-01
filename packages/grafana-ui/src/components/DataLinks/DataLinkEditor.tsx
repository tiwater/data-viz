import { css } from '@emotion/css';
import React, { ChangeEvent } from 'react';

import { VariableSuggestion, GrafanaTheme2, DataLink } from '@grafana/data';

import { t } from '../../../src/utils/i18n';
import { useStyles2 } from '../../themes/index';
import { isCompactUrl } from '../../utils/dataLinks';
import { Field } from '../Forms/Field';
import { Input } from '../Input/Input';
import { Switch } from '../Switch/Switch';

import { DataLinkInput } from './DataLinkInput';

interface DataLinkEditorProps {
  index: number;
  isLast: boolean;
  value: DataLink;
  suggestions: VariableSuggestion[];
  onChange: (index: number, link: DataLink, callback?: () => void) => void;
}

const getStyles = (theme: GrafanaTheme2) => ({
  listItem: css`
    margin-bottom: ${theme.spacing()};
  `,
  infoText: css`
    padding-bottom: ${theme.spacing(2)};
    margin-left: 66px;
    color: ${theme.colors.text.secondary};
  `,
});

export const DataLinkEditor: React.FC<DataLinkEditorProps> = React.memo(
  ({ index, value, onChange, suggestions, isLast }) => {
    const styles = useStyles2(getStyles);

    const onUrlChange = (url: string, callback?: () => void) => {
      onChange(index, { ...value, url }, callback);
    };
    const onTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange(index, { ...value, title: event.target.value });
    };

    const onOpenInNewTabChanged = () => {
      onChange(index, { ...value, targetBlank: !value.targetBlank });
    };

    return (
      <div className={styles.listItem}>
        <Field label={t('grafana-ui.data-links.title', 'Title')}>
          <Input
            value={value.title}
            onChange={onTitleChange}
            placeholder={t('grafana-ui.data-links.show-details', 'Show details')}
          />
        </Field>

        <Field
          label={t('grafana-ui.data-links.URL', 'URL')}
          invalid={isCompactUrl(value.url)}
          error={t(
            'grafana-ui.data-links.data-link-is-an-explore-URL',
            'Data link is an Explore URL in a deprecated format. Please visit the URL to be redirected, and edit this data link to use that URL.'
          )}
        >
          <DataLinkInput value={value.url} onChange={onUrlChange} suggestions={suggestions} />
        </Field>

        <Field label={t('grafana-ui.data-links.open-in-new-tab', 'Open in new tab')}>
          <Switch value={value.targetBlank || false} onChange={onOpenInNewTabChanged} />
        </Field>

        {isLast && (
          <div className={styles.infoText}>
            {t(
              'grafana-ui.data-links.with-data-links-you-can-reference',
              'With data links you can reference data variables like series name, labels and values. Type CMD+Space, CTRL+Space, or $ to open variable suggestions.'
            )}
          </div>
        )}
      </div>
    );
  }
);

DataLinkEditor.displayName = 'DataLinkEditor';
