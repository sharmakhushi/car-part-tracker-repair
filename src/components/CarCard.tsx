
import React from 'react';
import { Car, User, Calendar, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Part {
  id: string;
  name: string;
  available: boolean;
  cost: number;
}

interface CarData {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  customerName: string;
  parts: Part[];
  status: 'waiting' | 'in-progress' | 'completed';
  dateAdded: string;
}

interface CarCardProps {
  car: CarData;
  onUpdateStatus: (carId: string, newStatus: CarData['status']) => void;
  onTogglePartAvailability: (carId: string, partId: string) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onUpdateStatus, onTogglePartAvailability }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="destructive" className="flex items-center gap-1"><Clock className="h-3 w-3" />Waiting for Parts</Badge>;
      case 'in-progress':
        return <Badge variant="default" className="flex items-center gap-1 bg-yellow-500"><Car className="h-3 w-3" />Under Repair</Badge>;
      case 'completed':
        return <Badge variant="default" className="flex items-center gap-1 bg-green-500"><CheckCircle className="h-3 w-3" />Completed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const canStartRepair = car.parts.every(part => part.available) && car.status === 'waiting';
  const canComplete = car.status === 'in-progress';
  const totalCost = car.parts.reduce((sum, part) => sum + part.cost, 0);

  const getNextStatus = () => {
    if (car.status === 'waiting' && canStartRepair) return 'in-progress';
    if (car.status === 'in-progress') return 'completed';
    return car.status;
  };

  const getActionButtonText = () => {
    if (car.status === 'waiting' && canStartRepair) return 'Start Repair';
    if (car.status === 'in-progress') return 'Mark Complete';
    return 'No Action';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            {car.year} {car.make} {car.model}
          </CardTitle>
          {getStatusBadge(car.status)}
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{car.customerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            <span>{car.licensePlate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Added: {new Date(car.dateAdded).toLocaleDateString()}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Parts List */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Required Parts:</h4>
          <div className="space-y-2">
            {car.parts.map((part) => (
              <div key={part.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onTogglePartAvailability(car.id, part.id)}
                    className="focus:outline-none"
                  >
                    {part.available ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </button>
                  <span className={`text-sm ${part.available ? 'text-gray-900' : 'text-gray-500'}`}>
                    {part.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <DollarSign className="h-3 w-3" />
                  {part.cost}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Cost */}
        <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
          <span className="font-medium text-gray-900">Total Cost:</span>
          <div className="flex items-center gap-1 font-semibold text-blue-600">
            <DollarSign className="h-4 w-4" />
            {totalCost}
          </div>
        </div>

        {/* Action Button */}
        {car.status !== 'completed' && (
          <Button
            onClick={() => onUpdateStatus(car.id, getNextStatus())}
            disabled={car.status === 'waiting' && !canStartRepair}
            className="w-full"
            variant={car.status === 'in-progress' ? 'default' : 'outline'}
          >
            {getActionButtonText()}
          </Button>
        )}

        {car.status === 'waiting' && !canStartRepair && (
          <p className="text-sm text-red-600 text-center">
            Cannot start repair - some parts are not available
          </p>
        )}
      </CardContent>
    </Card>
  );
};
