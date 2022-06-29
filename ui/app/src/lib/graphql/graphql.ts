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
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: any;
  /** The `Decimal` scalar type represents a python Decimal. */
  Decimal: any;
  /**
   * The `GenericScalar` scalar type represents a generic
   * GraphQL scalar value that could be:
   * String, Boolean, Int, Float, List or Object.
   */
  GenericScalar: any;
  /**
   * The `Time` scalar type represents a Time value as
   * specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Time: any;
};

export type AppUser = {
  __typename?: 'AppUser';
  color: Scalars['String'];
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
  username: Scalars['String'];
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

export type Options = {
  __typename?: 'Options';
  label: Scalars['String'];
  value: Scalars['String'];
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
  appUser?: Maybe<AppUser>;
  discountOptions: Array<Options>;
  discountSuiteTypes?: Maybe<Array<Maybe<DiscountSuiteOption>>>;
  discountsSuite?: Maybe<Array<Maybe<DiscountSuite>>>;
  guest?: Maybe<Guest>;
  guestDrawerOpen: Scalars['Boolean'];
  guests?: Maybe<Array<Maybe<Guest>>>;
  guestsReport?: Maybe<Report>;
  guestsReportFiles?: Maybe<Array<Maybe<DriveFile>>>;
  pageTitle: Scalars['String'];
  price?: Maybe<PriceOutput>;
  reservation?: Maybe<Reservation>;
  reservationGuests?: Maybe<ReservationGuests>;
  reservationMealOptions: Array<Options>;
  reservationMeals?: Maybe<Array<Maybe<ReservationTypeOption>>>;
  reservationModalOpen: Scalars['Boolean'];
  reservationTypeOptions: Array<Options>;
  reservationTypes?: Maybe<Array<Maybe<ReservationTypeOption>>>;
  reservations?: Maybe<Array<Maybe<Reservation>>>;
  roommate?: Maybe<Roommate>;
  selectedGuest?: Maybe<SelectedGuest>;
  selectedPage: Scalars['String'];
  selectedSuite?: Maybe<SelectedSuite>;
  settings?: Maybe<Settings>;
  suite?: Maybe<Suite>;
  suiteReservations?: Maybe<Array<Maybe<Reservation>>>;
  suites?: Maybe<Array<Maybe<Suite>>>;
  timelineGroups?: Maybe<TimelimeGroup>;
  userColor: Scalars['String'];
  userName: Scalars['String'];
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

export type SelectedGuest = {
  __typename?: 'SelectedGuest';
  addressMunicipality?: Maybe<Scalars['String']>;
  addressPsc?: Maybe<Scalars['String']>;
  addressStreet?: Maybe<Scalars['String']>;
  age?: Maybe<Scalars['String']>;
  citizenship?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  identity?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  phoneNumber?: Maybe<Scalars['String']>;
  surname: Scalars['String'];
  visaNumber?: Maybe<Scalars['String']>;
};

export type SelectedSuite = {
  __typename?: 'SelectedSuite';
  number?: Maybe<Scalars['Int']>;
  numberBeds: Scalars['Int'];
  priceBase?: Maybe<Scalars['String']>;
  priceChild?: Maybe<Scalars['String']>;
  priceExtra?: Maybe<Scalars['String']>;
  priceInfant?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
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

export type TimelimeGroup = {
  __typename?: 'TimelimeGroup';
  number: Scalars['String'];
  title: Scalars['String'];
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

export type CreateContactMessageMutationVariables = Exact<{
  data: ContactInput;
}>;


export type CreateContactMessageMutation = { __typename?: 'Mutation', createContactMessage?: { __typename?: 'CreateContactMessage', contact?: { __typename?: 'Contact', message: string } | null } | null };

export type CreateGuestMutationVariables = Exact<{
  data: GuestInput;
}>;


export type CreateGuestMutation = { __typename?: 'Mutation', createGuest?: { __typename?: 'CreateGuest', guest?: { __typename?: 'Guest', addressMunicipality?: string | null, addressPsc?: number | null, addressStreet?: string | null, age?: GuestAge | null, citizenship?: string | null, email?: string | null, gender?: GuestGender | null, identity?: string | null, id: string, name: string, phoneNumber?: string | null, surname: string, visaNumber?: string | null } | null } | null };

export type CreateReservationMutationVariables = Exact<{
  data: ReservationInput;
}>;


export type CreateReservationMutation = { __typename?: 'Mutation', createReservation?: { __typename?: 'CreateReservation', reservation?: { __typename?: 'Reservation', expired?: any | null, fromDate: any, id: string, meal: ReservationMeal, notes?: string | null, purpose?: string | null, toDate: any, type: ReservationType, extraSuites: Array<{ __typename?: 'Suite', id: string }>, guest: { __typename?: 'Guest', email?: string | null, id: string, name: string, surname: string }, payingGuest?: { __typename?: 'Guest', id: string } | null, priceSet: Array<{ __typename?: 'Price', accommodation: any, meal: any, municipality: any, total: any, suite: { __typename?: 'Suite', id: string, priceBase: any } }>, roommateSet: Array<{ __typename?: 'Roommate', fromDate: any, entity: { __typename?: 'Guest', id: string, name: string, surname: string } }>, suite: { __typename?: 'Suite', id: string, number?: number | null, title: string } } | null } | null };

export type CreateReservationGuestMutationVariables = Exact<{
  data: ReservationGuestInput;
}>;


export type CreateReservationGuestMutation = { __typename?: 'Mutation', createReservationGuest?: { __typename?: 'CreateReservationGuest', guest?: { __typename?: 'Guest', addressMunicipality?: string | null, addressPsc?: number | null, addressStreet?: string | null, age?: GuestAge | null, citizenship?: string | null, email?: string | null, gender?: GuestGender | null, identity?: string | null, id: string, name: string, phoneNumber?: string | null, surname: string, visaNumber?: string | null } | null } | null };

export type CreateSuiteMutationVariables = Exact<{
  data: SuiteInput;
}>;


export type CreateSuiteMutation = { __typename?: 'Mutation', createSuite?: { __typename?: 'CreateSuite', suite?: { __typename?: 'Suite', id: string, number?: number | null, numberBeds: number, numberBedsExtra: number, priceBase: any, title: string, discountSuiteSet: Array<{ __typename?: 'DiscountSuite', type: DiscountSuiteType, value: number }> } | null } | null };

export type DeleteGuestMutationVariables = Exact<{
  guestId: Scalars['ID'];
}>;


export type DeleteGuestMutation = { __typename?: 'Mutation', deleteGuest?: { __typename?: 'DeleteGuest', guest?: { __typename?: 'Guest', id: string, name: string, surname: string } | null } | null };

export type DeleteReservationMutationVariables = Exact<{
  reservationId: Scalars['ID'];
}>;


export type DeleteReservationMutation = { __typename?: 'Mutation', deleteReservation?: { __typename?: 'DeleteReservation', reservation?: { __typename?: 'Reservation', id: string } | null } | null };

export type DeleteReservationGuestMutationVariables = Exact<{
  data: ReservationGuestInput;
}>;


export type DeleteReservationGuestMutation = { __typename?: 'Mutation', deleteReservationGuest?: { __typename?: 'DeleteReservationGuest', guest?: { __typename?: 'Guest', name: string, surname: string } | null } | null };

export type DeleteStatementMutationVariables = Exact<{
  fileId: Scalars['String'];
}>;


export type DeleteStatementMutation = { __typename?: 'Mutation', deleteDriveFile?: { __typename?: 'DeleteDriveFile', file?: { __typename?: 'RemovedDriveFile', name?: string | null } | null } | null };

export type DeleteSuiteMutationVariables = Exact<{
  suiteId: Scalars['ID'];
}>;


export type DeleteSuiteMutation = { __typename?: 'Mutation', deleteSuite?: { __typename?: 'DeleteSuite', suite?: { __typename?: 'Suite', id: string } | null } | null };

export type DragReservationMutationVariables = Exact<{
  data: ReservationDragInput;
}>;


export type DragReservationMutation = { __typename?: 'Mutation', dragReservation?: { __typename?: 'DragReservation', reservation?: { __typename?: 'Reservation', fromDate: any, id: string, toDate: any, suite: { __typename?: 'Suite', id: string, number?: number | null, title: string } } | null } | null };

export type RefreshTokenMutationVariables = Exact<{
  refreshToken: Scalars['String'];
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken?: { __typename?: 'Refresh', payload: any, refreshExpiresIn: number, refreshToken: string, token: string } | null };

export type RevokeTokenMutationVariables = Exact<{
  refreshToken: Scalars['String'];
}>;


export type RevokeTokenMutation = { __typename?: 'Mutation', revokeToken?: { __typename?: 'Revoke', revoked: number } | null };

export type SendConfirmationMutationVariables = Exact<{
  data: ConfirmationInput;
}>;


export type SendConfirmationMutation = { __typename?: 'Mutation', sendConfirmation?: { __typename?: 'SendConfirmationEmail', reservation?: { __typename?: 'Reservation', id: string, guest: { __typename?: 'Guest', email?: string | null } } | null } | null };

export type TokenAuthMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type TokenAuthMutation = { __typename?: 'Mutation', tokenAuth?: { __typename?: 'ObtainJSONWebToken', payload: any, refreshExpiresIn: number, refreshToken: string, token: string, settings?: { __typename?: 'Settings', defaultArrivalTime: any, defaultDepartureTime: any, id: string, municipalityFee?: any | null, priceBreakfast?: any | null, priceBreakfastChild?: any | null, priceHalfboard?: any | null, priceHalfboardChild?: any | null, userAvatar?: string | null, userColor?: string | null, userName?: string | null } | null } | null };

export type UpdateGuestMutationVariables = Exact<{
  data: GuestInput;
}>;


export type UpdateGuestMutation = { __typename?: 'Mutation', updateGuest?: { __typename?: 'UpdateGuest', guest?: { __typename?: 'Guest', addressMunicipality?: string | null, addressPsc?: number | null, addressStreet?: string | null, age?: GuestAge | null, citizenship?: string | null, email?: string | null, gender?: GuestGender | null, identity?: string | null, id: string, name: string, phoneNumber?: string | null, surname: string, visaNumber?: string | null } | null } | null };

export type UpdateReservationMutationVariables = Exact<{
  data: ReservationInput;
}>;


export type UpdateReservationMutation = { __typename?: 'Mutation', updateReservation?: { __typename?: 'UpdateReservation', reservation?: { __typename?: 'Reservation', expired?: any | null, fromDate: any, id: string, meal: ReservationMeal, notes?: string | null, purpose?: string | null, toDate: any, type: ReservationType, extraSuites: Array<{ __typename?: 'Suite', id: string }>, guest: { __typename?: 'Guest', email?: string | null, id: string, name: string, surname: string }, payingGuest?: { __typename?: 'Guest', id: string } | null, priceSet: Array<{ __typename?: 'Price', accommodation: any, meal: any, municipality: any, total: any, suite: { __typename?: 'Suite', id: string, priceBase: any } }>, roommateSet: Array<{ __typename?: 'Roommate', fromDate: any, entity: { __typename?: 'Guest', id: string, name: string, surname: string } }>, suite: { __typename?: 'Suite', id: string, number?: number | null, title: string } } | null } | null };

export type UpdateReservationGuestMutationVariables = Exact<{
  data: ReservationGuestInput;
}>;


export type UpdateReservationGuestMutation = { __typename?: 'Mutation', updateReservationGuest?: { __typename?: 'UpdateReservationGuest', guest?: { __typename?: 'Guest', addressMunicipality?: string | null, addressPsc?: number | null, addressStreet?: string | null, age?: GuestAge | null, citizenship?: string | null, email?: string | null, gender?: GuestGender | null, identity?: string | null, id: string, name: string, phoneNumber?: string | null, surname: string, visaNumber?: string | null } | null } | null };

export type UpdateSettingsMutationVariables = Exact<{
  data: SettingsInput;
}>;


export type UpdateSettingsMutation = { __typename?: 'Mutation', updateSettings?: { __typename?: 'UpdateSettings', settings?: { __typename?: 'Settings', defaultArrivalTime: any, defaultDepartureTime: any, id: string, municipalityFee?: any | null, priceBreakfastChild?: any | null, priceBreakfast?: any | null, priceHalfboard?: any | null, priceHalfboardChild?: any | null, userAvatar?: string | null, userColor?: string | null, userName?: string | null } | null } | null };

export type UpdateSuiteMutationVariables = Exact<{
  data: SuiteInput;
}>;


export type UpdateSuiteMutation = { __typename?: 'Mutation', updateSuite?: { __typename?: 'UpdateSuite', suite?: { __typename?: 'Suite', id: string, number?: number | null, numberBeds: number, numberBedsExtra: number, priceBase: any, title: string, discountSuiteSet: Array<{ __typename?: 'DiscountSuite', type: DiscountSuiteType, value: number }> } | null } | null };

export type AppQueryVariables = Exact<{ [key: string]: never; }>;


export type AppQuery = { __typename?: 'Query', guestDrawerOpen: boolean, pageTitle: string, reservationModalOpen: boolean, selectedPage: string, userColor: string, userName: string, appUser?: { __typename?: 'AppUser', color: string, id: number, name?: string | null, surname?: string | null, username: string } | null, discountOptions: Array<{ __typename?: 'Options', label: string, value: string }>, selectedSuite?: { __typename?: 'SelectedSuite', number?: number | null, numberBeds: number, priceBase?: string | null, priceChild?: string | null, priceExtra?: string | null, priceInfant?: string | null, title?: string | null } | null };

export type CalculateReservationPriceQueryVariables = Exact<{
  data: PriceInput;
}>;


export type CalculateReservationPriceQuery = { __typename?: 'Query', price?: { __typename?: 'PriceOutput', accommodation: string, meal: string, municipality: string, total: string } | null };

export type GenerateStatementQueryVariables = Exact<{
  fromDate: Scalars['String'];
  toDate: Scalars['String'];
  foreigners?: InputMaybe<Scalars['Boolean']>;
}>;


export type GenerateStatementQuery = { __typename?: 'Query', guestsReport?: { __typename?: 'Report', message?: string | null, status?: boolean | null } | null };

export type GuestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GuestsQuery = { __typename?: 'Query', guests?: Array<{ __typename?: 'Guest', age?: GuestAge | null, addressMunicipality?: string | null, addressPsc?: number | null, addressStreet?: string | null, citizenship?: string | null, color?: string | null, email?: string | null, gender?: GuestGender | null, identity?: string | null, id: string, name: string, phoneNumber?: string | null, surname: string, visaNumber?: string | null } | null> | null };

export type ReservationGuestsQueryVariables = Exact<{
  reservationHash: Scalars['String'];
}>;


export type ReservationGuestsQuery = { __typename?: 'Query', reservationGuests?: { __typename?: 'ReservationGuests', guest?: { __typename?: 'Guest', addressMunicipality?: string | null, addressPsc?: number | null, addressStreet?: string | null, age?: GuestAge | null, citizenship?: string | null, color?: string | null, email?: string | null, gender?: GuestGender | null, identity?: string | null, id: string, name: string, phoneNumber?: string | null, surname: string, visaNumber?: string | null } | null, roommates?: Array<{ __typename?: 'Guest', addressMunicipality?: string | null, addressPsc?: number | null, addressStreet?: string | null, age?: GuestAge | null, citizenship?: string | null, color?: string | null, email?: string | null, gender?: GuestGender | null, identity?: string | null, id: string, name: string, phoneNumber?: string | null, surname: string, visaNumber?: string | null } | null> | null, suite?: { __typename?: 'Suite', numberBeds: number } | null } | null, selectedGuest?: { __typename?: 'SelectedGuest', addressMunicipality?: string | null, addressPsc?: string | null, addressStreet?: string | null, age?: string | null, citizenship?: string | null, color?: string | null, email?: string | null, gender?: string | null, identity?: string | null, id?: number | null, name: string, phoneNumber?: string | null, surname: string, visaNumber?: string | null } | null, selectedSuite?: { __typename?: 'SelectedSuite', numberBeds: number } | null };

export type ReservationsQueryVariables = Exact<{
  startDate: Scalars['String'];
  endDate: Scalars['String'];
}>;


export type ReservationsQuery = { __typename?: 'Query', reservations?: Array<{ __typename?: 'Reservation', expired?: any | null, fromDate: any, id: string, meal: ReservationMeal, notes?: string | null, purpose?: string | null, toDate: any, type: ReservationType, extraSuites: Array<{ __typename?: 'Suite', id: string }>, guest: { __typename?: 'Guest', email?: string | null, id: string, name: string, surname: string }, payingGuest?: { __typename?: 'Guest', id: string } | null, priceSet: Array<{ __typename?: 'Price', accommodation: any, meal: any, municipality: any, total: any, suite: { __typename?: 'Suite', id: string, priceBase: any } }>, roommateSet: Array<{ __typename?: 'Roommate', fromDate: any, entity: { __typename?: 'Guest', id: string, name: string, surname: string } }>, suite: { __typename?: 'Suite', id: string, numberBeds: number, numberBedsExtra: number, priceBase: any } } | null> | null };

export type ReservationsMetaQueryVariables = Exact<{ [key: string]: never; }>;


export type ReservationsMetaQuery = { __typename?: 'Query', guests?: Array<{ __typename?: 'Guest', id: string, name: string, surname: string } | null> | null, suites?: Array<{ __typename?: 'Suite', id: string, number?: number | null, numberBeds: number, numberBedsExtra: number, priceBase: any, title: string, discountSuiteSet: Array<{ __typename?: 'DiscountSuite', type: DiscountSuiteType, value: number }> } | null> | null, reservationMeals?: Array<{ __typename?: 'ReservationTypeOption', label: string, value: string } | null> | null, reservationTypes?: Array<{ __typename?: 'ReservationTypeOption', label: string, value: string } | null> | null };

export type SettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type SettingsQuery = { __typename?: 'Query', settings?: { __typename?: 'Settings', defaultArrivalTime: any, defaultDepartureTime: any, id: string, municipalityFee?: any | null, priceBreakfast?: any | null, priceBreakfastChild?: any | null, priceHalfboard?: any | null, priceHalfboardChild?: any | null, userAvatar?: string | null, userColor?: string | null, userName?: string | null } | null };

export type StatementsQueryVariables = Exact<{ [key: string]: never; }>;


export type StatementsQuery = { __typename?: 'Query', guestsReportFiles?: Array<{ __typename?: 'DriveFile', created: any, driveId: string, id: string, name: string, pathDocx?: string | null, pathPdf?: string | null } | null> | null };

export type SuitesQueryVariables = Exact<{ [key: string]: never; }>;


export type SuitesQuery = { __typename?: 'Query', suites?: Array<{ __typename?: 'Suite', id: string, number?: number | null, numberBeds: number, numberBedsExtra: number, priceBase: any, title: string, discountSuiteSet: Array<{ __typename?: 'DiscountSuite', type: DiscountSuiteType, value: number }> } | null> | null, discountSuiteTypes?: Array<{ __typename?: 'DiscountSuiteOption', name: string, value: string } | null> | null };


export const CreateContactMessageDocument = gql`
    mutation createContactMessage($data: ContactInput!) {
  createContactMessage(data: $data) {
    contact {
      message
    }
  }
}
    `;
export type CreateContactMessageMutationFn = Apollo.MutationFunction<CreateContactMessageMutation, CreateContactMessageMutationVariables>;

/**
 * __useCreateContactMessageMutation__
 *
 * To run a mutation, you first call `useCreateContactMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateContactMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createContactMessageMutation, { data, loading, error }] = useCreateContactMessageMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateContactMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateContactMessageMutation, CreateContactMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateContactMessageMutation, CreateContactMessageMutationVariables>(CreateContactMessageDocument, options);
      }
export type CreateContactMessageMutationHookResult = ReturnType<typeof useCreateContactMessageMutation>;
export type CreateContactMessageMutationResult = Apollo.MutationResult<CreateContactMessageMutation>;
export type CreateContactMessageMutationOptions = Apollo.BaseMutationOptions<CreateContactMessageMutation, CreateContactMessageMutationVariables>;
export const CreateGuestDocument = gql`
    mutation createGuest($data: GuestInput!) {
  createGuest(data: $data) {
    guest {
      addressMunicipality
      addressPsc
      addressStreet
      age
      citizenship
      email
      gender
      identity
      id
      name
      phoneNumber
      surname
      visaNumber
    }
  }
}
    `;
export type CreateGuestMutationFn = Apollo.MutationFunction<CreateGuestMutation, CreateGuestMutationVariables>;

/**
 * __useCreateGuestMutation__
 *
 * To run a mutation, you first call `useCreateGuestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGuestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGuestMutation, { data, loading, error }] = useCreateGuestMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateGuestMutation(baseOptions?: Apollo.MutationHookOptions<CreateGuestMutation, CreateGuestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGuestMutation, CreateGuestMutationVariables>(CreateGuestDocument, options);
      }
export type CreateGuestMutationHookResult = ReturnType<typeof useCreateGuestMutation>;
export type CreateGuestMutationResult = Apollo.MutationResult<CreateGuestMutation>;
export type CreateGuestMutationOptions = Apollo.BaseMutationOptions<CreateGuestMutation, CreateGuestMutationVariables>;
export const CreateReservationDocument = gql`
    mutation createReservation($data: ReservationInput!) {
  createReservation(data: $data) {
    reservation {
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
        number
        title
      }
      toDate
      type
    }
  }
}
    `;
export type CreateReservationMutationFn = Apollo.MutationFunction<CreateReservationMutation, CreateReservationMutationVariables>;

/**
 * __useCreateReservationMutation__
 *
 * To run a mutation, you first call `useCreateReservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReservationMutation, { data, loading, error }] = useCreateReservationMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateReservationMutation(baseOptions?: Apollo.MutationHookOptions<CreateReservationMutation, CreateReservationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateReservationMutation, CreateReservationMutationVariables>(CreateReservationDocument, options);
      }
export type CreateReservationMutationHookResult = ReturnType<typeof useCreateReservationMutation>;
export type CreateReservationMutationResult = Apollo.MutationResult<CreateReservationMutation>;
export type CreateReservationMutationOptions = Apollo.BaseMutationOptions<CreateReservationMutation, CreateReservationMutationVariables>;
export const CreateReservationGuestDocument = gql`
    mutation createReservationGuest($data: ReservationGuestInput!) {
  createReservationGuest(data: $data) {
    guest {
      addressMunicipality
      addressPsc
      addressStreet
      age
      citizenship
      email
      gender
      identity
      id
      name
      phoneNumber
      surname
      visaNumber
    }
  }
}
    `;
export type CreateReservationGuestMutationFn = Apollo.MutationFunction<CreateReservationGuestMutation, CreateReservationGuestMutationVariables>;

/**
 * __useCreateReservationGuestMutation__
 *
 * To run a mutation, you first call `useCreateReservationGuestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReservationGuestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReservationGuestMutation, { data, loading, error }] = useCreateReservationGuestMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateReservationGuestMutation(baseOptions?: Apollo.MutationHookOptions<CreateReservationGuestMutation, CreateReservationGuestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateReservationGuestMutation, CreateReservationGuestMutationVariables>(CreateReservationGuestDocument, options);
      }
export type CreateReservationGuestMutationHookResult = ReturnType<typeof useCreateReservationGuestMutation>;
export type CreateReservationGuestMutationResult = Apollo.MutationResult<CreateReservationGuestMutation>;
export type CreateReservationGuestMutationOptions = Apollo.BaseMutationOptions<CreateReservationGuestMutation, CreateReservationGuestMutationVariables>;
export const CreateSuiteDocument = gql`
    mutation createSuite($data: SuiteInput!) {
  createSuite(data: $data) {
    suite {
      discountSuiteSet {
        type
        value
      }
      id
      number
      numberBeds
      numberBedsExtra
      priceBase
      title
    }
  }
}
    `;
export type CreateSuiteMutationFn = Apollo.MutationFunction<CreateSuiteMutation, CreateSuiteMutationVariables>;

/**
 * __useCreateSuiteMutation__
 *
 * To run a mutation, you first call `useCreateSuiteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSuiteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSuiteMutation, { data, loading, error }] = useCreateSuiteMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateSuiteMutation(baseOptions?: Apollo.MutationHookOptions<CreateSuiteMutation, CreateSuiteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSuiteMutation, CreateSuiteMutationVariables>(CreateSuiteDocument, options);
      }
export type CreateSuiteMutationHookResult = ReturnType<typeof useCreateSuiteMutation>;
export type CreateSuiteMutationResult = Apollo.MutationResult<CreateSuiteMutation>;
export type CreateSuiteMutationOptions = Apollo.BaseMutationOptions<CreateSuiteMutation, CreateSuiteMutationVariables>;
export const DeleteGuestDocument = gql`
    mutation deleteGuest($guestId: ID!) {
  deleteGuest(guestId: $guestId) {
    guest {
      id
      name
      surname
    }
  }
}
    `;
export type DeleteGuestMutationFn = Apollo.MutationFunction<DeleteGuestMutation, DeleteGuestMutationVariables>;

/**
 * __useDeleteGuestMutation__
 *
 * To run a mutation, you first call `useDeleteGuestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteGuestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteGuestMutation, { data, loading, error }] = useDeleteGuestMutation({
 *   variables: {
 *      guestId: // value for 'guestId'
 *   },
 * });
 */
