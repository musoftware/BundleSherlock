import { DetectionRule } from './types';

export const appRules: DetectionRule[] = [
  {
    name: 'Custom API Endpoints & Fetching',
    category: 'app',
    signatures: ['/api/', '/checkout/', '/auth/', '/user/', '/v1/', '/v2/', 'fetch(', 'axios.post(', 'axios.get('],
    weight: 35
  },
  {
    name: 'Business State & Storage Operations',
    category: 'app',
    signatures: ['localStorage', 'sessionStorage', 'paystack', 'activeTransaction', 'checkoutModal', 'logAttempt'],
    weight: 30
  },
  {
    name: 'React Application State & Hooks',
    category: 'app',
    signatures: ['useState(', 'useEffect(', 'useContext(', 'useCallback(', 'useMemo(', 'useRef('],
    weight: 15
  },
  {
    name: 'Router & Navigation Commands',
    category: 'app',
    signatures: ['router.push(', 'navigate(', 'useNavigate()', 'useLocation()', 'Link to='],
    weight: 25
  }
];
