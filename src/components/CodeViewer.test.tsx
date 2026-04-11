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
    const vulnerableLine = container.querySelector('[data-line="3"].code-line-high');
    expect(vulnerableLine).toBeDefined();
  });

  it('highlights tracking multiple severities and scrolls to highlighted vuln', () => {
    Element.prototype.scrollIntoView = jest.fn();

    const vulnerabilities = [
      { id: '1', name: 'V1', severity: 'CRITICAL' as const, lineReference: 'Line 1', lineStart: 1, lineEnd: 1, description: '', remediation: '' },
      { id: '2', name: 'V2', severity: 'HIGH' as const, lineReference: 'Line 2', lineStart: 2, lineEnd: 2, description: '', remediation: '' },
      { id: '3', name: 'V3', severity: 'MEDIUM' as const, lineReference: 'Line 3', lineStart: 3, lineEnd: 3, description: '', remediation: '' },
    ];

    const { container, rerender } = render(
      <CodeViewer code={mockCode} language="solidity" vulnerabilities={vulnerabilities} />
    );

    expect(container.querySelector('[data-line="1"].code-line-critical')).toBeInTheDocument();
    expect(container.querySelector('[data-line="2"].code-line-high')).toBeInTheDocument();
    expect(container.querySelector('[data-line="3"].code-line-medium')).toBeInTheDocument();

    // Now set highlightedVuln
    rerender(<CodeViewer code={mockCode} language="solidity" vulnerabilities={vulnerabilities} highlightedVuln={vulnerabilities[0]} />);

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
    expect(container.querySelector('[data-line="1"].bg-primary\\/10')).toBeInTheDocument();
  });
});