export function useDeleteGuestMutation(baseOptions?: Apollo.MutationHookOptions<DeleteGuestMutation, DeleteGuestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteGuestMutation, DeleteGuestMutationVariables>(DeleteGuestDocument, options);
      }
export type DeleteGuestMutationHookResult = ReturnType<typeof useDeleteGuestMutation>;
export type DeleteGuestMutationResult = Apollo.MutationResult<DeleteGuestMutation>;
export type DeleteGuestMutationOptions = Apollo.BaseMutationOptions<DeleteGuestMutation, DeleteGuestMutationVariables>;
export const DeleteReservationDocument = gql`
    mutation deleteReservation($reservationId: ID!) {
  deleteReservation(reservationId: $reservationId) {
    reservation {
      id
    }
  }
}
    `;
export type DeleteReservationMutationFn = Apollo.MutationFunction<DeleteReservationMutation, DeleteReservationMutationVariables>;

/**
 * __useDeleteReservationMutation__
 *
 * To run a mutation, you first call `useDeleteReservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReservationMutation, { data, loading, error }] = useDeleteReservationMutation({
 *   variables: {
 *      reservationId: // value for 'reservationId'
 *   },
 * });
 */
export function useDeleteReservationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteReservationMutation, DeleteReservationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteReservationMutation, DeleteReservationMutationVariables>(DeleteReservationDocument, options);
      }
