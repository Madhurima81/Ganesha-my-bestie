import React from 'react';
import { render, screen } from '@testing-library/react';
import InteractiveElement from '../../../../src/lib/components/interactive/InteractiveElement.jsx';

test('renders the component correctly', () => {
  render(<InteractiveElement>Test Content</InteractiveElement>);
  expect(screen.getByText('Test Content')).toBeInTheDocument();
});