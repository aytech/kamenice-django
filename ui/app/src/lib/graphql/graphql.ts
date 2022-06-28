import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Decimal: any;
  GenericScalar: any;
  Time: any;
};

export type ConfirmationInput = {
  note?: InputMaybe<Scalars['String']>;
  reservationId?: InputMaybe<Scalars['ID']>;
};

export type Contact = {
  __typename?: 'Contact';
  message: Scalars['String'];
};

export type ContactInput = {
  message?: InputMaybe<Scalars['String']>;
};

export type CreateContactMessage = {
  __typename?: 'CreateContactMessage';
  contact?: Maybe<Contact>;
};

export type CreateDiscount = {
  __typename?: 'CreateDiscount';
  discount?: Maybe<DiscountSuite>;
};

export type CreateGuest = {
  __typename?: 'CreateGuest';
  guest?: Maybe<Guest>;
};

export type CreateReservation = {
  __typename?: 'CreateReservation';
  reservation?: Maybe<Reservation>;
};

export type CreateReservationGuest = {
  __typename?: 'CreateReservationGuest';
  guest?: Maybe<Guest>;
};

export type CreateSuite = {
  __typename?: 'CreateSuite';
  suite?: Maybe<Suite>;
};

export type DeleteDiscount = {
  __typename?: 'DeleteDiscount';
  discount?: Maybe<DiscountSuite>;
};

export type DeleteDriveFile = {
  __typename?: 'DeleteDriveFile';
  file?: Maybe<RemovedDriveFile>;
};

export type DeleteGuest = {
  __typename?: 'DeleteGuest';
  guest?: Maybe<Guest>;
};

export type DeleteReservation = {
  __typename?: 'DeleteReservation';
  reservation?: Maybe<Reservation>;
};

export type DeleteReservationGuest = {
  __typename?: 'DeleteReservationGuest';
  guest?: Maybe<Guest>;
};

export type DeleteSuite = {
  __typename?: 'DeleteSuite';
  suite?: Maybe<Suite>;
};

export type DiscountInputUpdate = {
  id?: InputMaybe<Scalars['ID']>;
  suiteId?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['Int']>;
};

export type DiscountSuite = {
  __typename?: 'DiscountSuite';
  id: Scalars['ID'];
  suite: Suite;
  type: DiscountSuiteType;
  value: Scalars['Int'];
};

export type DiscountSuiteInput = {
  suiteId?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['Int']>;
};

export type DiscountSuiteOption = {
  __typename?: 'DiscountSuiteOption';
  name: Scalars['String'];
  value: Scalars['String'];
};

/** An enumeration. */
export enum DiscountSuiteType {
  /** Dítě 3-12 let */
  ChildDiscount = 'CHILD_DISCOUNT',
  /** Přistýlka */
  ExtraBedDiscount = 'EXTRA_BED_DISCOUNT',
  /** Pátá a další osoba */
  FifthMoreBed = 'FIFTH_MORE_BED',
  /** Dítě do 3 let */
  InfantDiscount = 'INFANT_DISCOUNT',
  /** Třetí a čtvrtá osoba */
  ThirdFourthBed = 'THIRD_FOURTH_BED',
  /** Tři a více nocí */
  ThreeNightsDiscount = 'THREE_NIGHTS_DISCOUNT'
}

export type DragReservation = {
  __typename?: 'DragReservation';
  reservation?: Maybe<Reservation>;
};

export type DriveFile = {
  __typename?: 'DriveFile';
  created: Scalars['DateTime'];
  driveId: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  pathDocx?: Maybe<Scalars['String']>;
  pathPdf?: Maybe<Scalars['String']>;
};

export type Guest = {
  __typename?: 'Guest';
  addressMunicipality?: Maybe<Scalars['String']>;
  addressPsc?: Maybe<Scalars['Int']>;
  addressStreet?: Maybe<Scalars['String']>;
  age?: Maybe<GuestAge>;
  citizenship?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  gender?: Maybe<GuestGender>;
  id: Scalars['ID'];
  identity?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  phoneNumber?: Maybe<Scalars['String']>;
  surname: Scalars['String'];
  visaNumber?: Maybe<Scalars['String']>;
};

/** An enumeration. */
export enum GuestAge {
  /** Dospělý */
  Adult = 'ADULT',
  /** Dítě 3-12 let */
  Child = 'CHILD',
  /** Dítě do 3 let */
  Infant = 'INFANT',
  /** 12+ let */
  Young = 'YOUNG'
}