export type DeleteReservationMutationHookResult = ReturnType<typeof useDeleteReservationMutation>;
export type DeleteReservationMutationResult = Apollo.MutationResult<DeleteReservationMutation>;
export type DeleteReservationMutationOptions = Apollo.BaseMutationOptions<DeleteReservationMutation, DeleteReservationMutationVariables>;
export const DeleteReservationGuestDocument = gql`
    mutation deleteReservationGuest($data: ReservationGuestInput!) {
  deleteReservationGuest(data: $data) {
    guest {
      name
      surname
    }
  }
}
    `;
export type DeleteReservationGuestMutationFn = Apollo.MutationFunction<DeleteReservationGuestMutation, DeleteReservationGuestMutationVariables>;

/**
 * __useDeleteReservationGuestMutation__
 *
 * To run a mutation, you first call `useDeleteReservationGuestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReservationGuestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReservationGuestMutation, { data, loading, error }] = useDeleteReservationGuestMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDeleteReservationGuestMutation(baseOptions?: Apollo.MutationHookOptions<DeleteReservationGuestMutation, DeleteReservationGuestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteReservationGuestMutation, DeleteReservationGuestMutationVariables>(DeleteReservationGuestDocument, options);
      }
export type DeleteReservationGuestMutationHookResult = ReturnType<typeof useDeleteReservationGuestMutation>;
export type DeleteReservationGuestMutationResult = Apollo.MutationResult<DeleteReservationGuestMutation>;
export type DeleteReservationGuestMutationOptions = Apollo.BaseMutationOptions<DeleteReservationGuestMutation, DeleteReservationGuestMutationVariables>;
export const DeleteStatementDocument = gql`
    mutation deleteStatement($fileId: String!) {
  deleteDriveFile(fileId: $fileId) {
    file {
      name
    }
  }
}
    `;
export type DeleteStatementMutationFn = Apollo.MutationFunction<DeleteStatementMutation, DeleteStatementMutationVariables>;

/**
 * __useDeleteStatementMutation__
 *
 * To run a mutation, you first call `useDeleteStatementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteStatementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteStatementMutation, { data, loading, error }] = useDeleteStatementMutation({
 *   variables: {
 *      fileId: // value for 'fileId'
 *   },
 * });
 */
