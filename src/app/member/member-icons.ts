import {
  faArrowRightFromBracket,
  faBars,
  faCalendarDays,
  faChevronLeft,
  faCircleInfo,
  faFileLines,
  faFloppyDisk,
  faGaugeHigh,
  faGear,
  faKey,
  faPaperPlane,
  faRotateLeft,
  faShareNodes,
  faSpinner,
  faTrophy,
  faUser,
  faUsers,
  faWallet,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

export const memberIcons = {
  menu: faBars,
  logout: faArrowRightFromBracket,
  profile: faUser,
  collapse: faChevronLeft,
  dashboard: faGaugeHigh,
  teams: faUsers,
  referrals: faShareNodes,
  reports: faFileLines,
  transactions: faWallet,
  settings: faGear,
  spin: faSpinner,
  details: faCircleInfo,
  subscribe: faPaperPlane,
  close: faXmark,
  refresh: faRotateLeft,
  password: faKey,
  save: faFloppyDisk,
  reward: faTrophy,
  schedule: faCalendarDays,
  wallet: faWallet
} as const;

export type MemberIconKey = keyof typeof memberIcons;