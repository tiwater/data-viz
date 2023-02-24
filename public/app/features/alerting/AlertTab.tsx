import React, { PureComponent } from 'react';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';

import { EventBusSrv } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { AngularComponent, config, getAngularLoader, getDataSourceSrv } from '@grafana/runtime';
import { Alert, Button, ConfirmModal, Container, CustomScrollbar, HorizontalGroup, Modal } from '@grafana/ui';
import EmptyListCTA from 'app/core/components/EmptyListCTA/EmptyListCTA';
import { t, Trans } from 'app/core/internationalization';
import { getPanelStateForModel } from 'app/features/panel/state/selectors';
import { AppNotificationSeverity, StoreState } from 'app/types';

import { AlertState } from '../../plugins/datasource/alertmanager/types';
import { PanelNotSupported } from '../dashboard/components/PanelEditor/PanelNotSupported';
import { DashboardModel } from '../dashboard/state/DashboardModel';
import { PanelModel } from '../dashboard/state/PanelModel';

import StateHistory from './StateHistory';
import { TestRuleResult } from './TestRuleResult';
import { getAlertingValidationMessage } from './getAlertingValidationMessage';

interface AngularPanelController {
  _enableAlert: () => void;
  alertState: AlertState | null;
  render: () => void;
  refresh: () => void;
}

interface OwnProps {
  dashboard: DashboardModel;
  panel: PanelModel;
}

interface ConnectedProps {
  angularPanelComponent?: AngularComponent | null;
}

interface DispatchProps {}

export type Props = OwnProps & ConnectedProps & DispatchProps;

interface State {
  validationMessage: string;
  showStateHistory: boolean;
  showDeleteConfirmation: boolean;
  showTestRule: boolean;
}

class UnConnectedAlertTab extends PureComponent<Props, State> {
  element?: HTMLDivElement | null;
  component?: AngularComponent;
  panelCtrl?: AngularPanelController;

  state: State = {
    validationMessage: '',
    showStateHistory: false,
    showDeleteConfirmation: false,
    showTestRule: false,
  };

  async componentDidMount() {
    if (config.angularSupportEnabled) {
      await import(/* webpackChunkName: "AlertTabCtrl" */ 'app/features/alerting/AlertTabCtrl');
      this.loadAlertTab();
    } else {
      // TODO probably need to migrate AlertTab to react
      alert(
        t(
          'features.dashboard.angular-support-disabled.',
          'Angular support disabled, legacy alerting cannot function without angular support'
        )
      );
    }
  }

  onAngularPanelUpdated = () => {
    this.forceUpdate();
  };

  componentDidUpdate(prevProps: Props) {
    this.loadAlertTab();
  }

  componentWillUnmount() {
    if (this.component) {
      this.component.destroy();
    }
  }

  async loadAlertTab() {
    const { panel, angularPanelComponent } = this.props;

    if (!this.element || this.component) {
      return;
    }

    if (angularPanelComponent) {
      const scope = angularPanelComponent.getScope();

      // When full page reloading in edit mode the angular panel has on fully compiled & instantiated yet
      if (!scope.$$childHead) {
        setTimeout(() => {
          this.forceUpdate();
        });
        return;
      }

      this.panelCtrl = scope.$$childHead.ctrl;
    } else {
      this.panelCtrl = this.getReactAlertPanelCtrl();
    }

    const loader = getAngularLoader();
    const template = '<alert-tab />';
    const scopeProps = { ctrl: this.panelCtrl };

    this.component = loader.load(this.element, scopeProps, template);

    const validationMessage = await getAlertingValidationMessage(
      panel.transformations,
      panel.targets,
      getDataSourceSrv(),
      panel.datasource
    );

    if (validationMessage) {
      this.setState({ validationMessage });
    }
  }

  getReactAlertPanelCtrl() {
    return {
      panel: this.props.panel,
      events: new EventBusSrv(),
      render: () => {
        this.props.panel.render();
      },
    } as any;
  }

  onAddAlert = () => {
    this.panelCtrl?._enableAlert();
    this.component?.digest();
    this.forceUpdate();
  };

  onToggleModal = (prop: keyof Omit<State, 'validationMessage'>) => {
    const value = this.state[prop];
    this.setState({ ...this.state, [prop]: !value });
  };

