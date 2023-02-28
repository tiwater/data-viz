import React, { useState } from 'react';

import { arrayUtils } from '@grafana/data';
import { DeleteButton, HorizontalGroup, Icon, IconButton, TagList } from '@grafana/ui';
import EmptyListCTA from 'app/core/components/EmptyListCTA/EmptyListCTA';
import { t } from 'app/core/internationalization';

import { DashboardModel, DashboardLink } from '../../state/DashboardModel';
import { ListNewButton } from '../DashboardSettings/ListNewButton';

type LinkSettingsListProps = {
  dashboard: DashboardModel;
  onNew: () => void;
  onEdit: (idx: number) => void;
};

export const LinkSettingsList: React.FC<LinkSettingsListProps> = ({ dashboard, onNew, onEdit }) => {
  const [links, setLinks] = useState(dashboard.links);

  const moveLink = (idx: number, direction: number) => {
    dashboard.links = arrayUtils.moveItemImmutably(links, idx, idx + direction);
    setLinks(dashboard.links);
  };

  const duplicateLink = (link: DashboardLink, idx: number) => {
    dashboard.links = [...links, { ...link }];
    setLinks(dashboard.links);
  };

  const deleteLink = (idx: number) => {
    dashboard.links = [...links.slice(0, idx), ...links.slice(idx + 1)];
    setLinks(dashboard.links);
  };

  const isEmptyList = dashboard.links.length === 0;

  if (isEmptyList) {
    return (
      <div>
        <EmptyListCTA
          onClick={onNew}
          title={t('features.dashboard.setting.there-are-no-dashboard', 'There are no dashboard links added yet')}
          buttonIcon="link"
          buttonTitle={t('features.dashboard.setting.add-dashboard-link', 'Add dashboard link')}
          infoBoxTitle={t('features.dashboard.setting.what-are-dashboard-links', 'What are dashboard links?')}
          infoBox={{
            __html: `<p>${t(
              'features.dashboard.setting.dashboard-Links-allow',
              'Dashboard Links allow you to place links to other dashboards and web sites directly below the dashboard header.'
            )}</p>`,
          }}
        />
      </div>
    );
  }

  return (
    <>
      <table role="grid" className="filter-table filter-table--hover">
        <thead>
          <tr>
            <th>{t('features.dashboard.setting.type', 'Type')}</th>
            <th>{t('features.dashboard.setting.info', 'Info')}</th>
            <th colSpan={3} />
          </tr>
        </thead>
        <tbody>
          {links.map((link, idx) => (
            <tr key={`${link.title}-${idx}`}>
              <td role="gridcell" className="pointer" onClick={() => onEdit(idx)}>
                <Icon name="external-link-alt" /> &nbsp; {link.type}
              </td>
              <td role="gridcell">
                <HorizontalGroup>
                  {link.title && <span>{link.title}</span>}
                  {link.type === 'link' && <span>{link.url}</span>}
                  {link.type === 'dashboards' && <TagList tags={link.tags ?? []} />}
                </HorizontalGroup>
              </td>
              <td style={{ width: '1%' }} role="gridcell">
                {idx !== 0 && <IconButton name="arrow-up" aria-label="arrow-up" onClick={() => moveLink(idx, -1)} />}
              </td>
              <td style={{ width: '1%' }} role="gridcell">
                {links.length > 1 && idx !== links.length - 1 ? (
                  <IconButton name="arrow-down" aria-label="arrow-down" onClick={() => moveLink(idx, 1)} />
                ) : null}
              </td>
              <td style={{ width: '1%' }} role="gridcell">
                <IconButton aria-label="copy" name="copy" onClick={() => duplicateLink(link, idx)} />
              </td>
              <td style={{ width: '1%' }} role="gridcell">
                <DeleteButton
                  aria-label={`Delete link with title "${link.title}"`}
                  size="sm"
                  onConfirm={() => deleteLink(idx)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ListNewButton onClick={onNew}>{t('features.dashboard.setting.new-link', 'New link')}</ListNewButton>
    </>
  );
};
