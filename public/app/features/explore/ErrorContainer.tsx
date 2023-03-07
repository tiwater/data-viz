import React, { FunctionComponent } from 'react';

import { DataQueryError } from '@grafana/data';
import { Alert } from '@grafana/ui';
import { FadeIn } from 'app/core/components/Animations/FadeIn';
import { t } from 'app/core/internationalization';

export interface ErrorContainerProps {
  queryError?: DataQueryError;
}

export const ErrorContainer: FunctionComponent<ErrorContainerProps> = (props) => {
  const { queryError } = props;
  const showError = queryError ? true : false;
  const duration = showError ? 100 : 10;
  const title = queryError
    ? t('features.explore.query-error', 'Query error')
    : t('app.core.service.unexpected-error', 'Unknown error');
  const message = queryError?.message || queryError?.data?.message || null;

  return (
    <FadeIn in={showError} duration={duration}>
      <Alert severity="error" title={title} topSpacing={2}>
        {message}
      </Alert>
    </FadeIn>
  );
};
