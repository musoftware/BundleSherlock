import { DetectionRule } from './types';

export const vendorRules: DetectionRule[] = [
  {
    name: 'React UI Framework',
    category: 'vendor',
    signatures: ['__REACT_DEVTOOLS_GLOBAL_HOOK__', 'React.createElement', 'ReactDOM.render'],
    weight: 20
  },
  {
    name: 'Vue.js Framework',
    category: 'vendor',
    signatures: ['__VUE_DEVTOOLS_GLOBAL_HOOK__', 'createApp', 'defineComponent'],
    weight: 20
  },
  {
    name: 'Angular Framework',
    category: 'vendor',
    signatures: ['ngDevMode', 'ɵɵdefineComponent', 'ɵɵelementStart', 'ng-version'],
    weight: 20
  },
  {
    name: 'Lodash Utility',
    category: 'vendor',
    signatures: ['lodash', 'debounce', 'throttle', 'isPlainObject', 'cloneDeep'],
    weight: 15
  },
  {
    name: 'Date-fns Utility',
    category: 'vendor',
    signatures: ['formatDistance', 'differenceInDays', 'isAfter', 'isBefore'],
    weight: 15
  },
  {
    name: 'RxJS Reactive',
    category: 'vendor',
    signatures: ['Observable', 'BehaviorSubject', 'switchMap'],
    weight: 20
  },
  {
    name: 'Three.js 3D Engine',
    category: 'vendor',
    signatures: ['THREE.WebGLRenderer', 'THREE.PerspectiveCamera', 'THREE.Mesh'],
    weight: 25
  },
  {
    name: 'D3.js Data Visualization',
    category: 'vendor',
    signatures: ['d3.select', 'd3.selectAll', 'd3.scaleLinear'],
    weight: 20
  }
];