export function useDeleteStatementMutation(baseOptions?: Apollo.MutationHookOptions<DeleteStatementMutation, DeleteStatementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteStatementMutation, DeleteStatementMutationVariables>(DeleteStatementDocument, options);
      }
export type DeleteStatementMutationHookResult = ReturnType<typeof useDeleteStatementMutation>;
export type DeleteStatementMutationResult = Apollo.MutationResult<DeleteStatementMutation>;
export type DeleteStatementMutationOptions = Apollo.BaseMutationOptions<DeleteStatementMutation, DeleteStatementMutationVariables>;
export const DeleteSuiteDocument = gql`
    mutation deleteSuite($suiteId: ID!) {
  deleteSuite(suiteId: $suiteId) {
    suite {
      id
    }
  }
}
    `;
export type DeleteSuiteMutationFn = Apollo.MutationFunction<DeleteSuiteMutation, DeleteSuiteMutationVariables>;

/**
 * __useDeleteSuiteMutation__
 *
 * To run a mutation, you first call `useDeleteSuiteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSuiteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSuiteMutation, { data, loading, error }] = useDeleteSuiteMutation({
 *   variables: {
 *      suiteId: // value for 'suiteId'
 *   },
 * });
 */
export function useDeleteSuiteMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSuiteMutation, DeleteSuiteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSuiteMutation, DeleteSuiteMutationVariables>(DeleteSuiteDocument, options);
      }
