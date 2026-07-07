'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DatePickerSelect from '@/app/components/DatePickerSelect/page';

type OperatingCarrier = {
  code?: string;
  name?: string;
  text?: string[];
}
type FlightSegmentInfo = {
  departure?: {
    airportCode?: string;
  };
  arrival?: {
    airportCode?: string;
  };
  arrivalDateTime?: string;
  departureDateTime?:string;
  flightDuration?: string | number;
  secureFlight?:boolean;
  operatingCarrier?:OperatingCarrier
  priceClass?: {
    fareClassType?: string;
    cabinType?: {
      cabinTypeName?: string;
      cabinTypeCode?: string;
    }[];
  }[];
  bookingCode?: string;
  fareBasisCode?: string;
};

type OriginDestinationInfo = {
  flightSegmentInfo?: FlightSegmentInfo[];
};

type Itinerary = {
  originDestinationInfo?: OriginDestinationInfo[];
};

type Review = {
  id: string;
  itinerary?: Itinerary[];
};

type GetReviewResponse = {
  id: string;
};

type ReviewResponse = {
  response: string | Review;
};
type PassengerDetails = {
  paxType: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  programId: string[];
  membershipId: string[];
  specialAssistance: string;
  mealPref: string;
  servicesInfo: any[];
  paxWiseFareInfo: any[];
  billingDetails: Record<string, unknown>;
  customerDetails: Record<string, unknown>;
  inBoundFareInfo: Record<string, unknown>;
  outBoundFareInfo: Record<string, unknown>;
  referenceId: string;
  documentType: string;
  documentNumber: string;
};
type BillingDetails = {
  paymentInfo: {
    paymentMode: string;
    card: {
      code: string;
      number: string;
      expiryMonth: string;
      expiryYear: string;
      securityId: string;
      cardHolderName: string;
      startMonth: string;
      startYear: string;
    }[];
  }[];
  addressGroup: {
    streetName: string;
    houseNo: string;
    city: string;
    postalCode: string;
    countryCode: string;
    province: string;
  }[];
}

type CustomerDetails = {
  emailAddress: string[];
  contactInfo: {
    type: string;
    number: string;
    areaCode?: string;
    countryCode?: string;
    disableNotification?: boolean;
  }[];
}

const extractTime = (dateTimeString?: string): string => {
  if (!dateTimeString) return 'Unknown Time';

  try {
    const timePart = dateTimeString.split('T')[1];
    return timePart?.slice(0, 5) ?? 'Unknown Time';
  } catch {
    return 'Unknown Time';
  }
};

const extractDate = (dateTimeString?: string): string => {
  if (!dateTimeString) return 'Unknown Date';

  try {
    return dateTimeString.split('T')[0];
  } catch {
    return 'Unknown Date';
  }
};

