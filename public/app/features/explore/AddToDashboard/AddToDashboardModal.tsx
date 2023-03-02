import { partial } from 'lodash';
import React, { useEffect, useState } from 'react';
import { DeepMap, FieldError, useForm } from 'react-hook-form';

import { locationUtil, SelectableValue } from '@grafana/data';
import { config, locationService, reportInteraction } from '@grafana/runtime';
import { Alert, Button, Field, InputControl, Modal, RadioButtonGroup } from '@grafana/ui';
import { DashboardPicker } from 'app/core/components/Select/DashboardPicker';
import { t, Trans } from 'app/core/internationalization';
import { contextSrv } from 'app/core/services/context_srv';
import { removeDashboardToFetchFromLocalStorage } from 'app/features/dashboard/state/initDashboard';
import { ExploreId, AccessControlAction, useSelector } from 'app/types';

import { getExploreItemSelector } from '../state/selectors';

import { setDashboardInLocalStorage, AddToDashboardError } from './addToDashboard';

enum SaveTarget {
  NewDashboard = 'new-dashboard',
  ExistingDashboard = 'existing-dashboard',
}

interface SaveTargetDTO {
  saveTarget: SaveTarget;
}
interface SaveToNewDashboardDTO extends SaveTargetDTO {
  saveTarget: SaveTarget.NewDashboard;
}

interface SaveToExistingDashboard extends SaveTargetDTO {
  saveTarget: SaveTarget.ExistingDashboard;
  dashboardUid: string;
}

type FormDTO = SaveToNewDashboardDTO | SaveToExistingDashboard;

function assertIsSaveToExistingDashboardError(
  errors: DeepMap<FormDTO, FieldError>
): asserts errors is DeepMap<SaveToExistingDashboard, FieldError> {
  // the shape of the errors object is always compatible with the type above, but we need to
  // explicitly assert its type so that TS can narrow down FormDTO to SaveToExistingDashboard
  // when we use it in the form.
}

function getDashboardURL(dashboardUid?: string) {
  return dashboardUid ? `d/${dashboardUid}` : 'dashboard/new';
}

enum GenericError {
  UNKNOWN = 'unknown-error',
  NAVIGATION = 'navigation-error',
}

interface SubmissionError {
  error: AddToDashboardError | GenericError;
  message: string;
}

interface Props {
  onClose: () => void;
  exploreId: ExploreId;
}

