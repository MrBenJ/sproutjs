import React from 'react';
import { shallow } from 'enzyme';

import <%= ComponentName %> from './<%= ComponentName %>';

describe('<<%= ComponentName %>> tests', () => {
  const renderShallow = props => shallow(<<%= ComponentName %> {...props} />);

  it('Renders without crashing', () => {
    const wrapper = renderShallow();

    expect(wrapper).toBeTruthy();
  });
});