const formatDuration = (
  duration?: string | number
): string => {
  const totalMinutes = Number(duration ?? 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};

// Aeroplan Programs Data
const AEROPLAN_PROGRAMS_NDC_AC = [
  { code: 'AC', name: 'Air Canada' },
  { code: 'A3', name: 'Aegean Airlines' },
  { code: 'CA', name: 'Air China' },
  { code: 'AI', name: 'Air India' },
  { code: 'NZ', name: 'Air New Zealand' },
  { code: 'NH', name: 'ANA Mileage Club' },
  { code: 'OZ', name: 'Asiana Airlines' },
  { code: 'OS', name: 'Australian Airlines - Miles and More' },
  { code: 'AV', name: 'Avianca Airlines' },
  { code: 'AD', name: 'Azul Airlines - TudoAzul' },
  { code: 'SN', name: 'Brussels Airlines' },
  { code: 'CX', name: 'Cathay Pacific' },
  { code: 'CM', name: 'Copa Airlines - ConnectMiles' },
  { code: 'OU', name: 'Croatia Airlines' },
  { code: 'MS', name: 'Egypt Plus' },
  { code: 'EY', name: 'Etihad Airways' },
  { code: 'BR', name: 'EVA Air' },
  { code: 'ET', name: 'Ethiopian Airlines' },
  { code: 'G3', name: 'GOL Linhas Aéreas' },
  { code: 'HO', name: 'Juneyao Airlines' },
  { code: 'LO', name: 'LOT Polish Airlines' },
  { code: 'LH', name: 'Lufthansa Miles' },
  { code: 'OA', name: 'Olympic Air - Miles+Bonus' },
  { code: 'LX', name: 'SWISS - Miles & More' },
  { code: 'SK', name: 'Scandinavian Airlines' },
  { code: 'ZH', name: 'Shenzhen Airlines' },
  { code: 'SQ', name: 'Singapore Airlines' },
  { code: 'SA', name: 'South African Airlines' },
  { code: 'TP', name: 'TAP Air Portugal' },
  { code: 'TG', name: 'Thai Airways' },
  { code: 'TK', name: 'Turkish Airlines' },
  { code: 'UA', name: 'United Airlines' },
  { code: 'VA', name: 'Virgin Australia - Velocity' },
  { code: 'UK', name: 'Vistara - Club Vistara' },
];

const AEROPLAN_PROGRAMS_OTHER = [
  { code: 'EI', name: 'Aerlingsus Travel Award' },
  { code: 'AR', name: 'Aerolineas Argentinas' },
  { code: 'AM', name: 'AeroMexico Club' },
  { code: 'VV', name: 'Aerosvit Meridian' },
  { code: 'AC', name: 'Air Canada Airline' },
  { code: 'WS', name: 'WestJet Rewards' },
  { code: 'AF', name: 'Air France Frequence' },
  { code: 'AI', name: 'Air India Flight Returns' },
  { code: 'JM', name: 'Air Jamaica Heaven' },
  { code: 'MK', name: 'Air Mauritius' },
  { code: 'NZ', name: 'Air New Zealand Points' },
  { code: 'FJ', name: 'Air Pacific Tabua' },
  { code: 'FL', name: 'AirTran Plus Rewards' },
  { code: 'AS', name: 'Alaska Airlines Mileage' },
  { code: 'AZ', name: 'Alitalia Club' },
  { code: 'NH', name: 'All Nippon Airways' },
  { code: 'AQ', name: 'Aloha Airways' },
  { code: 'HP', name: 'America West Flight Fund' },
  { code: 'AA', name: 'American Airlines AAdvantage' },
  { code: 'OZ', name: 'Asiana Club' },
  { code: 'TZ', name: 'ATA Travel Award' },
  { code: 'OS', name: 'Austrian Airlines Miles' },
  { code: 'AV', name: 'Avianca Plus' },
  { code: 'BD', name: 'BMI Diamond Club' },
  { code: 'BA', name: 'British Airways Executive' },
  { code: 'CX', name: 'Cathay Pacific Airways' },
  { code: 'CI', name: 'China Airlines Dynasty' },
  { code: 'MU', name: 'China Eastern Airlines' },
  { code: 'CO', name: 'Continental OnePass' },
  { code: 'DL', name: 'Delta Airlines Sky' },
  { code: 'LY', name: 'EL AL Israel Airlines' },
  { code: 'BR', name: 'EVA Evergreen Club' },
  { code: 'AY', name: 'Finnair Plus' },
  { code: 'F9', name: 'Frontier Early Returns' },
  { code: 'GF', name: 'Gulfair Frequent Flyer' },
  { code: 'HA', name: 'Hawaiian Airlines' },
  { code: 'IB', name: 'Iberia Plus' },
  { code: 'FI', name: 'Iceland Air Customer' },
  { code: 'DH', name: 'Independence Air Club' },
  { code: 'JL', name: 'Japan Airlines JAL Mileage' },
  { code: '9W', name: 'Jet Airways Privilege' },
  { code: 'B6', name: 'JetBlue TrueBlue' },
  { code: 'IT', name: 'Kingfisher Club' },
  { code: 'KL', name: 'KLM Flying Chairman' },
  { code: 'KE', name: 'Korean Airlines' },
  { code: 'LA', name: 'LAN LanPass' },
  { code: 'LO', name: 'LOT Miles' },
  { code: 'LT', name: 'LTU Red Points' },
  { code: 'LH', name: 'Lufthansa Miles More' },
  { code: 'MH', name: 'Malaysia Airlines' },
  { code: 'MX', name: 'Mexicana Frequenta' },
  { code: 'YX', name: 'Midwest Airlines' },
  { code: 'NW', name: 'North West Airlines' },
  { code: 'OA', name: 'Olympic Airways Icarus' },
  { code: 'PR', name: 'Philippine Airlines' },
  { code: 'QF', name: 'Qantas Frequent Flyer' },
  { code: 'AT', name: 'Royal Air Maroc Safari Flyer' },
  { code: 'BU', name: 'SAS EuroBonus' },
  { code: 'SQ', name: 'Singapore Airlines Kris Flyer' },
  { code: 'SA', name: 'South African Airways Voyager' },
  { code: 'WN', name: 'Southwest Airlines Rapid Rewards' },
  { code: 'LX', name: 'SWISS Travel Club' },
  { code: 'TP', name: 'TAP Air Portugal Navigator' },
  { code: 'TG', name: 'Thai Royal Orchid' },
  { code: 'TK', name: 'Turkish Airlines Miles' },
  { code: 'UA', name: 'United Airlines Mileage' },
  { code: 'US', name: 'US Airways Dividend' },
  { code: 'VS', name: 'Virgin Atlantic Flying' },
];

const ReviewPage = () => {
  const params = useParams();

  const reviewId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [token, setToken] = useState<string | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentType, setPaymentType] = useState("credit-card");
  const [aeroplanPrograms, setAeroplanPrograms] = useState(AEROPLAN_PROGRAMS_OTHER);
  const [selectedAeroplan, setSelectedAeroplan] = useState("");
  const [passengerDetails,setPassengerDetails] = useState<PassengerDetails[]>([
    {
    paxType:'ADT',
    title:'',
    firstName:'',
    middleName:'',
    lastName:'',
    gender:'',
    dateOfBirth:'',
    programId:[""],
    membershipId:[""],
    specialAssistance:"",
    mealPref:"",
    servicesInfo:[],
    paxWiseFareInfo:[],
    billingDetails:{},
    customerDetails:{},
    inBoundFareInfo:{},
    outBoundFareInfo:{},
    referenceId:"",
    documentType:"",
    documentNumber:"",
  }
  ]);
  const [billingDetails,setBillingDetails] = useState<BillingDetails>({
    paymentInfo: [
			{
				paymentMode: "CREDIT_CARD",
				card: [
					{
						code: "",
						number: "",
						expiryMonth: "",
						expiryYear: "",
						securityId: "",
						cardHolderName: "",
						startMonth: "",
						startYear: ""
					}
				]
			}
		],
		addressGroup: [
			{
				streetName: "",
				houseNo: "",
				city: "",
				postalCode: "",
				countryCode: "",
				province: ""
			}
		]
  })
  const [customerDetails,setCustomerDetails] = useState<CustomerDetails>({
    emailAddress: [""],
		contactInfo: [
			{
				type: "PHONE",
				number: "",
				areaCode: "",
				countryCode: "",
				disableNotification: false
			},
			{
				type: "",
				number: ""
			}
		]
  })

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const parsedToken = JSON.parse(storedToken);

      setToken(
        typeof parsedToken === 'string'
          ? parsedToken
          : storedToken
      );
    } catch {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token || !reviewId) return;

    const fetchReview = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://stgapi.a.farenexushub.com/sandbox-session/v2/getReview/${reviewId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `getReview failed: ${response.status}`
          );
        }

        const result =
          (await response.json()) as GetReviewResponse;

        if (!result.id) {
          throw new Error(
            'Review ID is missing from getReview response'
          );
        }

        const reviewResponse = await fetch(
          `https://stgapi.a.farenexushub.com/sandbox-session/v2/review/${result.id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!reviewResponse.ok) {
          throw new Error(
            `review failed: ${reviewResponse.status}`
          );
        }

        const reviewResult =
          (await reviewResponse.json()) as ReviewResponse;

        const reviewData =
          typeof reviewResult.response === 'string'
            ? (JSON.parse(reviewResult.response) as Review)
            : reviewResult.response;

        setReview(reviewData);

        // Determine which Aeroplan programs list to use based on review data
        // You can adjust this logic based on your actual review response structure
        const isNDCExchange = (reviewData as any)?.status?.gdsType === 'NDCEXCHANGE';
        const isAirlineAC = (reviewData as any)?.status?.airlineSource === 'AC';
        
        if (isNDCExchange && isAirlineAC) {
          setAeroplanPrograms(AEROPLAN_PROGRAMS_NDC_AC);
        } else {
          setAeroplanPrograms(AEROPLAN_PROGRAMS_OTHER);
        }
      } catch (error) {
        console.error(
          'Error fetching review data:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchReview();
  }, [reviewId, token]);

  const originDestinations =
    review?.itinerary?.[0]?.originDestinationInfo ?? [];

  const firstFlight =
    originDestinations[0]?.flightSegmentInfo?.[0];

  const lastOriginDestination =
    originDestinations[originDestinations.length - 1];

  const lastFlight =
    lastOriginDestination?.flightSegmentInfo?.[
      (lastOriginDestination?.flightSegmentInfo?.length ?? 1) - 1
    ];

  return (
    <div className="w-full min-h-screen">
      <h1 className="text-2xl font-bold px-4 py-4">
        Review Page
      </h1>
    {/* {JSON.stringify(originDestinations)} */}
      {loading ? (
        <div className="px-4">Loading...</div>
      ) : (
        <>
        <div className="flex flex-col lg:flex-row gap-4 px-4">
          {/* Left Section */}
          <div className="w-full lg:w-3/4">
            <div className="flex justify-between items-center p-3 bg-[#f1f1f1] border border-[#ccc]">
              <h2 className="font-semibold">
                Review Your Itinerary
              </h2>

              <span>
                {firstFlight?.departure?.airportCode ??
                  'Unknown'}
                {' '}to{' '}
                {lastFlight?.arrival?.airportCode ??
                  'Unknown'}
              </span>
            </div>

            <div className="p-4 border border-[#ccc] border-t-0 mb-4">
              {originDestinations.length > 0 ? (
                originDestinations.map(
                  (item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={
                        itemIndex !==
                        originDestinations.length - 1
                          ? 'mb-6'
                          : ''
                      }
                    >
                      {item.flightSegmentInfo?.map(
                        (flight, flightIndex) => (
                          <div
                            key={`${itemIndex}-${flightIndex}`}
                            className="mb-4"
                          >
                            <div className="flex justify-between border-b border-[#ccc] pb-2">
                              <p>
                                {flight.departure
                                  ?.airportCode ??
                                  'Unknown'}
                                {' '}to{' '}
                                {flight.arrival
                                  ?.airportCode ??
                                  'Unknown'}
                              </p>

                              <span>
                                {extractDate(
                                  flight.arrivalDateTime
                                )}
                                {' '}
                                {extractTime(
                                  flight.arrivalDateTime
                                )}
                              </span>
                            </div>

                            <div className="flex justify-between px-4 py-2 pt-1">
                              <small>
                                (
                                {flight.departure
                                  ?.airportCode ??
                                  'Unknown'}
                                )
                              </small>

                              <small>
                                (
                                {flight.arrival
                                  ?.airportCode ??
                                  'Unknown'}
                                )
                              </small>
                            </div>

                            <div className="border border-[#ccc] p-3">
                              <div className="flex justify-between items-center border-b border-[#ccc]">
                                <span>
                                  (
                                  {flight.departure
                                    ?.airportCode ??
                                    'Unknown'}
                                  )
                                </span>

                                <span>
                                  {formatDuration(
                                    flight.flightDuration
                                  )}
                                </span>

                                <span>
                                  (
                                  {flight.arrival
                                    ?.airportCode ??
                                    'Unknown'}
                                  )
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span>
                                  {extractDate(flight.departureDateTime)}{' '}
                                  {extractTime(flight.departureDateTime)}<br/>
                                  <small><b>Secure Flight : {JSON.stringify(flight.secureFlight)}</b></small><br/>
                                  <small>
                                    <b>Amenities -</b> {flight?.operatingCarrier?.name}
                                  </small>
                                </span>
                                <span>
                                  {extractDate(flight.arrivalDateTime)}{' '}
                                  {extractTime(flight.arrivalDateTime)}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">
                                  <b>{flight?.priceClass?.[0]?.fareClassType} {flight.bookingCode}</b>
                                </p>
                                <p>
                                  <small className="bg-[#7c7c7c] p-1 px-2 rounded text-white font-semibold">
                                    {flight?.priceClass?.[0]?.cabinType?.[0].cabinTypeName} {flight?.priceClass?.[0]?.cabinType?.[0].cabinTypeCode}
                                  </small>
                                </p>
                                <p><small><b>Fare Basis Code :</b> {flight?.fareBasisCode}</small></p>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )
                )
              ) : (
                <p>No review itinerary available.</p>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-1/4">
            <div className="p-3 bg-[#f1f1f1] border border-[#ccc]">
              Mandatory : No
            </div>

            <div className="p-4 border border-[#ccc] border-t-0 min-h-[200px]">
              {/* Additional content */}
            </div>
          </div>
        </div>
        <div className="bg-[#f5f5f5] min-h-screen p-6">
          <div className="max-w-[1400px] mx-auto">

            {/* Top Controls */}
            <div className="flex justify-between items-center mb-4">
              <select className="border border-gray-300 rounded px-3 py-2 w-64 bg-white">
                <option>Select Test Case</option>
              </select>

              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span>Multiple Form of Payment</span>
              </label>
            </div>

            {/* Passenger Section */}
            <div className="border bg-white rounded">
              <div className="inline-block bg-gray-200 px-3 py-1 border-r border-b text-sm font-medium">
                Passenger, 1 (Adult | Priced Adult)
              </div>
              <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left */}
                <div>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="text-sm">Title *</label>
                      <select className="w-full border p-2 rounded" value={passengerDetails[0].title} onChange={(e) => {
                        const updatedDetails = [...passengerDetails];
                        updatedDetails[0].title = e.target.value;
                        setPassengerDetails(updatedDetails);
                      }}>
                        <option value="">Select</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Dr">Dr</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm">First Name *</label>
                      <input
                        className="w-full border p-2 rounded"
                        placeholder="First Name"
                        value={passengerDetails[0].firstName}
                        onChange={(e) => {
                          const updatedDetails = [...passengerDetails];
                          updatedDetails[0].firstName = e.target.value;
                          setPassengerDetails(updatedDetails);
                        }}
                      />
                    </div>

                    <div>
                      <label className="text-sm">Middle Name</label>
                      <input
                        className="w-full border p-2 rounded"
                        placeholder="Middle Name"
                        value={passengerDetails[0].middleName}
                        onChange={(e) => {
                          const updatedDetails = [...passengerDetails];
                          updatedDetails[0].middleName = e.target.value;
                          setPassengerDetails(updatedDetails);
                        }}
                      />
                    </div>

                    <div>
                      <label className="text-sm">Last Name *</label>
                      <input
                        className="w-full border p-2 rounded"
                        placeholder="Last Name"
                        value={passengerDetails[0].lastName}
                        onChange={(e) => {
                          const updatedDetails = [...passengerDetails];
                          updatedDetails[0].lastName = e.target.value;
                          setPassengerDetails(updatedDetails);
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div>
                      <label className="text-sm">Gender *</label>
                      <select className="w-full border p-2 rounded"
                        value={passengerDetails[0].gender}
                        onChange={(e) => {
                          const updatedDetails = [...passengerDetails];
                          updatedDetails[0].gender = e.target.value;
                          setPassengerDetails(updatedDetails);
                        }}
                      >
                        <option value="">Select</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    </div>

                    <div className="col-span-2 dateofbirth">
                      {/* <label className="text-sm">Date Of Birth *</label> */}

                      {/* <div className="flex gap-2">
                        <select className="border p-2 rounded">
                          <option>01</option>
                        </select>

                        <select className="border p-2 rounded">
                          <option>Jan</option>
                        </select>

                        <select className="border p-2 rounded">
                          <option>1997</option>
                        </select>
                      </div> */}
                      <DatePickerSelect
                        label="Date Of Birth"
                        initialDate={{ day: '01', month: 'Jan', year: '1997' }}
                        onDateChange={(date) => {
                          console.log('Selected date:', date);
                          const updatedDetails = [...passengerDetails];
                          updatedDetails[0].dateOfBirth = date.year+'-'+ date.month+'-'+date.day;
                          setPassengerDetails(updatedDetails);
                          // Update your state here
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm">Aeroplan</label>
                      <select 
                        className="w-full border p-2 rounded"
                        value={selectedAeroplan}
                        onChange={(e) => {
                          setSelectedAeroplan(e.target.value);
                          const updatedDetails = [...passengerDetails];
                          updatedDetails[0].programId = [e.target.value];
                          setPassengerDetails(updatedDetails);
                        }}
                      >
                        <option value="">Select</option>
                        {aeroplanPrograms.map((program) => (
                          <option key={program.code} value={program.code}>
                            {program.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm">Aeroplan Number</label>
                      <input
                        className="w-full border p-2 rounded"
                        placeholder="Aeroplan Number"
                        value={passengerDetails[0].membershipId?.[0] || ""}
                        onChange={(e) => {
                          const updatedDetails = [...passengerDetails];
                          updatedDetails[0].membershipId = [e.target.value];
                          setPassengerDetails(updatedDetails);
                        }}
                      />
                    </div>

                    <div>
                      <label className="text-sm">Document Type</label>
                      <select 
                        className="w-full border p-2 rounded"
                        value={passengerDetails[0].documentType}
                        onChange={(e) => {
                          const updatedDetails = [...passengerDetails];
                          updatedDetails[0].documentType = e.target.value;
                          setPassengerDetails(updatedDetails);
                        }}
                      >
                        <option value="">Select Type</option>
                        <option value="Passport">Passport</option>
                        <option value="Redress Number">Redress Number</option>
                        <option value="US Passport">US Passport</option>
                        <option value="US Alien Card">US Alien Card</option>
                        <option value="CA Resident Card">CA Resident Card</option>
                        <option value="Nexus">Nexus</option>
                        <option value="E-Passport">E-Passport</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm">Document Number</label>
                      <input
                        className="w-full border p-2 rounded"
                        placeholder="Enter Document Number"
                        value={passengerDetails[0].documentNumber}
                        onChange={(e) => {
                          const updatedDetails = [...passengerDetails];
                          updatedDetails[0].documentNumber = e.target.value;
                          setPassengerDetails(updatedDetails);
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="border bg-blue-50 p-4 text-center font-semibold">
                      YUL to YVR : NA
                    </div>

                    <div className="border bg-blue-50 p-4 text-center font-semibold">
                      YVR to YUL : NA
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="border bg-white rounded mt-5">
              <div className="inline-block bg-gray-200 px-3 py-1 border-r border-b font-medium">
                Payment Information
              </div>

              <div className="p-5">

                {/* Tabs */}
                <div className="flex justify-center mb-6">
                  <div className="flex border rounded overflow-hidden">
                    <button
                      className={`px-6 py-2 border-r ${
                        paymentType === "hold"
                          ? "bg-gray-100"
                          : ""
                      }`}
                      onClick={() => setPaymentType("hold")}
                    >
                      On-Hold Booking
                    </button>

                    <button
                      className={`px-6 py-2 border-r ${
                        paymentType === "credit-card"
                          ? "bg-gray-100"
                          : ""
                      }`}
                      onClick={() => setPaymentType("credit-card")}
                    >
                      Credit Card
                    </button>

                    <button
                      className={`px-6 py-2 ${
                        paymentType === "cash"
                          ? "bg-gray-100"
                          : ""
                      }`}
                      onClick={() => setPaymentType("cash")}
                    >
                      Cash
                    </button>
                  </div>
                </div>
                {
                  paymentType === "credit-card" && (
                    <>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

                      <div>
                        <label>Card Type *</label>
                        <select className="w-full border p-2 rounded">
                          <option>VISA International</option>
                        </select>
                      </div>

                      <div>
                        <label>Card Holder Name *</label>
                        <input
                          className="w-full border p-2 rounded"
                          defaultValue="Test"
                        />
                      </div>

                      <div>
                        <label>Card Number *</label>
                        <input
                          className="w-full border p-2 rounded"
                          defaultValue="4012999999999999"
                        />
                      </div>

                      <div>
                        <label>Address Line 1 *</label>
                        <input
                          className="w-full border p-2 rounded"
                          defaultValue="111"
                        />
                      </div>

                      <div>
                        <label>Country *</label>
                        <select className="w-full border p-2 rounded">
                          <option>Canada</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mt-4">

                      <div>
                        <label>CVV</label>
                        <input
                          className="w-full border p-2 rounded"
                          defaultValue="737"
                        />
                      </div>

                      <div>
                        <label>Expiry Month *</label>
                        <select className="w-full border p-2 rounded">
                          <option>Jan (01)</option>
                        </select>
                      </div>

                      <div>
                        <label>Expiry Year *</label>
                        <select className="w-full border p-2 rounded">
                          <option>2030</option>
                        </select>
                      </div>

                      <div>
                        <label>City *</label>
                        <input
                          className="w-full border p-2 rounded"
                          defaultValue="Montreal"
                        />
                      </div>

                      <div>
                        <label>Province *</label>
                        <select className="w-full border p-2 rounded">
                          <option>Quebec</option>
                        </select>
                      </div>

                      <div>
                        <label>Postal Code *</label>
                        <input
                          className="w-full border p-2 rounded"
                          defaultValue="H2J3K4"
                        />
                      </div>
                    </div>
                    </>
                  )
                }
                
              </div>
            </div>

            {/* Contact Information */}
            <div className="border bg-white rounded mt-5">
              <div className="inline-block bg-gray-200 px-3 py-1 border-r border-b font-medium">
                Contact Information
              </div>

              <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-8">

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Country Code *</label>
                    <input
                      className="w-full border p-2 rounded"
                      defaultValue="1"
                    />
                  </div>

                  <div>
                    <label>Phone Number *</label>
                    <input
                      className="w-full border p-2 rounded"
                      placeholder="(XXX)-XXX-XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-3">
                    <input type="checkbox" />
                    Disable Email Receipt to Passenger
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      className="border p-2 rounded"
                      placeholder="Email Address"
                    />

                    <input
                      className="border p-2 rounded"
                      placeholder="Travel Agency Email"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-4 mt-5">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Include 3DSv2 Information
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Save as Test Case
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Edit Before Send
              </label>

              <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default ReviewPage;