  renderTestRule = () => {
    if (!this.state.showTestRule) {
      return null;
    }

    const { panel, dashboard } = this.props;
    const onDismiss = () => this.onToggleModal('showTestRule');

    return (
      <Modal isOpen={true} icon="bug" title="Testing rule" onDismiss={onDismiss} onClickBackdrop={onDismiss}>
        <TestRuleResult panel={panel} dashboard={dashboard} />
      </Modal>
    );
  };

  renderDeleteConfirmation = () => {
    if (!this.state.showDeleteConfirmation) {
      return null;
    }

    const { panel } = this.props;
    const onDismiss = () => this.onToggleModal('showDeleteConfirmation');

    return (
      <ConfirmModal
        isOpen={true}
        icon="trash-alt"
        title={t('features.dashboard.setting.delete-title', 'Delete')}
        body={
          <div>
            <Trans i18nKey="features.dashboard.setting.are-you-sure-you-want">
              Are you sure you want to delete this alert rule?
            </Trans>

            <br />
            <small>
              <Trans i18nKey="features.dashboard.setting.you-need-to-save-dashboard">
                You need to save dashboard for the delete to take effect.
              </Trans>
            </small>
          </div>
        }
        confirmText={t('features.dashboard.setting.delete-alert', 'Delete alert')}
        onDismiss={onDismiss}
        onConfirm={() => {
          delete panel.alert;
          panel.thresholds = [];
          if (this.panelCtrl) {
            this.panelCtrl.alertState = null;
            this.panelCtrl.render();
          }
          this.component?.digest();
          onDismiss();
        }}
      />
    );
  };

  renderStateHistory = () => {
    if (!this.state.showStateHistory) {
      return null;
    }

    const { panel, dashboard } = this.props;
    const onDismiss = () => this.onToggleModal('showStateHistory');

    return (
      <Modal
        isOpen={true}
        icon="history"
        title={t('features.dashboard.setting.state-history', 'State history')}
        onDismiss={onDismiss}
        onClickBackdrop={onDismiss}
      >
        <StateHistory dashboard={dashboard} panelId={panel.id} onRefresh={() => this.panelCtrl?.refresh()} />
      </Modal>
    );
  };

  render() {
    const { alert, transformations } = this.props.panel;
    const { validationMessage } = this.state;
    const hasTransformations = transformations && transformations.length > 0;

    if (!alert && validationMessage) {
      return <PanelNotSupported message={validationMessage} />;
    }

    const model = {
      title: t('features.dashboard.setting.panel-has-no-alert-rule-defined', 'Panel has no alert rule defined'),
      buttonIcon: 'bell' as const,
      onClick: this.onAddAlert,
      buttonTitle: t('features.dashboard.setting.create-alert', 'Create Alert'),
    };

    return (
      <>
        <CustomScrollbar autoHeightMin="100%">
          <Container padding="md">
            <div aria-label={selectors.components.AlertTab.content}>
              {alert && hasTransformations && (
                <Alert
                  severity={AppNotificationSeverity.Error}
                  title={t(
                    'features.dashboard.setting.transformations-are-not-supported',
                    'Transformations are not supported in alert queries'
                  )}
                />
              )}

              <div ref={(element) => (this.element = element)} />
              {alert && (
                <HorizontalGroup>
                  <Button onClick={() => this.onToggleModal('showStateHistory')} variant="secondary">
                    <Trans i18nKey="features.dashboard.setting.state-history">State history</Trans>
                  </Button>
                  <Button onClick={() => this.onToggleModal('showTestRule')} variant="secondary">
                    <Trans i18nKey="features.dashboard.setting.test-rule">Test rule</Trans>
                  </Button>
                  <Button onClick={() => this.onToggleModal('showDeleteConfirmation')} variant="destructive">
                    <Trans i18nKey="features.dashboard.setting.delete-title">Delete</Trans>
                  </Button>
                </HorizontalGroup>
              )}
              {!alert && !validationMessage && <EmptyListCTA {...model} />}
            </div>
          </Container>
        </CustomScrollbar>

        {this.renderTestRule()}
        {this.renderDeleteConfirmation()}
        {this.renderStateHistory()}
      </>
    );
  }
}

const mapStateToProps: MapStateToProps<ConnectedProps, OwnProps, StoreState> = (state, props) => {
  return {
    angularPanelComponent: getPanelStateForModel(state, props.panel)?.angularComponent,
  };
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = {};

export const AlertTab = connect(mapStateToProps, mapDispatchToProps)(UnConnectedAlertTab);
