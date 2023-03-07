import React from 'react';

import { Page } from 'app/core/components/Page/Page';
import { t } from 'app/core/internationalization';
import { GrafanaRouteComponentProps } from 'app/core/navigation/types';

import { EditDataSource } from '../components/EditDataSource';
import { useDataSourceSettingsNav } from '../state';

export interface Props extends GrafanaRouteComponentProps<{ uid: string }> {}

export function EditDataSourcePage(props: Props) {
  const uid = props.match.params.uid;
  const params = new URLSearchParams(props.location.search);
  const pageId = params.get('page');
  const nav = useDataSourceSettingsNav(uid, pageId);
  nav.main.subTitle = `${t('features.data-source.type', 'Type')}:${nav.main.text}`;
  if (nav.main.breadcrumbs) {
    nav.main.breadcrumbs[0]['title'] = t('features.query.data-source', 'Data source');
  }

  return (
    <Page navId="datasources" pageNav={nav.main}>
      <Page.Contents>
        <EditDataSource uid={uid} pageId={pageId} />
      </Page.Contents>
    </Page>
  );
}

export default EditDataSourcePage;