/** An enumeration. */
export enum GuestGender {
  /** Female */
  F = 'F',
  /** Male */
  M = 'M'
}

export type GuestInput = {
  addressMunicipality?: InputMaybe<Scalars['String']>;
  addressPsc?: InputMaybe<Scalars['Int']>;
  addressStreet?: InputMaybe<Scalars['String']>;
  age?: InputMaybe<Scalars['String']>;
  citizenship?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  identity?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  surname?: InputMaybe<Scalars['String']>;
  visaNumber?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createContactMessage?: Maybe<CreateContactMessage>;
  createDiscount?: Maybe<CreateDiscount>;
  createGuest?: Maybe<CreateGuest>;
  createReservation?: Maybe<CreateReservation>;
  createReservationGuest?: Maybe<CreateReservationGuest>;
  createSuite?: Maybe<CreateSuite>;
  deleteDiscount?: Maybe<DeleteDiscount>;
  deleteDriveFile?: Maybe<DeleteDriveFile>;
  deleteGuest?: Maybe<DeleteGuest>;
  deleteReservation?: Maybe<DeleteReservation>;
  deleteReservationGuest?: Maybe<DeleteReservationGuest>;
  deleteSuite?: Maybe<DeleteSuite>;
  dragReservation?: Maybe<DragReservation>;
  refreshToken?: Maybe<Refresh>;
  revokeToken?: Maybe<Revoke>;
  sendConfirmation?: Maybe<SendConfirmationEmail>;
  tokenAuth?: Maybe<ObtainJsonWebToken>;
  updateDiscount?: Maybe<UpdateDiscount>;
  updateGuest?: Maybe<UpdateGuest>;
  updateReservation?: Maybe<UpdateReservation>;
  updateReservationGuest?: Maybe<UpdateReservationGuest>;
  updateSettings?: Maybe<UpdateSettings>;
  updateSuite?: Maybe<UpdateSuite>;
  verifyToken?: Maybe<Verify>;
};


export type MutationCreateContactMessageArgs = {
  data: ContactInput;
};


export type MutationCreateDiscountArgs = {
  data: DiscountSuiteInput;
};


export type MutationCreateGuestArgs = {
  data: GuestInput;
};


export type MutationCreateReservationArgs = {
  data: ReservationInput;
};


export type MutationCreateReservationGuestArgs = {
  data: ReservationGuestInput;
};


export type MutationCreateSuiteArgs = {
  data: SuiteInput;
};


export type MutationDeleteDiscountArgs = {
  discountId?: InputMaybe<Scalars['ID']>;
};


export type MutationDeleteDriveFileArgs = {
  fileId?: InputMaybe<Scalars['String']>;
};


export type MutationDeleteGuestArgs = {
  guestId?: InputMaybe<Scalars['ID']>;
};


export type MutationDeleteReservationArgs = {
  reservationId?: InputMaybe<Scalars['ID']>;
};


export type MutationDeleteReservationGuestArgs = {
  data: ReservationGuestInput;
};


export type MutationDeleteSuiteArgs = {
  suiteId?: InputMaybe<Scalars['ID']>;
};


export type MutationDragReservationArgs = {
  data: ReservationDragInput;
};


export type MutationRefreshTokenArgs = {
  refreshToken?: InputMaybe<Scalars['String']>;
};


export type MutationRevokeTokenArgs = {
  refreshToken?: InputMaybe<Scalars['String']>;
};


export type MutationSendConfirmationArgs = {
  data: ConfirmationInput;
};


export type MutationTokenAuthArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationUpdateDiscountArgs = {
  data: DiscountInputUpdate;
};


export type MutationUpdateGuestArgs = {
  data: GuestInput;
};


export type MutationUpdateReservationArgs = {
  data: ReservationInput;
};


export type MutationUpdateReservationGuestArgs = {
  data: ReservationGuestInput;
};


export type MutationUpdateSettingsArgs = {
  data: SettingsInput;
};


export type MutationUpdateSuiteArgs = {
  data: SuiteInput;
};


export type MutationVerifyTokenArgs = {
  token?: InputMaybe<Scalars['String']>;
};

