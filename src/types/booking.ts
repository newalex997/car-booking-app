export interface LocationResult {
  location: string;
  place: string;
  city: string;
  country: string;
  countryID: number;
  cityID: number;
  placeID: number;
  placeHlt: string;
  cityHlt: string;
  countryHlt: string;
  translationKey: string;
  label: string;
}

export interface AutocompleteResponse {
  success: boolean;
  result: LocationResult[];
}

export interface CreateSearchParams {
  location: LocationResult;
  pickupDate: string; // "YYYY-MM-DD"
  pickupTime: string; // "HH:MM"
  dropoffDate: string; // "YYYY-MM-DD"
  dropoffTime: string; // "HH:MM"
  residenceCountry?: string;
}

export interface CreateSearchResponse {
  success: boolean;
  errors: unknown;
  data: {
    guid: string;
    sq: string;
    url: string;
  };
}

export interface Offer {
  hash: string;
  originalIdx: number;
  offerID: string;
  requestID: string;
  badges: Record<string, boolean>;
  price: {
    raw: number;
    formatted: string;
  };
  promo: boolean;
  isFreeCancellation: boolean;
  isClosedUserGroups: boolean;
  vehicle: {
    carName: string;
    carImg: string;
    sippGroup: string;
    specifications: {
      isAutomaticTransmission: number;
      airConditioning: number;
      bags: { number: number; label: string };
      seats: { number: number; label: string };
      doors: { number: number; label: string };
    };
    sipp: string;
    isExact: boolean;
  };
  paymentType: { label: string };
  supplier: {
    name: string;
    key: string;
    logo: string;
    pickAddress: string;
    rating: {
      score: string;
      label: string;
      countryReviewCount: number;
    };
    loc: { id: number; label: string; icon: string };
  };
  location: {
    isAirport: boolean;
    name: string;
    nearMeDistance: number | null;
  };
  mileage: {
    unlimited: boolean;
    unspecified: boolean;
    label: string;
  };
  bookUrl: string;
  isInstantConfirmation: boolean;
  depositType: {
    key: string;
    title: string;
    value: string;
  };
}

export interface SearchResultsResponse {
  success: boolean;
  errors: unknown;
  data: {
    offers: Offer[];
  };
}
