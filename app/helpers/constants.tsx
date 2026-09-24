// GENDER CODES
export const MALE_GENDER_CODE = 'MALE' as const;
export const FEMALE_GENDER_CODE = 'FEMALE' as const;
export const UNLABELED_GENDER_CODE = 'UNLABELED' as const;
export type GenderCode =
  | typeof MALE_GENDER_CODE
  | typeof FEMALE_GENDER_CODE
  | typeof UNLABELED_GENDER_CODE;

// Legacy IDs used by box creation flows
export const MALE_GENDER_ID = 1;
export const FEMALE_GENDER_ID = 2;
export const UNLABELED_GENDER_ID = 3;

// BOX AGE IDS
export const TWO_TO_FOUR_YEARS_ID = 1;
export const FIVE_TO_NINE_YEARS_ID = 2;
export const TEN_TO_FOURTEEN_YEARS_ID = 3;

// TRANSACTION STATUS IDS
export const PENDING_STATUS_ID = 1;
export const COMPLETED_STATUS_ID = 2;
export const DECLINED_STATUS_ID = 3;

// TRANSACTION STATUS Codes
export const PENDING_STATUS_CODE = 'PENDING';
export const COMPLETED_STATUS_CODE = 'COMPLETED';
export const DECLINED_STATUS_CODE = 'DECLINED';

// ROLE TYPES IDS
export const ADMIN_ROLE_TYPE_ID = 1;
export const EDIT_TRANSACTION__PERMISSION = 'EDIT_TRANSACTION_DETAILS' as const;

// BOX AGE MAP
export const BOX_AGE_MAP: { [key: number]: string } = {
  [TWO_TO_FOUR_YEARS_ID]: '2-4',
  [FIVE_TO_NINE_YEARS_ID]: '5-9',
  [TEN_TO_FOURTEEN_YEARS_ID]: '10-14',
};

// Socket events
export const SOCKET_EVENT_NEW_TRANSACTION = 'transaction:new';
export const SOCKET_EVENT_TRANSACTION_UPDATED = 'transaction:updated';
export const SOCKET_EVENT_NEW_BOX_COUNT = 'boxCount:new';
