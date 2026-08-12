import { DetectionRule } from './types';

export const originalRules: DetectionRule[] = [
  {
    name: 'API_ENDPOINT',
    category: 'original_app',
    signatures: [
      /fetch\(["']\/api\//,
      /axios\.(get|post|put|delete)\(["']\/api\//,
      /\/api\/v[1-9]\//,
      /\/graphql/,
      /\/rest\/v[1-9]\//
    ],
    weight: -50
  },
  {
    name: 'BUSINESS_LOGIC',
    category: 'original_app',
    signatures: [
      /localStorage\.getItem\(["'](token|auth|user|session)/,
      /sessionStorage\.getItem\(["'](token|auth|user|session)/,
      /\/checkout\/|\/cart\/|\/payment\/|\/billing\//,
      /useAuth\(\)|useUser\(\)|useCart\(\)|useSession\(\)/
    ],
    weight: -40
  },
  {
    name: 'ROUTING_AND_NAVIGATION',
    category: 'original_app',
    signatures: [
      /\/dashboard\/|\/profile\/|\/settings\/|\/admin\//,
      /createBrowserRouter|defineRoute|useNavigate\(\)|useRouter\(\)/
    ],
    weight: -30
  }
];
