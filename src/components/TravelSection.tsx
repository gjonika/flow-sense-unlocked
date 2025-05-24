
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plane, Hotel } from 'lucide-react';
import { Survey, FlightDetails, HotelDetails } from '@/types/survey';

interface TravelSectionProps {
  survey: Survey;
  onUpdate: (survey: Survey) => void;
}

const TravelSection = ({ survey, onUpdate }: TravelSectionProps) => {
  const [flightDetails, setFlightDetails] = useState<FlightDetails>(
    survey.flight_details || {}
  );
  const [hotelDetails, setHotelDetails] = useState<HotelDetails>(
    survey.hotel_details || {}
  );

  const updateFlightDetails = (updates: Partial<FlightDetails>) => {
    const newFlightDetails = { ...flightDetails, ...updates };
    setFlightDetails(newFlightDetails);
    onUpdate({
      ...survey,
      flight_details: newFlightDetails,
    });
  };

  const updateHotelDetails = (updates: Partial<HotelDetails>) => {
    const newHotelDetails = { ...hotelDetails, ...updates };
    setHotelDetails(newHotelDetails);
    onUpdate({
      ...survey,
      hotel_details: newHotelDetails,
    });
  };

  return (
    <div className="space-y-6">
      {/* Flight Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center">
            <Plane className="mr-2 h-5 w-5" />
            Flight Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="outbound-date">Outbound Date</Label>
              <Input
                id="outbound-date"
                type="date"
                value={flightDetails.outbound_date || ''}
                onChange={(e) => updateFlightDetails({ outbound_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="return-date">Return Date</Label>
              <Input
                id="return-date"
                type="date"
                value={flightDetails.return_date || ''}
                onChange={(e) => updateFlightDetails({ return_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="airline">Airline</Label>
              <Input
                id="airline"
                placeholder="e.g., Emirates, British Airways"
                value={flightDetails.airline || ''}
                onChange={(e) => updateFlightDetails({ airline: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="flight-confirmation">Confirmation Number</Label>
              <Input
                id="flight-confirmation"
                placeholder="Flight confirmation number"
                value={flightDetails.confirmation || ''}
                onChange={(e) => updateFlightDetails({ confirmation: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hotel Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center">
            <Hotel className="mr-2 h-5 w-5" />
            Hotel Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkin-date">Check-in Date</Label>
              <Input
                id="checkin-date"
                type="date"
                value={hotelDetails.checkin_date || ''}
                onChange={(e) => updateHotelDetails({ checkin_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="checkout-date">Check-out Date</Label>
              <Input
                id="checkout-date"
                type="date"
                value={hotelDetails.checkout_date || ''}
                onChange={(e) => updateHotelDetails({ checkout_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="hotel-name">Hotel Name</Label>
              <Input
                id="hotel-name"
                placeholder="Hotel name"
                value={hotelDetails.hotel_name || ''}
                onChange={(e) => updateHotelDetails({ hotel_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="hotel-confirmation">Confirmation Number</Label>
              <Input
                id="hotel-confirmation"
                placeholder="Hotel confirmation number"
                value={hotelDetails.confirmation || ''}
                onChange={(e) => updateHotelDetails({ confirmation: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Travel Summary */}
      {(Object.keys(flightDetails).length > 0 || Object.keys(hotelDetails).length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700">Travel Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flightDetails.outbound_date && (
                <div>
                  <h4 className="font-medium">Flight Details:</h4>
                  <p className="text-gray-600">
                    {flightDetails.outbound_date} 
                    {flightDetails.return_date && ` to ${flightDetails.return_date}`}
                    {flightDetails.airline && ` via ${flightDetails.airline}`}
                  </p>
                </div>
              )}
              {hotelDetails.checkin_date && (
                <div>
                  <h4 className="font-medium">Hotel Details:</h4>
                  <p className="text-gray-600">
                    {hotelDetails.hotel_name && `${hotelDetails.hotel_name} - `}
                    {hotelDetails.checkin_date}
                    {hotelDetails.checkout_date && ` to ${hotelDetails.checkout_date}`}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TravelSection;