export type ObtainJsonWebToken = {
  __typename?: 'ObtainJSONWebToken';
  payload: Scalars['GenericScalar'];
  refreshExpiresIn: Scalars['Int'];
  refreshToken: Scalars['String'];
  settings?: Maybe<Settings>;
  token: Scalars['String'];
};

export type Price = {
  __typename?: 'Price';
  accommodation: Scalars['Decimal'];
  meal: Scalars['Decimal'];
  municipality: Scalars['Decimal'];
  reservation: Reservation;
  suite: Suite;
  total: Scalars['Decimal'];
};

export type PriceInput = {
  guests: Array<InputMaybe<Scalars['Int']>>;
  meal?: InputMaybe<Scalars['String']>;
  numberDays: Scalars['Int'];
  suiteId?: InputMaybe<Scalars['Int']>;
};

export type PriceOutput = {
  __typename?: 'PriceOutput';
  accommodation: Scalars['String'];
  days: Scalars['Int'];
  meal: Scalars['String'];
  municipality: Scalars['String'];
  total: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  discountSuiteTypes?: Maybe<Array<Maybe<DiscountSuiteOption>>>;
  discountsSuite?: Maybe<Array<Maybe<DiscountSuite>>>;
  guest?: Maybe<Guest>;
  guests?: Maybe<Array<Maybe<Guest>>>;
  guestsReport?: Maybe<Report>;
  guestsReportFiles?: Maybe<Array<Maybe<DriveFile>>>;
  price?: Maybe<PriceOutput>;
  reservation?: Maybe<Reservation>;
  reservationGuests?: Maybe<ReservationGuests>;
  reservationMeals?: Maybe<Array<Maybe<ReservationTypeOption>>>;
  reservationTypes?: Maybe<Array<Maybe<ReservationTypeOption>>>;
  reservations?: Maybe<Array<Maybe<Reservation>>>;
  roommate?: Maybe<Roommate>;
  settings?: Maybe<Settings>;
  suite?: Maybe<Suite>;
  suiteReservations?: Maybe<Array<Maybe<Reservation>>>;
  suites?: Maybe<Array<Maybe<Suite>>>;
};


export type QueryDiscountsSuiteArgs = {
  suiteId?: InputMaybe<Scalars['Int']>;
};


export type QueryGuestArgs = {
  guestId?: InputMaybe<Scalars['Int']>;
};


export type QueryGuestsReportArgs = {
  foreigners?: InputMaybe<Scalars['Boolean']>;
  fromDate: Scalars['String'];
  toDate: Scalars['String'];
};


export type QueryPriceArgs = {
  data?: InputMaybe<PriceInput>;
};


export type QueryReservationArgs = {
  reservationId?: InputMaybe<Scalars['Int']>;
};


export type QueryReservationGuestsArgs = {
  reservationHash?: InputMaybe<Scalars['String']>;
};


export type QueryReservationsArgs = {
  endDate?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<Scalars['String']>;
};


export type QueryRoommateArgs = {
  roommateId?: InputMaybe<Scalars['Int']>;
};


export type QuerySuiteArgs = {
  suiteId?: InputMaybe<Scalars['Int']>;
};


export type QuerySuiteReservationsArgs = {
  suiteId?: InputMaybe<Scalars['Int']>;
};

export type Refresh = {
  __typename?: 'Refresh';
  payload: Scalars['GenericScalar'];
  refreshExpiresIn: Scalars['Int'];
  refreshToken: Scalars['String'];
  token: Scalars['String'];
};

export type RemovedDriveFile = {
  __typename?: 'RemovedDriveFile';
  name?: Maybe<Scalars['String']>;
};

export type Report = {
  __typename?: 'Report';
  message?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Boolean']>;
};

export type Reservation = {
  __typename?: 'Reservation';
  expired?: Maybe<Scalars['DateTime']>;
  extraSuites: Array<Suite>;
  fromDate: Scalars['DateTime'];
  guest: Guest;
  id: Scalars['ID'];
  meal: ReservationMeal;
  notes?: Maybe<Scalars['String']>;
  payingGuest?: Maybe<Guest>;
  priceSet: Array<Price>;
  purpose?: Maybe<Scalars['String']>;
  roommateSet: Array<Roommate>;
  suite: Suite;
  toDate: Scalars['DateTime'];
  type: ReservationType;
};

export type ReservationDragInput = {
  extraSuitesIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  fromDate?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  suiteId?: InputMaybe<Scalars['String']>;
  toDate?: InputMaybe<Scalars['String']>;
};

