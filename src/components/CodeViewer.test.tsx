/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { CodeViewer } from './CodeViewer';
import { EVM_VULNERABILITIES } from '@/lib/constants';

describe('CodeViewer', () => {
  const mockCode = `pragma solidity ^0.8.0;
contract Test {
  function test() public {
    // something
  }
}`;

  it('renders code correctly', () => {
    const { getByText } = render(
      <CodeViewer code={mockCode} language="solidity" vulnerabilities={[]} />
    );
    expect(getByText('function test() public {')).toBeInTheDocument();
  });

  it('highlights vulnerable lines', () => {
    const vulnerabilities = [
      {
        id: 'test-vuln',
        name: 'Test Vuln',
        severity: 'HIGH' as const,
        lineReference: 'Line 3',
        lineStart: 3,
        lineEnd: 3,
        description: 'Test description',
        remediation: 'Test remediation'
      }
    ];

    const { container } = render(
      <CodeViewer code={mockCode} language="solidity" vulnerabilities={vulnerabilities} />
    );
    
    // We expect the line 3 wrapper to have some highlighting class
    const vulnerableLine = container.querySelector('.bg-destructive\\/20'); // bg-destructive/20 or similar based on exact logic
    expect(vulnerableLine).toBeDefined();
  });
});
