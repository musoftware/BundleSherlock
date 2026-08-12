import { DetectionRule } from './types';

export const uiRules: DetectionRule[] = [
  {
    name: 'Material-UI (MUI)',
    category: 'ui',
    signatures: [
      'ownerState',
      'useThemeProps',
      'createSvgIcon',
      'overridesResolver',
      'MuiPaper-root',
      'useUtilityClasses',
      'getSlotProps',
      'slotProps',
      'composeClasses',
      'defaultProps'
    ],
    weight: 25,
    penaltyIf: ['/api/', 'paystack', 'checkoutModal']
  },
  {
    name: 'Ant Design',
    category: 'ui',
    signatures: ['ant-prefix', 'AntdProvider', 'ant-btn', 'ant-modal', 'ant-select'],
    weight: 25
  },
  {
    name: 'Radix UI',
    category: 'ui',
    signatures: ['@radix-ui', 'createPrimitive', 'Primitive.', 'Slot.Root', 'useControllableState'],
    weight: 20
  },
  {
    name: 'Chakra UI',
    category: 'ui',
    signatures: ['ChakraProvider', 'extendTheme', 'useChakra', 'chakra.', 'useStyles'],
    weight: 20
  },
  {
    name: 'Mantine',
    category: 'ui',
    signatures: ['MantineProvider', 'createStyles', 'useMantineTheme', 'useMantineCss'],
    weight: 20
  },
  {
    name: 'Emotion',
    category: 'ui',
    signatures: ['@emotion/react', '@emotion/styled', 'CacheProvider', '__EMOTION_TYPE_PLEASE_DO_NOT_USE__'],
    weight: 20
  },
  {
    name: 'Styled Components',
    category: 'ui',
    signatures: ['styled-components', 'sc-component-id', 'ServerStyleSheet', 'useTheme'],
    weight: 20
  },
  {
    name: 'Tailwind CSS Runtime',
    category: 'ui',
    signatures: ['tailwind.config', 'tw-', 'flex items-center justify-between'],
    weight: 15
  },
  {
    name: 'Bootstrap',
    category: 'ui',
    signatures: ['bs.modal', 'bs.carousel', 'bs.tooltip', 'bs.dropdown'],
    weight: 20
  }
];