export type DeleteSuiteMutationHookResult = ReturnType<typeof useDeleteSuiteMutation>;
export type DeleteSuiteMutationResult = Apollo.MutationResult<DeleteSuiteMutation>;
export type DeleteSuiteMutationOptions = Apollo.BaseMutationOptions<DeleteSuiteMutation, DeleteSuiteMutationVariables>;
export const DragReservationDocument = gql`
    mutation dragReservation($data: ReservationDragInput!) {
  dragReservation(data: $data) {
    reservation {
      fromDate
      id
      suite {
        id
        number
        title
      }
      toDate
    }
  }
}
    `;
export type DragReservationMutationFn = Apollo.MutationFunction<DragReservationMutation, DragReservationMutationVariables>;

/**
 * __useDragReservationMutation__
 *
 * To run a mutation, you first call `useDragReservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDragReservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dragReservationMutation, { data, loading, error }] = useDragReservationMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDragReservationMutation(baseOptions?: Apollo.MutationHookOptions<DragReservationMutation, DragReservationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DragReservationMutation, DragReservationMutationVariables>(DragReservationDocument, options);
      }
export type DragReservationMutationHookResult = ReturnType<typeof useDragReservationMutation>;
export type DragReservationMutationResult = Apollo.MutationResult<DragReservationMutation>;
export type DragReservationMutationOptions = Apollo.BaseMutationOptions<DragReservationMutation, DragReservationMutationVariables>;
export const RefreshTokenDocument = gql`
    mutation refreshToken($refreshToken: String!) {
  refreshToken(refreshToken: $refreshToken) {
    payload
    refreshExpiresIn
    refreshToken
    token
  }
}
    `;
export type RefreshTokenMutationFn = Apollo.MutationFunction<RefreshTokenMutation, RefreshTokenMutationVariables>;

/**
 * __useRefreshTokenMutation__
 *
 * To run a mutation, you first call `useRefreshTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshTokenMutation, { data, loading, error }] = useRefreshTokenMutation({
 *   variables: {
 *      refreshToken: // value for 'refreshToken'
 *   },
 * });
 */
export function useRefreshTokenMutation(baseOptions?: Apollo.MutationHookOptions<RefreshTokenMutation, RefreshTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(RefreshTokenDocument, options);
      }
export type RefreshTokenMutationHookResult = ReturnType<typeof useRefreshTokenMutation>;
export type RefreshTokenMutationResult = Apollo.MutationResult<RefreshTokenMutation>;
export type RefreshTokenMutationOptions = Apollo.BaseMutationOptions<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const RevokeTokenDocument = gql`
    mutation revokeToken($refreshToken: String!) {
  revokeToken(refreshToken: $refreshToken) {
    revoked
  }
}
    `;
export type RevokeTokenMutationFn = Apollo.MutationFunction<RevokeTokenMutation, RevokeTokenMutationVariables>;

/**
 * __useRevokeTokenMutation__
 *
 * To run a mutation, you first call `useRevokeTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRevokeTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [revokeTokenMutation, { data, loading, error }] = useRevokeTokenMutation({
 *   variables: {
 *      refreshToken: // value for 'refreshToken'
 *   },
 * });
 */
export function useRevokeTokenMutation(baseOptions?: Apollo.MutationHookOptions<RevokeTokenMutation, RevokeTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RevokeTokenMutation, RevokeTokenMutationVariables>(RevokeTokenDocument, options);
      }
