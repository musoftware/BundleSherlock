import { DetectionRule } from './types';

export const uiRules: DetectionRule[] = [
  {
    name: 'React Flow Diagram Library',
    category: 'vendor_ui',
    signatures: [
      'react-flow__node',
      'react-flow__edge',
      'react-flow__renderer',
      'react-flow__container',
      'ReactFlowProvider',
      'useReactFlow'
    ],
    weight: 50
  },
  {
    name: 'Material-UI (MUI)',
    category: 'vendor_ui',
    signatures: [
      /Mui[A-Z][a-z]+-root/,
      'ownerState && ownerState.variant',
      'useThemeProps({'
    ],
    weight: 40,
    antiSignatures: ['/api/']
  },
  {
    name: 'Ant Design',
    category: 'vendor_ui',
    signatures: [
      'ant-prefix',
      'AntdProvider',
      'ant-btn-primary'
    ],
    weight: 40
  },
  {
    name: 'Radix UI',
    category: 'vendor_ui',
    signatures: [
      '@radix-ui',
      'createPrimitive',
      'Slot.Root'
    ],
    weight: 35
  }
];