export type ReservationGuestInput = {
  addressMunicipality?: InputMaybe<Scalars['String']>;
  addressPsc?: InputMaybe<Scalars['Int']>;
  addressStreet?: InputMaybe<Scalars['String']>;
  age?: InputMaybe<Scalars['String']>;
  citizenship?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  hash?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  identity?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  surname?: InputMaybe<Scalars['String']>;
  visaNumber?: InputMaybe<Scalars['String']>;
};

export type ReservationGuests = {
  __typename?: 'ReservationGuests';
  guest?: Maybe<Guest>;
  roommates?: Maybe<Array<Maybe<Guest>>>;
  suite?: Maybe<Suite>;
};

export type ReservationInput = {
  expired?: InputMaybe<Scalars['String']>;
  extraSuitesIds?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  fromDate?: InputMaybe<Scalars['String']>;
  guestId?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['ID']>;
  meal?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['String']>;
  numberDays?: InputMaybe<Scalars['Int']>;
  payingGuestId?: InputMaybe<Scalars['Int']>;
  price?: InputMaybe<ReservationPrice>;
  purpose?: InputMaybe<Scalars['String']>;
  roommates?: InputMaybe<Array<InputMaybe<ReservationRoommate>>>;
  suiteId?: InputMaybe<Scalars['String']>;
  toDate?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

/** An enumeration. */
export enum ReservationMeal {
  /** Jen Snídaně */
  Breakfast = 'BREAKFAST',
  /** Polopenze */
  Halfboard = 'HALFBOARD',
  /** Bez Stravy */
  Nomeal = 'NOMEAL'
}

export type ReservationPrice = {
  accommodation?: InputMaybe<Scalars['String']>;
  meal?: InputMaybe<Scalars['String']>;
  municipality?: InputMaybe<Scalars['String']>;
  suiteId?: InputMaybe<Scalars['String']>;
  total?: InputMaybe<Scalars['String']>;
};

export type ReservationRoommate = {
  fromDate?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  toDate?: InputMaybe<Scalars['String']>;
};

/** An enumeration. */
export enum ReservationType {
  /** Aktuálně ubytování */
  Accommodated = 'ACCOMMODATED',
  /** Závazná rezervace */
  Binding = 'BINDING',
  /** Obydlený termín */
  Inhabited = 'INHABITED',
  /** Poptávka */
  Inquiry = 'INQUIRY',
  /** Nezávazná rezervace */
  Nonbinding = 'NONBINDING'
}

export type ReservationTypeOption = {
  __typename?: 'ReservationTypeOption';
  label: Scalars['String'];
  value: Scalars['String'];
};

export type Revoke = {
  __typename?: 'Revoke';
  revoked: Scalars['Int'];
};

export type Roommate = {
  __typename?: 'Roommate';
  entity: Guest;
  fromDate: Scalars['DateTime'];
  toDate: Scalars['DateTime'];
};

export type SendConfirmationEmail = {
  __typename?: 'SendConfirmationEmail';
  reservation?: Maybe<Reservation>;
};

export type Settings = {
  __typename?: 'Settings';
  defaultArrivalTime: Scalars['Time'];
  defaultDepartureTime: Scalars['Time'];
  id: Scalars['ID'];
  municipalityFee?: Maybe<Scalars['Decimal']>;
  priceBreakfast?: Maybe<Scalars['Decimal']>;
  priceBreakfastChild?: Maybe<Scalars['Decimal']>;
  priceHalfboard?: Maybe<Scalars['Decimal']>;
  priceHalfboardChild?: Maybe<Scalars['Decimal']>;
  userAvatar?: Maybe<Scalars['String']>;
  userColor?: Maybe<Scalars['String']>;
  userName?: Maybe<Scalars['String']>;
};

export type SettingsInput = {
  defaultArrivalTime?: InputMaybe<Scalars['String']>;
  defaultDepartureTime?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  municipalityFee?: InputMaybe<Scalars['String']>;
  priceBreakfast?: InputMaybe<Scalars['String']>;
  priceBreakfastChild?: InputMaybe<Scalars['String']>;
  priceHalfboard?: InputMaybe<Scalars['String']>;
  priceHalfboardChild?: InputMaybe<Scalars['String']>;
  userAvatar?: InputMaybe<Scalars['String']>;
  userColor?: InputMaybe<Scalars['String']>;
  userName?: InputMaybe<Scalars['String']>;
};

export type Suite = {
  __typename?: 'Suite';
  discountSuiteSet: Array<DiscountSuite>;
  id: Scalars['ID'];
  number?: Maybe<Scalars['Int']>;
  numberBeds: Scalars['Int'];
  numberBedsExtra: Scalars['Int'];
  priceBase: Scalars['Decimal'];
  title: Scalars['String'];
};

export type SuiteDiscountInput = {
  type: Scalars['String'];
  value: Scalars['Int'];
};

export type SuiteInput = {
  discounts?: InputMaybe<Array<InputMaybe<SuiteDiscountInput>>>;
  id?: InputMaybe<Scalars['ID']>;
  number?: InputMaybe<Scalars['Int']>;
  numberBeds?: InputMaybe<Scalars['Int']>;
  numberBedsExtra?: InputMaybe<Scalars['Int']>;
  priceBase?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateDiscount = {
  __typename?: 'UpdateDiscount';
  discount?: Maybe<DiscountSuite>;
};

export type UpdateGuest = {
  __typename?: 'UpdateGuest';
  guest?: Maybe<Guest>;
};

export type UpdateReservation = {
  __typename?: 'UpdateReservation';
  reservation?: Maybe<Reservation>;
};

export type UpdateReservationGuest = {
  __typename?: 'UpdateReservationGuest';
  guest?: Maybe<Guest>;
};

export type UpdateSettings = {
  __typename?: 'UpdateSettings';
  settings?: Maybe<Settings>;
};

export type UpdateSuite = {
  __typename?: 'UpdateSuite';
  suite?: Maybe<Suite>;
};

export type Verify = {
  __typename?: 'Verify';
  payload: Scalars['GenericScalar'];
};

export type ReservationsQueryVariables = Exact<{
  startDate: Scalars['String'];
  endDate: Scalars['String'];
}>;


export type ReservationsQuery = { __typename?: 'Query', reservations?: Array<{ __typename?: 'Reservation', expired?: any | null, fromDate: any, id: string, meal: ReservationMeal, notes?: string | null, purpose?: string | null, toDate: any, type: ReservationType, extraSuites: Array<{ __typename?: 'Suite', id: string }>, guest: { __typename?: 'Guest', email?: string | null, id: string, name: string, surname: string }, payingGuest?: { __typename?: 'Guest', id: string } | null, priceSet: Array<{ __typename?: 'Price', accommodation: any, meal: any, municipality: any, total: any, suite: { __typename?: 'Suite', id: string, priceBase: any } }>, roommateSet: Array<{ __typename?: 'Roommate', fromDate: any, entity: { __typename?: 'Guest', id: string, name: string, surname: string } }>, suite: { __typename?: 'Suite', id: string, numberBeds: number, numberBedsExtra: number, priceBase: any } } | null> | null };


export const ReservationsDocument = gql`
    query reservations($startDate: String!, $endDate: String!) {
  reservations(startDate: $startDate, endDate: $endDate) {
    expired
    extraSuites {
      id
    }
    fromDate
    guest {
      email
      id
      name
      surname
    }
    id
    meal
    notes
    payingGuest {
      id
    }
    priceSet {
      accommodation
      meal
      municipality
      suite {
        id
        priceBase
      }
      total
    }
    purpose
    roommateSet {
      entity {
        id
        name
        surname
      }
      fromDate
    }
    suite {
      id
      numberBeds
      numberBedsExtra
      priceBase
    }
    toDate
    type
  }
}
    `;

/**
 * __useReservationsQuery__
 *
 * To run a query within a React component, call `useReservationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useReservationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReservationsQuery({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useReservationsQuery(baseOptions: Apollo.QueryHookOptions<ReservationsQuery, ReservationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReservationsQuery, ReservationsQueryVariables>(ReservationsDocument, options);
      }
export function useReservationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReservationsQuery, ReservationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReservationsQuery, ReservationsQueryVariables>(ReservationsDocument, options);
        }
export type ReservationsQueryHookResult = ReturnType<typeof useReservationsQuery>;
export type ReservationsLazyQueryHookResult = ReturnType<typeof useReservationsLazyQuery>;
export type ReservationsQueryResult = Apollo.QueryResult<ReservationsQuery, ReservationsQueryVariables>;