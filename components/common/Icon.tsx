
import React from 'react';
import { IconName } from '../../types.ts';

// FIX: Add optional title prop for tooltips and accessibility
interface IconProps {
  name: IconName;
  className?: string;
  title?: string;
}

const ICONS: Record<IconName, JSX.Element> = {
  dashboard: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h-1.5m1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m-2.25-1.5L9 13.5m0 0l1.5-2.25m0 0l1.5 2.25m0 0l2.25 3.375" />,
  add: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
  reports: <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />,
  settings: <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM12 15a3 3 0 100-6 3 3 0 000 6z" />,
  income: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />,
  expense: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />,
  edit: <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />,
  delete: <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.716C7.59 2.75 6.68 3.704 6.68 4.884v.916m7.5 0h-7.5" />,
  close: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
  logout: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />,
  login: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />,
  sun: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />,
  moon: <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />,
  download: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />,
  back: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />,
  food: <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A3 3 0 0118 8.25v3.75a3 3 0 01-3 3H9a3 3 0 01-3-3V8.25a3 3 0 012.638-3.036M15 3a3 3 0 00-3-3H9a3 3 0 00-3 3v.163A3 3 0 019 5.25h6a3 3 0 013-2.25V3zM12 9a.75.75 0 00-.75.75v3c0 .414.336.75.75.75s.75-.336.75-.75v-3A.75.75 0 0012 9z" />,
  transport: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5h9.75m4.5 0-3-3m0 0-3 3m3-3v9" />,
  bills: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
  shopping: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />,
  health: <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0 1.32-.53 2.52-1.38 3.38l-7.92 7.92c-.75.75-1.77 1.18-2.82 1.18s-2.07-.43-2.82-1.18l-7.92-7.92A4.5 4.5 0 013.75 5.5c1.18 0 2.27.47 3.07 1.28L8.25 8.25l1.43-1.47A4.5 4.5 0 0113.5 5.5c1.18 0 2.27.47 3.07 1.28L18 8.25l1.43-1.47A4.5 4.5 0 0121 8.25z" />,
  salary: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.77 11 12 11c-.77 0-1.536.21-2.121.536-.586.324-.879.879-.879 1.464z" />,
  gift: <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 19.5v-8.25M12 4.875A3.375 3.375 0 006.375 8.25h11.25A3.375 3.375 0 0012 4.875zM21 11.25H3" />,
  home: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />,
  car: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25v2.25m3.375-2.25v2.25m3.375-2.25v2.25M3 13.5h18M3.75 13.5v6.75A2.25 2.25 0 006 22.5h12a2.25 2.25 0 002.25-2.25v-6.75M3.75 13.5L3 12m0 0l.75-1.5M3 12h18m0 0l.75 1.5m-.75-1.5L21 12m-9 6.75h.008v.008H12v-.008z" />,
  briefcase: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.25L21 12V7.5A2.25 2.25 0 0018.75 5.25h-4.5A2.25 2.25 0 0012 7.5v4.5m-3.75 2.25L3 12V7.5A2.25 2.25 0 015.25 5.25h4.5A2.25 2.25 0 0112 7.5v4.5m-3.75 2.25h-3a2.25 2.25 0 00-2.25 2.25v2.25a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25V16.5a2.25 2.25 0 00-2.25-2.25zm12 0h-3a2.25 2.25 0 00-2.25 2.25v2.25a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25V16.5a2.25 2.25 0 00-2.25-2.25z" />,
  plus: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />,
  sort: <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />,
  recurring: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.695v4.992h-4.992m0 0l-3.181-3.183a8.25 8.25 0 0111.667 0l3.181 3.183" />,
  'arrow-trending-up': <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.94.394m3.94-.394l.394-3.94" />,
  'arrow-trending-down': <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 015.814 5.519l2.74 1.22m0 0l-3.94-.394m3.94.394l.394 3.94" />,
  wallet: <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />,
  tiktok: <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h4v10a4 4 0 11-4-4V8zM3 8h4v9a5 5 0 0010 0V8h4" />,
};

const Icon: React.FC<IconProps> = ({ name, className, title }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5}
    stroke="currentColor" 
    className={className || 'w-6 h-6'}
    aria-hidden={!title}
    role={title ? 'img' : 'presentation'}
  >
    {title && <title>{title}</title>}
    {ICONS[name]}
  </svg>
);

export default Icon;