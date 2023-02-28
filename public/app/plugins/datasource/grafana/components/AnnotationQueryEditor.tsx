import { css } from '@emotion/css';
import React from 'react';

import { SelectableValue } from '@grafana/data';
import { Field, FieldSet, Select, Switch } from '@grafana/ui';
import { TagFilter } from 'app/core/components/TagFilter/TagFilter';
import { t } from 'app/core/internationalization';
import { getAnnotationTags } from 'app/features/annotations/api';

import { GrafanaAnnotationQuery, GrafanaAnnotationType, GrafanaQuery } from '../types';

const limitOptions = [10, 50, 100, 200, 300, 500, 1000, 2000].map((limit) => ({
  label: String(limit),
  value: limit,
}));

interface Props {
  query: GrafanaQuery;
  onChange: (newValue: GrafanaAnnotationQuery) => void;
}

export default function AnnotationQueryEditor({ query, onChange }: Props) {
  const matchTooltipContent = t(
    'features.dashboard.setting.enabling-this-returns-annotations',
    'Enabling this returns annotations that match any of the tags specified below'
  );

  const tagsTooltipContent = (
    <div>
      {t(
        'features.dashboard.setting.specify-a-list-of-tags-to-match',
        'Specify a list of tags to match. To specify a key and value tag use `key:value` syntax.'
      )}
    </div>
  );

  const annotationTypes = [
    {
      label: t('features.dashboard.setting.dashboard', 'Dashboard'),
      value: GrafanaAnnotationType.Dashboard,
      description: t(
        'features.dashboard.setting.query-for-events-created-on',
        'Query for events created on this dashboard and show them in the panels where they where created'
      ),
    },
    {
      label: t('features.dashboard.setting.tags', 'Tags'),
      value: GrafanaAnnotationType.Tags,
      description: t(
        'features.dashboard.setting.this-will-fetch-any-annotation',
        'This will fetch any annotation events that match the tags filter'
      ),
    },
  ];
  const annotationQuery = query as GrafanaAnnotationQuery;
  const { limit, matchAny, tags, type } = annotationQuery;
  const styles = getStyles();

  const onFilterByChange = (newValue: SelectableValue<GrafanaAnnotationType>) =>
    onChange({
      ...annotationQuery,
      type: newValue.value!,
    });

  const onMaxLimitChange = (newValue: SelectableValue<number>) =>
    onChange({
      ...annotationQuery,
      limit: newValue.value!,
    });

  const onMatchAnyChange = (newValue: React.ChangeEvent<HTMLInputElement>) =>
    onChange({
      ...annotationQuery,
      matchAny: newValue.target.checked,
    });

  const onTagsChange = (tags: string[]) =>
    onChange({
      ...annotationQuery,
      tags,
    });

  return (
    <FieldSet className={styles.container}>
      <Field label={t('features.dashboard.setting.filter-by', 'Filter by')}>
        <Select
          inputId="grafana-annotations__filter-by"
          options={annotationTypes}
          value={type}
          onChange={onFilterByChange}
        />
      </Field>
      <Field label={t('features.dashboard.setting.max-limit', 'Max limit')}>
        <Select
          inputId="grafana-annotations__limit"
          width={16}
          options={limitOptions}
          value={limit}
          onChange={onMaxLimitChange}
        />
      </Field>
      {type === GrafanaAnnotationType.Tags && (
        <>
          <Field label={t('features.dashboard.setting.match-any', 'Match any')} description={matchTooltipContent}>
            <Switch id="grafana-annotations__match-any" value={matchAny} onChange={onMatchAnyChange} />
          </Field>
          <Field label={t('features.dashboard.setting.tags', 'Tags')} description={tagsTooltipContent}>
            <TagFilter
              allowCustomValue
              inputId="grafana-annotations__tags"
              onChange={onTagsChange}
              tagOptions={getAnnotationTags}
              tags={tags ?? []}
            />
          </Field>
        </>
      )}
    </FieldSet>
  );
}

const getStyles = () => {
  return {
    container: css`
      max-width: 600px;
    `,
  };
};
