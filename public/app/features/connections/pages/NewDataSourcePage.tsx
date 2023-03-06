import * as React from 'react';

import { Page } from 'app/core/components/Page/Page';
import { t } from 'app/core/internationalization';
import { NewDataSource } from 'app/features/datasources/components/NewDataSource';

export function NewDataSourcePage() {
  return (
    <Page
      navId={'connections-your-connections-datasources'}
      pageNav={{
        text: t('features.data-source.add-data-source', 'Add data source'),
        subTitle: t('features.data-source.choose-a-data-source-type', 'Choose a data source type'),
        active: true,
      }}
    >
      <Page.Contents>
        <NewDataSource />
      </Page.Contents>
    </Page>
  );
}
