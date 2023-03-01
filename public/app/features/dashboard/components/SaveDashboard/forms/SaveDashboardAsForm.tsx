import React from 'react';

import { Button, Input, Switch, Form, Field, InputControl, HorizontalGroup } from '@grafana/ui';
import { FolderPicker } from 'app/core/components/Select/FolderPicker';
import { t, Trans } from 'app/core/internationalization';
import { DashboardModel, PanelModel } from 'app/features/dashboard/state';
import { validationSrv } from 'app/features/manage-dashboards/services/ValidationSrv';

import { SaveDashboardFormProps } from '../types';

interface SaveDashboardAsFormDTO {
  title: string;
  $folder: { uid?: string; title?: string };
  copyTags: boolean;
}

const getSaveAsDashboardClone = (dashboard: DashboardModel) => {
  const clone = dashboard.getSaveModelClone();
  clone.id = null;
  clone.uid = '';
  clone.title += ' Copy';
  clone.editable = true;

  // remove alerts if source dashboard is already persisted
  // do not want to create alert dupes
  if (dashboard.id > 0) {
    clone.panels.forEach((panel: PanelModel) => {
      if (panel.type === 'graph' && panel.alert) {
        delete panel.thresholds;
      }
      delete panel.alert;
    });
  }

  return clone;
};

export interface SaveDashboardAsFormProps extends SaveDashboardFormProps {
  isNew?: boolean;
}

export const SaveDashboardAsForm: React.FC<SaveDashboardAsFormProps> = ({
  dashboard,
  isNew,
  onSubmit,
  onCancel,
  onSuccess,
}) => {
  const defaultValues: SaveDashboardAsFormDTO = {
    title: isNew ? dashboard.title : `${dashboard.title} ${t('dashboard.save-dashboard.copy', 'Copy')}`,
    $folder: {
      uid: dashboard.meta.folderUid,
      title: dashboard.meta.folderTitle,
    },
    copyTags: false,
  };

  const validateDashboardName = (getFormValues: () => SaveDashboardAsFormDTO) => async (dashboardName: string) => {
    if (dashboardName && dashboardName === getFormValues().$folder.title?.trim()) {
      return t(
        'dashboard.save-dashboard.cannot-be-the-same-as-folder-name',
        'Dashboard name cannot be the same as folder name'
      );
    }
    try {
      await validationSrv.validateNewDashboardName(getFormValues().$folder.uid, dashboardName);
      return true;
    } catch (e) {
      return e instanceof Error
        ? e.message
        : t('dashboard.save-dashboard.dashboard name is invalid', 'Dashboard name is invalid');
    }
  };

  return (
    <Form
      defaultValues={defaultValues}
      onSubmit={async (data: SaveDashboardAsFormDTO) => {
        if (!onSubmit) {
          return;
        }

        const clone = getSaveAsDashboardClone(dashboard);
        clone.title = data.title;
        if (!data.copyTags) {
          clone.tags = [];
        }

        const result = await onSubmit(
          clone,
          {
            folderUid: data.$folder.uid,
          },
          dashboard
        );

        if (result.status === 'success') {
          onSuccess();
        }
      }}
    >
      {({ register, control, errors, getValues }) => (
        <>
          <Field
            label={t('dashboard.save-dashboard.dashboard-name', 'Dashboard name')}
            invalid={!!errors.title}
            error={errors.title?.message}
          >
            <Input
              {...register('title', {
                validate: validateDashboardName(getValues),
              })}
              aria-label="Save dashboard title field"
              autoFocus
            />
          </Field>
          <Field label={t('dashboard.save-dashboard.folder', 'Folder')}>
            <InputControl
              render={({ field: { ref, ...field } }) => (
                <FolderPicker
                  {...field}
                  dashboardId={dashboard.id}
                  initialFolderUid={dashboard.meta.folderUid}
                  initialTitle={dashboard.meta.folderTitle}
                  enableCreateNew
                />
              )}
              control={control}
              name="$folder"
            />
          </Field>
          {!isNew && (
            <Field label={t('dashboard.save-dashboard.copy-tags', 'Copy tags')}>
              <Switch {...register('copyTags')} />
            </Field>
          )}
          <HorizontalGroup>
            <Button type="button" variant="secondary" onClick={onCancel} fill="outline">
              <Trans i18nKey="explore.cancel-button">Cancel</Trans>
            </Button>
            <Button type="submit" aria-label="Save dashboard button">
              <Trans i18nKey="common.save">Save</Trans>
            </Button>
          </HorizontalGroup>
        </>
      )}
    </Form>
  );
};
