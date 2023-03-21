import React, { useCallback, useState } from 'react';
import { useCopyToClipboard } from 'react-use';

import { SelectableValue } from '@grafana/data';
import { EditorField, EditorHeader, EditorMode, EditorRow, FlexItem, InlineSelect, Space } from '@grafana/experimental';
import { Button, InlineSwitch, RadioButtonGroup, Tooltip } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { QueryWithDefaults } from '../defaults';
import { SQLQuery, QueryFormat, QueryRowFilter, QUERY_FORMAT_OPTIONS, DB } from '../types';

import { ConfirmModal } from './ConfirmModal';
import { DatasetSelector } from './DatasetSelector';
import { TableSelector } from './TableSelector';

export interface QueryHeaderProps {
  db: DB;
  query: QueryWithDefaults;
  onChange: (query: SQLQuery) => void;
  onRunQuery: () => void;
  onQueryRowChange: (queryRowFilter: QueryRowFilter) => void;
  queryRowFilter: QueryRowFilter;
  isQueryRunnable: boolean;
  isDatasetSelectorHidden?: boolean;
}

export function QueryHeader({
  db,
  query,
  queryRowFilter,
  onChange,
  onRunQuery,
  onQueryRowChange,
  isQueryRunnable,
  isDatasetSelectorHidden,
}: QueryHeaderProps) {
  const editorModes = [
    { label: t('plugins.sql.builder', 'Builder'), value: EditorMode.Builder },
    { label: t('plugins.sql.code', 'Code'), value: EditorMode.Code },
  ];
  const { editorMode } = query;
  const [_, copyToClipboard] = useCopyToClipboard();
  const [showConfirm, setShowConfirm] = useState(false);
  const toRawSql = db.toRawSql;

  const onEditorModeChange = useCallback(
    (newEditorMode: EditorMode) => {
      if (editorMode === EditorMode.Code) {
        setShowConfirm(true);
        return;
      }
      onChange({ ...query, editorMode: newEditorMode });
    },
    [editorMode, onChange, query]
  );

  const onFormatChange = (e: SelectableValue) => {
    const next = { ...query, format: e.value !== undefined ? e.value : QueryFormat.Table };
    onChange(next);
  };

  const onDatasetChange = (e: SelectableValue) => {
    if (e.value === query.dataset) {
      return;
    }

    const next = {
      ...query,
      dataset: e.value,
      table: undefined,
      sql: undefined,
      rawSql: '',
    };

    onChange(next);
  };

  const onTableChange = (e: SelectableValue) => {
    if (e.value === query.table) {
      return;
    }

    const next: SQLQuery = {
      ...query,
      table: e.value,
      sql: undefined,
      rawSql: '',
    };
    onChange(next);
  };

  return (
    <>
      <EditorHeader>
        <InlineSelect
          label={t('plugins.sql.format', 'Format')}
          value={query.format}
          placeholder={t('plugins.sql.select-format', 'Select format')}
          menuShouldPortal
          onChange={onFormatChange}
          options={QUERY_FORMAT_OPTIONS()}
        />

        {editorMode === EditorMode.Builder && (
          <>
            <InlineSwitch
              id="sql-filter"
              label={t('plugins.sql.filter', 'Filter')}
              transparent={true}
              showLabel={true}
              value={queryRowFilter.filter}
              onChange={(ev) =>
                ev.target instanceof HTMLInputElement &&
                onQueryRowChange({ ...queryRowFilter, filter: ev.target.checked })
              }
            />

            <InlineSwitch
              id="sql-group"
              label={t('plugins.sql.group', 'Group')}
              transparent={true}
              showLabel={true}
              value={queryRowFilter.group}
              onChange={(ev) =>
                ev.target instanceof HTMLInputElement &&
                onQueryRowChange({ ...queryRowFilter, group: ev.target.checked })
              }
            />

            <InlineSwitch
              id="sql-order"
              label={t('plugins.sql.order', 'Order')}
              transparent={true}
              showLabel={true}
              value={queryRowFilter.order}
              onChange={(ev) =>
                ev.target instanceof HTMLInputElement &&
                onQueryRowChange({ ...queryRowFilter, order: ev.target.checked })
              }
            />

            <InlineSwitch
              id="sql-preview"
              label={t('plugins.sql.preview', 'Preview')}
              transparent={true}
              showLabel={true}
              value={queryRowFilter.preview}
              onChange={(ev) =>
                ev.target instanceof HTMLInputElement &&
                onQueryRowChange({ ...queryRowFilter, preview: ev.target.checked })
              }
            />
          </>
        )}

        <FlexItem grow={1} />

        {isQueryRunnable ? (
          <Button icon="play" variant="primary" size="sm" onClick={() => onRunQuery()}>
            {t('features.variables.editor.run-query', 'Run query')}
          </Button>
        ) : (
          <Tooltip
            theme="error"
            content={
              <>
                Your query is invalid. Check below for details. <br />
                However, you can still run this query.
              </>
            }
            placement="top"
          >
            <Button icon="exclamation-triangle" variant="secondary" size="sm" onClick={() => onRunQuery()}>
              {t('features.variables.editor.run-query', 'Run query')}
            </Button>
          </Tooltip>
        )}

        <RadioButtonGroup options={editorModes} size="sm" value={editorMode} onChange={onEditorModeChange} />

        <ConfirmModal
          isOpen={showConfirm}
          onCopy={() => {
            setShowConfirm(false);
            copyToClipboard(query.rawSql!);
            onChange({
              ...query,
              rawSql: toRawSql(query),
              editorMode: EditorMode.Builder,
            });
          }}
          onDiscard={() => {
            setShowConfirm(false);
            onChange({
              ...query,
              rawSql: toRawSql(query),
              editorMode: EditorMode.Builder,
            });
          }}
          onCancel={() => setShowConfirm(false)}
        />
      </EditorHeader>

      {editorMode === EditorMode.Builder && (
        <>
          <Space v={0.5} />
          <EditorRow>
            {isDatasetSelectorHidden ? null : (
              <EditorField label={t('plugins.sql.dataset', 'Dataset')} width={25}>
                <DatasetSelector
                  db={db}
                  value={query.dataset === undefined ? null : query.dataset}
                  onChange={onDatasetChange}
                />
              </EditorField>
            )}

            <EditorField label={t('plugins.sql.table', 'Table')} width={25}>
              <TableSelector
                db={db}
                query={query}
                value={query.table === undefined ? null : query.table}
                onChange={onTableChange}
                forceFetch={isDatasetSelectorHidden}
                applyDefault
              />
            </EditorField>
          </EditorRow>
        </>
      )}
    </>
  );
}
