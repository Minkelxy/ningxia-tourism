import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { publishedAttractions } from '../../data/attractions';
import MapPreview from './MapPreview';

afterEach(() => cleanup());

describe('MapPreview', () => {
  it('打开后聚焦关闭按钮，关闭后将焦点还给原来的地图点位', async () => {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.textContent = '景点点位';
    document.body.appendChild(trigger);
    trigger.focus();

    const view = render(
      <MemoryRouter>
        <MapPreview attraction={publishedAttractions[0]} onClose={() => undefined} />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByRole('button', { name: '关闭景点预览' })).toHaveFocus());
    expect(view.container.querySelector('.map-preview-handle')).toHaveAttribute('aria-hidden', 'true');
    view.unmount();
    expect(trigger).toHaveFocus();
    trigger.remove();
  });
});