export const AddToDashboardModal = ({ onClose, exploreId }: Props) => {
  const exploreItem = useSelector(getExploreItemSelector(exploreId))!;
  const [submissionError, setSubmissionError] = useState<SubmissionError | undefined>();
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormDTO>({
    defaultValues: { saveTarget: SaveTarget.NewDashboard },
  });

  const canCreateDashboard = contextSrv.hasAccess(AccessControlAction.DashboardsCreate, contextSrv.isEditor);
  const canWriteDashboard = contextSrv.hasAccess(AccessControlAction.DashboardsWrite, contextSrv.isEditor);

  const saveTargets: Array<SelectableValue<SaveTarget>> = [];
  if (canCreateDashboard) {
    saveTargets.push({
      label: t('datasource-onboarding.new-dashboard', 'New dashboard'),
      value: SaveTarget.NewDashboard,
    });
  }
  if (canWriteDashboard) {
    saveTargets.push({
      label: t('explore.existing-dashboard', 'Existing dashboard'),
      value: SaveTarget.ExistingDashboard,
    });
  }

  const saveTarget = saveTargets.length > 1 ? watch('saveTarget') : saveTargets[0].value;

  const modalTitle = `${t('explore.add-panel-to', 'Add panel to')}${
    saveTargets.length > 1 ? t('nav.create-dashboard.title', 'Dashboard') : saveTargets[0].label!.toLowerCase()
  }`;

  const onSubmit = async (openInNewTab: boolean, data: FormDTO) => {
    setSubmissionError(undefined);
    const dashboardUid = data.saveTarget === SaveTarget.ExistingDashboard ? data.dashboardUid : undefined;

    reportInteraction('e_2_d_submit', {
      newTab: openInNewTab,
      saveTarget: data.saveTarget,
      queries: exploreItem.queries.length,
    });

    try {
      await setDashboardInLocalStorage({
        dashboardUid,
        datasource: exploreItem.datasourceInstance?.getRef(),
        queries: exploreItem.queries,
        queryResponse: exploreItem.queryResponse,
      });
    } catch (error) {
      switch (error) {
        case AddToDashboardError.FETCH_DASHBOARD:
          setSubmissionError({
            error,
            message: t('explore.could-not-fetch-dashboard', 'Could not fetch dashboard information. Please try again.'),
          });
          break;
        case AddToDashboardError.SET_DASHBOARD_LS:
          setSubmissionError({
            error,
            message: t(
              'explore.could-not-add-panel-to-dashboard',
              'Could not add panel to dashboard. Please try again.'
            ),
          });
          break;
        default:
          setSubmissionError({
            error: GenericError.UNKNOWN,
            message: t('explore.something-went-wrong', 'Something went wrong. Please try again.'),
          });
      }
      return;
    }

    const dashboardURL = getDashboardURL(dashboardUid);
    if (!openInNewTab) {
      onClose();
      locationService.push(locationUtil.stripBaseFromUrl(dashboardURL));
      return;
    }

    const didTabOpen = !!global.open(config.appUrl + dashboardURL, '_blank');
    if (!didTabOpen) {
      setSubmissionError({
        error: GenericError.NAVIGATION,
        message: t(
          'explore.could-not-navigate-to-the-selected-dashboard',
          'Could not navigate to the selected dashboard. Please try again.'
        ),
      });
      removeDashboardToFetchFromLocalStorage();
      return;
    }
    onClose();
  };

  useEffect(() => {
    reportInteraction('e_2_d_open');
  }, []);

  return (
    <Modal title={modalTitle} onDismiss={onClose} isOpen>
      <form>
        {saveTargets.length > 1 && (
          <InputControl
            control={control}
            render={({ field: { ref, ...field } }) => (
              <Field
                label={t('explore.target-dashboard-label', 'Target dashboard')}
                description={t('explore.choose-where-to-add-the-panel', 'Choose where to add the panel.')}
              >
                <RadioButtonGroup options={saveTargets} {...field} id="e2d-save-target" />
              </Field>
            )}
            name="saveTarget"
          />
        )}

        {saveTarget === SaveTarget.ExistingDashboard &&
          (() => {
            assertIsSaveToExistingDashboardError(errors);
            return (
              <InputControl
                render={({ field: { ref, value, onChange, ...field } }) => (
                  <Field
                    label={t('nav.create-dashboard.title', 'Dashboard')}
                    description={t(
                      'explore.select-in-which-dashboard',
                      'Select in which dashboard the panel will be created.'
                    )}
                    error={errors.dashboardUid?.message}
                    invalid={!!errors.dashboardUid}
                  >
                    <DashboardPicker
                      {...field}
                      inputId="e2d-dashboard-picker"
                      defaultOptions
                      onChange={(d) => onChange(d?.uid)}
                    />
                  </Field>
                )}
                control={control}
                name="dashboardUid"
                shouldUnregister
                rules={{
                  required: { value: true, message: t('explore.this-field-is-required', 'This field is required.') },
                }}
              />
            );
          })()}

        {submissionError && (
          <Alert severity="error" title={t('explore.error-adding-the-panel', 'Error adding the panel')}>
            {submissionError.message}
          </Alert>
        )}

        <Modal.ButtonRow>
          <Button type="reset" onClick={onClose} fill="outline" variant="secondary">
            <Trans i18nKey="export.cancel-button">Cancel</Trans>
          </Button>
          <Button
            type="submit"
            variant="secondary"
            onClick={handleSubmit(partial(onSubmit, true))}
            icon="external-link-alt"
          >
            <Trans i18nKey="explore.open-in-new-tab-button">Open in new tab</Trans>
          </Button>
          <Button type="submit" variant="primary" onClick={handleSubmit(partial(onSubmit, false))} icon="apps">
            <Trans i18nKey="explore.open-dashboard-button">Open dashboard</Trans>
          </Button>
        </Modal.ButtonRow>
      </form>
    </Modal>
  );
};