export type RevokeTokenMutationHookResult = ReturnType<typeof useRevokeTokenMutation>;
export type RevokeTokenMutationResult = Apollo.MutationResult<RevokeTokenMutation>;
export type RevokeTokenMutationOptions = Apollo.BaseMutationOptions<RevokeTokenMutation, RevokeTokenMutationVariables>;
export const SendConfirmationDocument = gql`
    mutation sendConfirmation($data: ConfirmationInput!) {
  sendConfirmation(data: $data) {
    reservation {
      guest {
        email
      }
      id
    }
  }
}
    `;
export type SendConfirmationMutationFn = Apollo.MutationFunction<SendConfirmationMutation, SendConfirmationMutationVariables>;

/**
 * __useSendConfirmationMutation__
 *
 * To run a mutation, you first call `useSendConfirmationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendConfirmationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendConfirmationMutation, { data, loading, error }] = useSendConfirmationMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSendConfirmationMutation(baseOptions?: Apollo.MutationHookOptions<SendConfirmationMutation, SendConfirmationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendConfirmationMutation, SendConfirmationMutationVariables>(SendConfirmationDocument, options);
      }
export type SendConfirmationMutationHookResult = ReturnType<typeof useSendConfirmationMutation>;
export type SendConfirmationMutationResult = Apollo.MutationResult<SendConfirmationMutation>;
export type SendConfirmationMutationOptions = Apollo.BaseMutationOptions<SendConfirmationMutation, SendConfirmationMutationVariables>;
export const TokenAuthDocument = gql`
    mutation tokenAuth($username: String!, $password: String!) {
  tokenAuth(username: $username, password: $password) {
    payload
    refreshExpiresIn
    refreshToken
    token
    settings {
      defaultArrivalTime
      defaultDepartureTime
      id
      municipalityFee
      priceBreakfast
      priceBreakfastChild
      priceHalfboard
      priceHalfboardChild
      userAvatar
      userColor
      userName
    }
  }
}
    `;
export type TokenAuthMutationFn = Apollo.MutationFunction<TokenAuthMutation, TokenAuthMutationVariables>;

/**
 * __useTokenAuthMutation__
 *
 * To run a mutation, you first call `useTokenAuthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTokenAuthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [tokenAuthMutation, { data, loading, error }] = useTokenAuthMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useTokenAuthMutation(baseOptions?: Apollo.MutationHookOptions<TokenAuthMutation, TokenAuthMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TokenAuthMutation, TokenAuthMutationVariables>(TokenAuthDocument, options);
      }
export type TokenAuthMutationHookResult = ReturnType<typeof useTokenAuthMutation>;
export type TokenAuthMutationResult = Apollo.MutationResult<TokenAuthMutation>;
export type TokenAuthMutationOptions = Apollo.BaseMutationOptions<TokenAuthMutation, TokenAuthMutationVariables>;
export const UpdateGuestDocument = gql`
    mutation updateGuest($data: GuestInput!) {
  updateGuest(data: $data) {
    guest {
      addressMunicipality
      addressPsc
      addressStreet
      age
      citizenship
      email
      gender
      identity
      id
      name
      phoneNumber
      surname
      visaNumber
    }
  }
}
    `;
export type UpdateGuestMutationFn = Apollo.MutationFunction<UpdateGuestMutation, UpdateGuestMutationVariables>;

/**
 * __useUpdateGuestMutation__
 *
 * To run a mutation, you first call `useUpdateGuestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGuestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGuestMutation, { data, loading, error }] = useUpdateGuestMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateGuestMutation(baseOptions?: Apollo.MutationHookOptions<UpdateGuestMutation, UpdateGuestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateGuestMutation, UpdateGuestMutationVariables>(UpdateGuestDocument, options);
      }
export type UpdateGuestMutationHookResult = ReturnType<typeof useUpdateGuestMutation>;
export type UpdateGuestMutationResult = Apollo.MutationResult<UpdateGuestMutation>;
export type UpdateGuestMutationOptions = Apollo.BaseMutationOptions<UpdateGuestMutation, UpdateGuestMutationVariables>;
export const UpdateReservationDocument = gql`
    mutation updateReservation($data: ReservationInput!) {
  updateReservation(data: $data) {
    reservation {
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
        number
        title
      }
      toDate
      type
    }
  }
}
    `;
export type UpdateReservationMutationFn = Apollo.MutationFunction<UpdateReservationMutation, UpdateReservationMutationVariables>;

/**
 * __useUpdateReservationMutation__
 *
 * To run a mutation, you first call `useUpdateReservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReservationMutation, { data, loading, error }] = useUpdateReservationMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateReservationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateReservationMutation, UpdateReservationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateReservationMutation, UpdateReservationMutationVariables>(UpdateReservationDocument, options);
      }
export type UpdateReservationMutationHookResult = ReturnType<typeof useUpdateReservationMutation>;
export type UpdateReservationMutationResult = Apollo.MutationResult<UpdateReservationMutation>;
export type UpdateReservationMutationOptions = Apollo.BaseMutationOptions<UpdateReservationMutation, UpdateReservationMutationVariables>;
export const UpdateReservationGuestDocument = gql`
    mutation updateReservationGuest($data: ReservationGuestInput!) {
  updateReservationGuest(data: $data) {
    guest {
      addressMunicipality
      addressPsc
      addressStreet
      age
      citizenship
      email
      gender
      identity
      id
      name
      phoneNumber
      surname
      visaNumber
    }
  }
}
    `;
export type UpdateReservationGuestMutationFn = Apollo.MutationFunction<UpdateReservationGuestMutation, UpdateReservationGuestMutationVariables>;

/**
 * __useUpdateReservationGuestMutation__
 *
 * To run a mutation, you first call `useUpdateReservationGuestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReservationGuestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReservationGuestMutation, { data, loading, error }] = useUpdateReservationGuestMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateReservationGuestMutation(baseOptions?: Apollo.MutationHookOptions<UpdateReservationGuestMutation, UpdateReservationGuestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateReservationGuestMutation, UpdateReservationGuestMutationVariables>(UpdateReservationGuestDocument, options);
      }
export type UpdateReservationGuestMutationHookResult = ReturnType<typeof useUpdateReservationGuestMutation>;
export type UpdateReservationGuestMutationResult = Apollo.MutationResult<UpdateReservationGuestMutation>;
export type UpdateReservationGuestMutationOptions = Apollo.BaseMutationOptions<UpdateReservationGuestMutation, UpdateReservationGuestMutationVariables>;
export const UpdateSettingsDocument = gql`
    mutation updateSettings($data: SettingsInput!) {
  updateSettings(data: $data) {
    settings {
      defaultArrivalTime
      defaultDepartureTime
      id
      municipalityFee
      priceBreakfastChild
      priceBreakfast
      priceHalfboard
      priceHalfboardChild
      userAvatar
      userColor
      userName
    }
  }
}
    `;
export type UpdateSettingsMutationFn = Apollo.MutationFunction<UpdateSettingsMutation, UpdateSettingsMutationVariables>;

/**
 * __useUpdateSettingsMutation__
 *
 * To run a mutation, you first call `useUpdateSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSettingsMutation, { data, loading, error }] = useUpdateSettingsMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateSettingsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSettingsMutation, UpdateSettingsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSettingsMutation, UpdateSettingsMutationVariables>(UpdateSettingsDocument, options);
      }
export type UpdateSettingsMutationHookResult = ReturnType<typeof useUpdateSettingsMutation>;
export type UpdateSettingsMutationResult = Apollo.MutationResult<UpdateSettingsMutation>;
export type UpdateSettingsMutationOptions = Apollo.BaseMutationOptions<UpdateSettingsMutation, UpdateSettingsMutationVariables>;
export const UpdateSuiteDocument = gql`
    mutation updateSuite($data: SuiteInput!) {
  updateSuite(data: $data) {
    suite {
      discountSuiteSet {
        type
        value
      }
      id
      number
      numberBeds
      numberBedsExtra
      priceBase
      title
    }
  }
}
    `;
export type UpdateSuiteMutationFn = Apollo.MutationFunction<UpdateSuiteMutation, UpdateSuiteMutationVariables>;

/**
 * __useUpdateSuiteMutation__
 *
 * To run a mutation, you first call `useUpdateSuiteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSuiteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSuiteMutation, { data, loading, error }] = useUpdateSuiteMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateSuiteMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSuiteMutation, UpdateSuiteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSuiteMutation, UpdateSuiteMutationVariables>(UpdateSuiteDocument, options);
      }
export type UpdateSuiteMutationHookResult = ReturnType<typeof useUpdateSuiteMutation>;
export type UpdateSuiteMutationResult = Apollo.MutationResult<UpdateSuiteMutation>;
export type UpdateSuiteMutationOptions = Apollo.BaseMutationOptions<UpdateSuiteMutation, UpdateSuiteMutationVariables>;
export const AppDocument = gql`
    query App {
  appUser @client {
    color
    id
    name
    surname
    username
  }
  discountOptions @client {
    label
    value
  }
  guestDrawerOpen @client
  pageTitle @client
  reservationModalOpen @client
  selectedPage @client
  selectedSuite @client {
    number
    numberBeds
    priceBase
    priceChild
    priceExtra
    priceInfant
    title
  }
  userColor @client
  userName @client
}
    `;

/**
 * __useAppQuery__
 *
 * To run a query within a React component, call `useAppQuery` and pass it any options that fit your needs.
 * When your component renders, `useAppQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAppQuery({
 *   variables: {
 *   },
 * });
 */
