import React, { PropsWithChildren, useMemo } from 'react';

import { SelectableValue } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { t } from 'app/core/internationalization';

import { VariableSelectField } from '../editor/VariableSelectField';
import { VariableSort } from '../types';

interface Props {
  onChange: (option: SelectableValue<VariableSort>) => void;
  sort: VariableSort;
}

const getSORT_OPTIONS = () => [
  { label: t('features.query.disabled', 'Disabled'), value: VariableSort.disabled },
  { label: t('features.query.alphabetical-asc', 'Alphabetical (asc)'), value: VariableSort.alphabeticalAsc },
  { label: t('features.query.alphabetical-desc', 'Alphabetical (desc)'), value: VariableSort.alphabeticalDesc },
  { label: t('features.query.numerical-asc', 'Numerical (asc)'), value: VariableSort.numericalAsc },
  { label: t('features.query.numerical-desc', 'Numerical (desc)'), value: VariableSort.numericalDesc },
  {
    label: t('features.query.alphabetical-case-insensitive-asc', 'Alphabetical (case-insensitive, asc)'),
    value: VariableSort.alphabeticalCaseInsensitiveAsc,
  },
  {
    label: t('features.query.alphabetical-case-insensitive-desc', 'Alphabetical (case-insensitive, desc)'),
    value: VariableSort.alphabeticalCaseInsensitiveDesc,
  },
];
export function QueryVariableSortSelect({ onChange, sort }: PropsWithChildren<Props>) {
  // const SORT_OPTIONS = [
  //   { label: t("features.query.disabled",'Disabled'), value: VariableSort.disabled },
  //   { label: t("features.query.alphabetical-asc",'Alphabetical (asc)'), value: VariableSort.alphabeticalAsc },
  //   { label: t("features.query.alphabetical-desc",'Alphabetical (desc)'), value: VariableSort.alphabeticalDesc },
  //   { label: t("features.query.numerical-asc",'Numerical (asc)'), value: VariableSort.numericalAsc },
  //   { label: t("features.query.numerical-desc",'Numerical (desc)'), value: VariableSort.numericalDesc },
  //   { label: t("features.query.alphabetical-case-insensitive-asc",'Alphabetical (case-insensitive, asc)'), value: VariableSort.alphabeticalCaseInsensitiveAsc },
  //   { label: t("features.query.alphabetical-case-insensitive-desc",'Alphabetical (case-insensitive, desc)'), value: VariableSort.alphabeticalCaseInsensitiveDesc },
  // ];
  const value = useMemo(() => getSORT_OPTIONS().find((o) => o.value === sort) ?? getSORT_OPTIONS()[0], [sort]);

  return (
    <VariableSelectField
      name={t('features.query.sort', 'Sort')}
      description={t('features.query.how-to-sort-the-values', 'How to sort the values of this variable')}
      value={value}
      options={getSORT_OPTIONS()}
      onChange={onChange}
      testId={selectors.pages.Dashboard.Settings.Variables.Edit.QueryVariable.queryOptionsSortSelectV2}
      width={25}
    />
  );
}
