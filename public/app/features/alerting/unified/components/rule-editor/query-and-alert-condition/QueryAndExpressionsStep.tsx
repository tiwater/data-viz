import React, { FC, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { LoadingState, PanelData } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Stack } from '@grafana/experimental';
import { config } from '@grafana/runtime';
import { Alert, Button, Field, InputControl, Tooltip } from '@grafana/ui';
import { t } from 'app/core/internationalization';
import { isExpressionQuery } from 'app/features/expressions/guards';
import { AlertQuery } from 'app/types/unified-alerting-dto';

import { AlertingQueryRunner } from '../../../state/AlertingQueryRunner';
import { RuleFormType, RuleFormValues } from '../../../types/rule-form';
import { getDefaultOrFirstCompatibleDataSource } from '../../../utils/datasource';
import { ExpressionEditor } from '../ExpressionEditor';
import { ExpressionsEditor } from '../ExpressionsEditor';
import { QueryEditor } from '../QueryEditor';
import { RuleEditorSection } from '../RuleEditorSection';
import { errorFromSeries, refIdExists } from '../util';

import { AlertType } from './AlertType';
import {
  addNewDataQuery,
  addNewExpression,
  duplicateQuery,
  queriesAndExpressionsReducer,
  removeExpression,
  rewireExpressions,
  setDataQueries,
  updateExpression,
  updateExpressionRefId,
  updateExpressionTimeRange,
  updateExpressionType,
} from './reducer';

interface Props {
  editingExistingRule: boolean;
  onDataChange: (error: string) => void;
}