export function useAppQuery(baseOptions?: Apollo.QueryHookOptions<AppQuery, AppQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AppQuery, AppQueryVariables>(AppDocument, options);
      }
export function useAppLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AppQuery, AppQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AppQuery, AppQueryVariables>(AppDocument, options);
        }
export type AppQueryHookResult = ReturnType<typeof useAppQuery>;
export type AppLazyQueryHookResult = ReturnType<typeof useAppLazyQuery>;
export type AppQueryResult = Apollo.QueryResult<AppQuery, AppQueryVariables>;
export const CalculateReservationPriceDocument = gql`
    query calculateReservationPrice($data: PriceInput!) {
  price(data: $data) {
    accommodation
    meal
    municipality
    total
  }
}
    `;

/**
 * __useCalculateReservationPriceQuery__
 *
 * To run a query within a React component, call `useCalculateReservationPriceQuery` and pass it any options that fit your needs.
 * When your component renders, `useCalculateReservationPriceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCalculateReservationPriceQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCalculateReservationPriceQuery(baseOptions: Apollo.QueryHookOptions<CalculateReservationPriceQuery, CalculateReservationPriceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CalculateReservationPriceQuery, CalculateReservationPriceQueryVariables>(CalculateReservationPriceDocument, options);
      }
export function useCalculateReservationPriceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CalculateReservationPriceQuery, CalculateReservationPriceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CalculateReservationPriceQuery, CalculateReservationPriceQueryVariables>(CalculateReservationPriceDocument, options);
        }
export type CalculateReservationPriceQueryHookResult = ReturnType<typeof useCalculateReservationPriceQuery>;
export type CalculateReservationPriceLazyQueryHookResult = ReturnType<typeof useCalculateReservationPriceLazyQuery>;
export type CalculateReservationPriceQueryResult = Apollo.QueryResult<CalculateReservationPriceQuery, CalculateReservationPriceQueryVariables>;
export const GenerateStatementDocument = gql`
    query generateStatement($fromDate: String!, $toDate: String!, $foreigners: Boolean) {
  guestsReport(fromDate: $fromDate, toDate: $toDate, foreigners: $foreigners) {
    message
    status
  }
}
    `;

/**
 * __useGenerateStatementQuery__
 *
 * To run a query within a React component, call `useGenerateStatementQuery` and pass it any options that fit your needs.
 * When your component renders, `useGenerateStatementQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGenerateStatementQuery({
 *   variables: {
 *      fromDate: // value for 'fromDate'
 *      toDate: // value for 'toDate'
 *      foreigners: // value for 'foreigners'
 *   },
 * });
 */
export function useGenerateStatementQuery(baseOptions: Apollo.QueryHookOptions<GenerateStatementQuery, GenerateStatementQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GenerateStatementQuery, GenerateStatementQueryVariables>(GenerateStatementDocument, options);
      }
export function useGenerateStatementLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GenerateStatementQuery, GenerateStatementQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GenerateStatementQuery, GenerateStatementQueryVariables>(GenerateStatementDocument, options);
        }
export type GenerateStatementQueryHookResult = ReturnType<typeof useGenerateStatementQuery>;
export type GenerateStatementLazyQueryHookResult = ReturnType<typeof useGenerateStatementLazyQuery>;
export type GenerateStatementQueryResult = Apollo.QueryResult<GenerateStatementQuery, GenerateStatementQueryVariables>;
export const GuestsDocument = gql`
    query guests {
  guests {
    age
    addressMunicipality
    addressPsc
    addressStreet
    citizenship
    color
    email
    gender
    identity
    id
    name
    phoneNumber
    surname
    visaNumber
  }
}
    `;

