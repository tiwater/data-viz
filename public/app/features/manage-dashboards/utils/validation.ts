import { getBackendSrv } from '@grafana/runtime';
import { t } from 'app/core/internationalization';

import { validationSrv } from '../services/ValidationSrv';

export const validateDashboardJson = (json: string) => {
  let dashboard;
  try {
    dashboard = JSON.parse(json);
  } catch (error) {
    return t('features.manage-dashboards.Not-valid-JSON', 'Not valid JSON');
  }
  if (dashboard && dashboard.hasOwnProperty('tags')) {
    if (Array.isArray(dashboard.tags)) {
      const hasInvalidTag = dashboard.tags.some((tag: string) => typeof tag !== 'string');
      if (hasInvalidTag) {
        return t('features.manage-dashboards.tags-expected-array-of-strings', 'tags expected array of strings');
      }
    } else {
      return t('features.manage-dashboards.tags-expected-array', 'tags expected array');
    }
  }
  return true;
};

export const validateGcomDashboard = (gcomDashboard: string) => {
  // From DashboardImportCtrl
  const match = /(^\d+$)|dashboards\/(\d+)/.exec(gcomDashboard);

  return match && (match[1] || match[2]) ? true : 'Could not find a valid Grafana.com ID';
};

export const validateTitle = (newTitle: string, folderUid: string) => {
  return validationSrv
    .validateNewDashboardName(folderUid, newTitle)
    .then(() => {
      return true;
    })
    .catch((error) => {
      if (error.type === 'EXISTING') {
        return error.message;
      }
    });
};

export const validateUid = (value: string) => {
  return getBackendSrv()
    .get(`/api/dashboards/uid/${value}`)
    .then((existingDashboard) => {
      return t(
        'features.manage-dashboards.existing-dashboard-error',
        'Dashboard named {{title}} in folder {{folder}} has the same UID',
        { title: existingDashboard?.dashboard.title, folder: existingDashboard?.meta.folderTitle }
      );
    })
    .catch((error) => {
      error.isHandled = true;
      return true;
    });
};
