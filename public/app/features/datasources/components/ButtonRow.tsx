import React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { Button, LinkButton } from '@grafana/ui';
import { contextSrv } from 'app/core/core';
import { t } from 'app/core/internationalization';
import { AccessControlAction } from 'app/types';

export interface Props {
  exploreUrl: string;
  canSave: boolean;
  canDelete: boolean;
  onDelete: () => void;
  onSubmit: (event: any) => void;
  onTest: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export function ButtonRow({ canSave, canDelete, onDelete, onSubmit, onTest, exploreUrl }: Props) {
  const canExploreDataSources = contextSrv.hasPermission(AccessControlAction.DataSourcesExplore);

  return (
    <div className="gf-form-button-row">
      <Button variant="secondary" fill="solid" type="button" onClick={() => history.back()}>
        {t('features.data-source.cancel', 'Cancel')}
      </Button>
      {/* <LinkButton variant="secondary" fill="solid" href={exploreUrl} disabled={!canExploreDataSources}>
        {t('features.data-source.explore', 'Explore')}
      </LinkButton> */}
      <Button
        type="button"
        variant="destructive"
        disabled={!canDelete}
        onClick={onDelete}
        aria-label={selectors.pages.DataSource.delete}
      >
        {t('features.data-source.delete', 'Delete')}
      </Button>
      {canSave && (
        <Button
          type="submit"
          variant="primary"
          disabled={!canSave}
          onClick={(event) => onSubmit(event)}
          aria-label={selectors.pages.DataSource.saveAndTest}
        >
          {t('features.data-source.save', 'Save')} &amp; {t('features.data-source.test', 'Test')}
        </Button>
      )}
      {!canSave && (
        <Button variant="primary" onClick={onTest}>
          {t('features.data-source.test', 'Test')}
        </Button>
      )}
    </div>
  );
}