/**
 * __useGuestsQuery__
 *
 * To run a query within a React component, call `useGuestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGuestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGuestsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGuestsQuery(baseOptions?: Apollo.QueryHookOptions<GuestsQuery, GuestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GuestsQuery, GuestsQueryVariables>(GuestsDocument, options);
      }
export function useGuestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GuestsQuery, GuestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GuestsQuery, GuestsQueryVariables>(GuestsDocument, options);
        }
export type GuestsQueryHookResult = ReturnType<typeof useGuestsQuery>;
export type GuestsLazyQueryHookResult = ReturnType<typeof useGuestsLazyQuery>;
export type GuestsQueryResult = Apollo.QueryResult<GuestsQuery, GuestsQueryVariables>;
export const ReservationGuestsDocument = gql`
    query reservationGuests($reservationHash: String!) {
  reservationGuests(reservationHash: $reservationHash) {
    guest {
      addressMunicipality
      addressPsc
      addressStreet
      age
      citizenship
      color
      email
      gender
      identity
      id
      name
      phoneNumber
      surname
      visaNumber
    }
    roommates {
      addressMunicipality
      addressPsc
      addressStreet
      age
      citizenship
      color
      email
      gender
      identity
      id
      name
      phoneNumber
      surname
      visaNumber
    }
    suite {
      numberBeds
    }
  }
  selectedGuest @client {
    addressMunicipality
    addressPsc
    addressStreet
    age
    citizenship
    color
    email
    gender
    identity
    id
    name
    phoneNumber
    surname
    visaNumber
  }
  selectedSuite @client {
    numberBeds
  }
}
    `;

/**
 * __useReservationGuestsQuery__
 *
 * To run a query within a React component, call `useReservationGuestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useReservationGuestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReservationGuestsQuery({
 *   variables: {
 *      reservationHash: // value for 'reservationHash'
 *   },
 * });
 */
export function useReservationGuestsQuery(baseOptions: Apollo.QueryHookOptions<ReservationGuestsQuery, ReservationGuestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReservationGuestsQuery, ReservationGuestsQueryVariables>(ReservationGuestsDocument, options);
      }
export function useReservationGuestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReservationGuestsQuery, ReservationGuestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReservationGuestsQuery, ReservationGuestsQueryVariables>(ReservationGuestsDocument, options);
        }
export type ReservationGuestsQueryHookResult = ReturnType<typeof useReservationGuestsQuery>;
export type ReservationGuestsLazyQueryHookResult = ReturnType<typeof useReservationGuestsLazyQuery>;
export type ReservationGuestsQueryResult = Apollo.QueryResult<ReservationGuestsQuery, ReservationGuestsQueryVariables>;
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
export const ReservationsMetaDocument = gql`
    query reservationsMeta {
  guests {
    id
    name
    surname
  }
  suites {
    discountSuiteSet {
      type
      value
    }
    id
    number
    numberBeds
    numberBedsExtra
    priceBase
    title
  }
  reservationMeals {
    label
    value
  }
  reservationTypes {
    label
    value
  }
}
    `;

/**
 * __useReservationsMetaQuery__
 *
 * To run a query within a React component, call `useReservationsMetaQuery` and pass it any options that fit your needs.
 * When your component renders, `useReservationsMetaQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReservationsMetaQuery({
 *   variables: {
 *   },
 * });
 */
export function useReservationsMetaQuery(baseOptions?: Apollo.QueryHookOptions<ReservationsMetaQuery, ReservationsMetaQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReservationsMetaQuery, ReservationsMetaQueryVariables>(ReservationsMetaDocument, options);
      }
export function useReservationsMetaLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReservationsMetaQuery, ReservationsMetaQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReservationsMetaQuery, ReservationsMetaQueryVariables>(ReservationsMetaDocument, options);
        }
export type ReservationsMetaQueryHookResult = ReturnType<typeof useReservationsMetaQuery>;
export type ReservationsMetaLazyQueryHookResult = ReturnType<typeof useReservationsMetaLazyQuery>;
export type ReservationsMetaQueryResult = Apollo.QueryResult<ReservationsMetaQuery, ReservationsMetaQueryVariables>;
export const SettingsDocument = gql`
    query settings {
  settings {
    defaultArrivalTime
    defaultDepartureTime
    id
    municipalityFee
    priceBreakfast
    priceBreakfastChild
    priceHalfboard
    priceHalfboardChild
    userAvatar
    userColor
    userName
  }
}
    `;

/**
 * __useSettingsQuery__
 *
 * To run a query within a React component, call `useSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSettingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useSettingsQuery(baseOptions?: Apollo.QueryHookOptions<SettingsQuery, SettingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SettingsQuery, SettingsQueryVariables>(SettingsDocument, options);
      }
export function useSettingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SettingsQuery, SettingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SettingsQuery, SettingsQueryVariables>(SettingsDocument, options);
        }
export type SettingsQueryHookResult = ReturnType<typeof useSettingsQuery>;
export type SettingsLazyQueryHookResult = ReturnType<typeof useSettingsLazyQuery>;
export type SettingsQueryResult = Apollo.QueryResult<SettingsQuery, SettingsQueryVariables>;
export const StatementsDocument = gql`
    query statements {
  guestsReportFiles {
    created
    driveId
    id
    name
    pathDocx
    pathPdf
  }
}
    `;

/**
 * __useStatementsQuery__
 *
 * To run a query within a React component, call `useStatementsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStatementsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStatementsQuery({
 *   variables: {
 *   },
 * });
 */
export function useStatementsQuery(baseOptions?: Apollo.QueryHookOptions<StatementsQuery, StatementsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StatementsQuery, StatementsQueryVariables>(StatementsDocument, options);
      }
export function useStatementsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StatementsQuery, StatementsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StatementsQuery, StatementsQueryVariables>(StatementsDocument, options);
        }
export type StatementsQueryHookResult = ReturnType<typeof useStatementsQuery>;
export type StatementsLazyQueryHookResult = ReturnType<typeof useStatementsLazyQuery>;
export type StatementsQueryResult = Apollo.QueryResult<StatementsQuery, StatementsQueryVariables>;
export const SuitesDocument = gql`
    query suites {
  suites {
    discountSuiteSet {
      type
      value
    }
    id
    number
    numberBeds
    numberBedsExtra
    priceBase
    title
  }
  discountSuiteTypes {
    name
    value
  }
}
    `;

/**
 * __useSuitesQuery__
 *
 * To run a query within a React component, call `useSuitesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSuitesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSuitesQuery({
 *   variables: {
 *   },
 * });
 */
export function useSuitesQuery(baseOptions?: Apollo.QueryHookOptions<SuitesQuery, SuitesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SuitesQuery, SuitesQueryVariables>(SuitesDocument, options);
      }
export function useSuitesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SuitesQuery, SuitesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SuitesQuery, SuitesQueryVariables>(SuitesDocument, options);
        }
export type SuitesQueryHookResult = ReturnType<typeof useSuitesQuery>;
export type SuitesLazyQueryHookResult = ReturnType<typeof useSuitesLazyQuery>;
export type SuitesQueryResult = Apollo.QueryResult<SuitesQuery, SuitesQueryVariables>;