export const QueryAndExpressionsStep: FC<Props> = ({ editingExistingRule, onDataChange }) => {
  const runner = useRef(new AlertingQueryRunner());
  const {
    setValue,
    getValues,
    watch,
    formState: { errors },
    control,
  } = useFormContext<RuleFormValues>();
  const [panelData, setPanelData] = useState<Record<string, PanelData>>({});

  const initialState = {
    queries: getValues('queries'),
    panelData: {},
  };
  const [{ queries }, dispatch] = useReducer(queriesAndExpressionsReducer, initialState);

  const [type, condition, dataSourceName] = watch(['type', 'condition', 'dataSourceName']);

  const isGrafanaManagedType = type === RuleFormType.grafana;
  const isCloudAlertRuleType = type === RuleFormType.cloudAlerting;
  const isRecordingRuleType = type === RuleFormType.cloudRecording;

  const showCloudExpressionEditor = (isRecordingRuleType || isCloudAlertRuleType) && dataSourceName;

  const cancelQueries = useCallback(() => {
    runner.current.cancel();
  }, []);

  const runQueries = useCallback(() => {
    runner.current.run(getValues('queries'));
  }, [getValues]);

  // whenever we update the queries we have to update the form too
  useEffect(() => {
    setValue('queries', queries, { shouldValidate: false });
  }, [queries, runQueries, setValue]);

  // set up the AlertQueryRunner
  useEffect(() => {
    const currentRunner = runner.current;

    runner.current.get().subscribe((data) => {
      setPanelData(data);
    });

    return () => currentRunner.destroy();
  }, []);

  const noCompatibleDataSources = getDefaultOrFirstCompatibleDataSource() === undefined;

  const isDataLoading = useMemo(() => {
    return Object.values(panelData).some((d) => d.state === LoadingState.Loading);
  }, [panelData]);

  // data queries only
  const dataQueries = useMemo(() => {
    return queries.filter((query) => !isExpressionQuery(query.model));
  }, [queries]);

  // expression queries only
  const expressionQueries = useMemo(() => {
    return queries.filter((query) => isExpressionQuery(query.model));
  }, [queries]);

  const emptyQueries = queries.length === 0;

  useEffect(() => {
    const currentCondition = getValues('condition');

    if (!currentCondition) {
      return;
    }

    const error = errorFromSeries(panelData[currentCondition]?.series || []);
    onDataChange(error?.message || '');
  }, [panelData, getValues, onDataChange]);

  const handleSetCondition = useCallback(
    (refId: string | null) => {
      if (!refId) {
        return;
      }

      runQueries(); //we need to run the queries to know if the condition is valid

      setValue('condition', refId);
    },
    [runQueries, setValue]
  );

  const onUpdateRefId = useCallback(
    (oldRefId: string, newRefId: string) => {
      const newRefIdExists = refIdExists(queries, newRefId);
      // TODO we should set an error and explain what went wrong instead of just refusing to update
      if (newRefIdExists) {
        return;
      }

      dispatch(updateExpressionRefId({ oldRefId, newRefId }));

      // update condition too if refId was updated
      if (condition === oldRefId) {
        handleSetCondition(newRefId);
      }
    },
    [condition, queries, handleSetCondition]
  );

  const onChangeQueries = useCallback(
    (updatedQueries: AlertQuery[]) => {
      dispatch(setDataQueries(updatedQueries));
      dispatch(updateExpressionTimeRange());
      // check if we need to rewire expressions
      updatedQueries.forEach((query, index) => {
        const oldRefId = queries[index].refId;
        const newRefId = query.refId;

        if (oldRefId !== newRefId) {
          dispatch(rewireExpressions({ oldRefId, newRefId }));
        }
      });
    },
    [queries]
  );

  const onDuplicateQuery = useCallback((query: AlertQuery) => {
    dispatch(duplicateQuery(query));
  }, []);

  // update the condition if it's been removed
  useEffect(() => {
    if (!refIdExists(queries, condition)) {
      const lastRefId = queries.at(-1)?.refId ?? null;
      handleSetCondition(lastRefId);
    }
  }, [condition, queries, handleSetCondition]);

  return (
    <RuleEditorSection stepNo={2} title="Set a query and alert condition">
      <AlertType editingExistingRule={editingExistingRule} />

      {/* This is the PromQL Editor for Cloud rules and recording rules */}
      {showCloudExpressionEditor && (
        <Field error={errors.expression?.message} invalid={!!errors.expression?.message}>
          <InputControl
            name="expression"
            render={({ field: { ref, ...field } }) => {
              return (
                <ExpressionEditor
                  {...field}
                  dataSourceName={dataSourceName}
                  showPreviewAlertsButton={!isRecordingRuleType}
                />
              );
            }}
            control={control}
            rules={{
              required: { value: true, message: 'A valid expression is required' },
            }}
          />
        </Field>
      )}

      {/* This is the editor for Grafana managed rules */}
      {isGrafanaManagedType && (
        <Stack direction="column">
          {/* Data Queries */}
          <QueryEditor
            queries={dataQueries}
            expressions={expressionQueries}
            onRunQueries={runQueries}
            onChangeQueries={onChangeQueries}
            onDuplicateQuery={onDuplicateQuery}
            panelData={panelData}
            condition={condition}
            onSetCondition={handleSetCondition}
          />
          {/* Expression Queries */}
          <ExpressionsEditor
            queries={queries}
            panelData={panelData}
            condition={condition}
            onSetCondition={handleSetCondition}
            onRemoveExpression={(refId) => {
              dispatch(removeExpression(refId));
            }}
            onUpdateRefId={onUpdateRefId}
            onUpdateExpressionType={(refId, type) => {
              dispatch(updateExpressionType({ refId, type }));
            }}
            onUpdateQueryExpression={(model) => {
              dispatch(updateExpression(model));
            }}
          />
          {/* action buttons */}
          <Stack direction="row">
            <Tooltip content={'You appear to have no compatible data sources'} show={noCompatibleDataSources}>
              <Button
                type="button"
                icon="plus"
                onClick={() => {
                  dispatch(addNewDataQuery());
                }}
                variant="secondary"
                aria-label={selectors.components.QueryTab.addQuery}
                disabled={noCompatibleDataSources}
              >
                {t('features.alerting.rule-editor.add-query', 'Add query')}
              </Button>
            </Tooltip>

            {config.expressionsEnabled && (
              <Button
                type="button"
                icon="plus"
                onClick={() => {
                  dispatch(addNewExpression());
                }}
                variant="secondary"
              >
                {t('features.alerting.rule-editor.add-expression', 'Add expression')}
              </Button>
            )}

            {isDataLoading && (
              <Button icon="fa fa-spinner" type="button" variant="destructive" onClick={cancelQueries}>
                {t('features.alerting.rule-editor.cancel', 'Cancel')}
              </Button>
            )}
            {!isDataLoading && (
              <Button icon="sync" type="button" onClick={() => runQueries()} disabled={emptyQueries}>
                {t('features.alerting.rule-editor.preview', 'Preview')}
              </Button>
            )}
          </Stack>

          {/* No Queries */}
          {emptyQueries && (
            <Alert
              title={t(
                'features.alerting.rule-editor.no-queries-or-expressions',
                'No queries or expressions have been configured'
              )}
              severity="warning"
            >
              {t(
                'features.alerting.rule-editor.create-at-least-one-query',
                'Create at least one query or expression to be alerted on'
              )}
            </Alert>
          )}
        </Stack>
      )}
    </RuleEditorSection>
  );
};
