import { useEffect } from 'react';
import { useAsyncFn } from 'react-use';

import { locationService } from '@grafana/runtime';
import { useAppNotification } from 'app/core/copy/appNotification';
import { t } from 'app/core/internationalization';
import { deleteDashboard } from 'app/features/manage-dashboards/state/actions';

export const useDashboardDelete = (uid: string, cleanUpDashboardAndVariables: () => void) => {
  const [state, onDeleteDashboard] = useAsyncFn(() => deleteDashboard(uid, false), []);
  const notifyApp = useAppNotification();

  useEffect(() => {
    if (state.value) {
      cleanUpDashboardAndVariables();
      locationService.replace('/');
      notifyApp.success(
        t('features.dashboard.dashboard-deleted', 'Dashboard Deleted'),
        `${state.value.title} ${t('features.dashboard.dashboard-has-been-deleted', 'has been deleted')}`
      );
    }
  }, [state, notifyApp, cleanUpDashboardAndVariables]);

  return { state, onDeleteDashboard };
};
