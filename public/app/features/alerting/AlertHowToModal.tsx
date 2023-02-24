import React from 'react';

import { Modal, VerticalGroup } from '@grafana/ui';
import { t, Trans } from 'app/core/internationalization';

export interface AlertHowToModalProps {
  onDismiss: () => void;
}

export function AlertHowToModal({ onDismiss }: AlertHowToModalProps): JSX.Element {
  return (
    <Modal
      title={t('features.alerting.add-an-alert', 'Adding an Alert')}
      isOpen
      onDismiss={onDismiss}
      onClickBackdrop={onDismiss}
    >
      <VerticalGroup spacing="sm">
        <img src="public/img/alert_howto_new.png" alt="" />
        <p>
          <Trans i18nKey="features.dashboard.setting.alerts-are-added-and-configured">
            Alerts are added and configured in the Alert tab of any dashboard graph panel, letting you build and
            visualize an alert using existing queries.
          </Trans>
        </p>
        <p>
          <Trans i18nKey="features.dashboard.setting.remember-to-save-the-dashboard">
            Remember to save the dashboard to persist your alert rule changes.
          </Trans>
        </p>
      </VerticalGroup>
    </Modal>
  );
}
