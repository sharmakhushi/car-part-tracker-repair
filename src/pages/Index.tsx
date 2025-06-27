
import React, { useState } from 'react';
import { Car, Plus, Settings, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CarCard } from '@/components/CarCard';
import { AddCarForm } from '@/components/AddCarForm';
import { Badge } from '@/components/ui/badge';

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

const Index = () => {
  const [cars, setCars] = useState<CarData[]>([
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      licensePlate: 'ABC-123',
      customerName: 'John Smith',
      parts: [
        { id: 'p1', name: 'Brake Pads', available: true, cost: 120 },
        { id: 'p2', name: 'Oil Filter', available: true, cost: 25 },
        { id: 'p3', name: 'Air Filter', available: false, cost: 40 }
      ],
      status: 'waiting',
      dateAdded: '2024-06-20'
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      licensePlate: 'XYZ-789',
      customerName: 'Sarah Johnson',
      parts: [
        { id: 'p4', name: 'Spark Plugs', available: true, cost: 80 },
        { id: 'p5', name: 'Transmission Fluid', available: true, cost: 60 }
      ],
      status: 'in-progress',
      dateAdded: '2024-06-18'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddCar = (newCar: Omit<CarData, 'id' | 'dateAdded'>) => {
    const car: CarData = {
      ...newCar,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setCars([...cars, car]);
    setShowAddForm(false);
  };

  const handleUpdateCarStatus = (carId: string, newStatus: CarData['status']) => {
    setCars(cars.map(car => 
      car.id === carId ? { ...car, status: newStatus } : car
    ));
  };

  const handleTogglePartAvailability = (carId: string, partId: string) => {
    setCars(cars.map(car => 
      car.id === carId 
        ? {
            ...car,
            parts: car.parts.map(part =>
              part.id === partId ? { ...part, available: !part.available } : part
            )
          }
        : car
    ));
  };

  const filteredCars = cars.filter(car =>
    car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusCounts = () => {
    return {
      waiting: cars.filter(car => car.status === 'waiting').length,
      inProgress: cars.filter(car => car.status === 'in-progress').length,
      completed: cars.filter(car => car.status === 'completed').length,
      total: cars.length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Car className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Workshop Parts Monitor</h1> // Name changed by Ankit
            </div>
            <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Car
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cars</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Settings className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Waiting for Parts</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.waiting}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Settings className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search cars by make, model, customer name, or license plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onUpdateStatus={handleUpdateCarStatus}
              onTogglePartAvailability={handleTogglePartAvailability}
            />
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <Car className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No cars found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding a new car.'}
            </p>
          </div>
        )}
      </div>

      {/* Add Car Form Modal */}
      {showAddForm && (
        <AddCarForm
          onSubmit={handleAddCar}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default Index;
