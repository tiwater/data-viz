import React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { reportInteraction } from '@grafana/runtime';
import { Button, ButtonVariant, ComponentSize, ModalsController } from '@grafana/ui';
import { Trans } from 'app/core/internationalization';
import { DashboardModel } from 'app/features/dashboard/state';

import { SaveDashboardDrawer } from './SaveDashboardDrawer';

interface SaveDashboardButtonProps {
  dashboard: DashboardModel;
  onSaveSuccess?: () => void;
  size?: ComponentSize;
}

export const SaveDashboardButton: React.FC<SaveDashboardButtonProps> = ({ dashboard, onSaveSuccess, size }) => {
  return (
    <ModalsController>
      {({ showModal, hideModal }) => {
        return (
          <Button
            size={size}
            onClick={() => {
              showModal(SaveDashboardDrawer, {
                dashboard,
                onSaveSuccess,
                onDismiss: hideModal,
              });
            }}
            aria-label={selectors.pages.Dashboard.Settings.General.saveDashBoard}
          >
            <Trans i18nKey="dashboard.save-dashboard.title">Save dashboard</Trans>
          </Button>
        );
      }}
    </ModalsController>
  );
};

export const SaveDashboardAsButton: React.FC<SaveDashboardButtonProps & { variant?: ButtonVariant }> = ({
  dashboard,
  onSaveSuccess,
  variant,
  size,
}) => {
  return (
    <ModalsController>
      {({ showModal, hideModal }) => {
        return (
          <Button
            size={size}
            onClick={() => {
              reportInteraction('grafana_dashboard_save_as_clicked');
              showModal(SaveDashboardDrawer, {
                dashboard,
                onSaveSuccess,
                onDismiss: hideModal,
                isCopy: true,
              });
            }}
            variant={variant}
            aria-label={selectors.pages.Dashboard.Settings.General.saveAsDashBoard}
          >
            <Trans i18nKey="dashboard.save-dashboard.save-as">Save As</Trans>
          </Button>
        );
      }}
    </ModalsController>
  );
};
