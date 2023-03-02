import { css } from '@emotion/css';
import React, { PureComponent } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { config } from '@grafana/runtime';
import { Modal, stylesFactory } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { dashboardWatcher } from './dashboardWatcher';
import { DashboardEvent, DashboardEventAction } from './types';

interface Props {
  event?: DashboardEvent;
}

interface State {
  dismiss?: boolean;
}

interface ActionInfo {
  label: string;
  description: string;
  action: () => void;
}

export class DashboardChangedModal extends PureComponent<Props, State> {
  state: State = {};

  discardAndReload: ActionInfo = {
    label: t('features.live.dashboard.discard-local-changes', 'Discard Local changes'),
    description: t(
      'features.live.dashboard.load-the-latest-saved-version',
      'Load the latest saved version for this dashboard'
    ),
    action: () => {
      dashboardWatcher.reloadPage();
      this.onDismiss();
    },
  };

  continueEditing: ActionInfo = {
    label: t('features.live.dashboard.continue-editing', 'Continue editing'),
    description: t(
      'features.live.dashboard.keep-your-local-changes-and-continue',
      'Keep your local changes and continue editing.  Note: when you save, this will overwrite the most recent changes'
    ),
    action: () => {
      this.onDismiss();
    },
  };

  acceptDelete: ActionInfo = {
    label: t('features.live.dashboard.discard-local-changes', 'Discard Local changes'),
    description: t('features.live.dashboard.view-grafana-homepage', 'view grafana homepage'),
    action: () => {
      // Navigate to the root URL
      document.location.href = config.appUrl;
    },
  };

  onDismiss = () => {
    this.setState({ dismiss: true });
  };

  render() {
    const { event } = this.props;
    const { dismiss } = this.state;
    const styles = getStyles(config.theme2);

    const isDelete = event?.action === DashboardEventAction.Deleted;

    const options = isDelete
      ? [this.continueEditing, this.acceptDelete]
      : [this.continueEditing, this.discardAndReload];

    return (
      <Modal
        isOpen={!dismiss}
        title={t('features.live.dashboard.dashboard-changed', 'Dashboard Changed')}
        icon="copy"
        onDismiss={this.onDismiss}
        onClickBackdrop={() => {}}
        className={styles.modal}
      >
        <div>
          {isDelete ? (
            <div>
              {t(
                'features.live.dashboard.this-dashboard-has-been-deleted',
                'This dashboard has been deleted by another session'
              )}
            </div>
          ) : (
            <div>
              {t(
                'features.live.dashboard.this-dashboard-has-been-modifed',
                'This dashboard has been modifed by another session'
              )}
            </div>
          )}
          <br />
          {options.map((opt) => {
            return (
              <div key={opt.label} onClick={opt.action} className={styles.radioItem}>
                <h3>{opt.label}</h3>
                {opt.description}
              </div>
            );
          })}
          <br />
        </div>
      </Modal>
    );
  }
}

const getStyles = stylesFactory((theme: GrafanaTheme2) => {
  return {
    modal: css`
      width: 500px;
    `,
    radioItem: css`
      margin: 0;
      font-size: ${theme.typography.size.sm};
      color: ${theme.colors.text.secondary};
      padding: 10px;
      cursor: pointer;
      width: 100%;

      &:hover {
        background: ${theme.colors.primary.main};
        color: ${theme.colors.text};
      }
    `,
  };
});
