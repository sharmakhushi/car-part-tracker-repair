
import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Part {
  id: string;
  name: string;
  available: boolean;
  cost: number;
}

interface CarData {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  customerName: string;
  parts: Part[];
  status: 'waiting' | 'in-progress' | 'completed';
}

interface AddCarFormProps {
  onSubmit: (car: CarData) => void;
  onCancel: () => void;
}

export const AddCarForm: React.FC<AddCarFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    customerName: ''
  });

  const [parts, setParts] = useState<Part[]>([
    { id: '1', name: '', available: false, cost: 0 }
  ]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePartChange = (partId: string, field: keyof Part, value: string | number | boolean) => {
    setParts(prev => prev.map(part =>
      part.id === partId
        ? { ...part, [field]: field === 'cost' ? Number(value) : value }
        : part
    ));
  };

  const addPart = () => {
    const newPart: Part = {
      id: Date.now().toString(),
      name: '',
      available: false,
      cost: 0
    };
    setParts(prev => [...prev, newPart]);
  };

  const removePart = (partId: string) => {
    if (parts.length > 1) {
      setParts(prev => prev.filter(part => part.id !== partId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validParts = parts.filter(part => part.name.trim() !== '');
    
    if (validParts.length === 0) {
      alert('Please add at least one part.');
      return;
    }

    const carData: CarData = {
      ...formData,
      parts: validParts,
      status: 'waiting'
    };

    onSubmit(carData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Add New Car</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Car Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Car Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    type="text"
                    value={formData.make}
                    onChange={(e) => handleInputChange('make', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    type="text"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input
                    id="licensePlate"
                    type="text"
                    value={formData.licensePlate}
                    onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Parts Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Required Parts</h3>
                <Button type="button" onClick={addPart} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Part
                </Button>
              </div>

              <div className="space-y-3">
                {parts.map((part, index) => (
                  <div key={part.id} className="flex gap-3 items-end p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <Label htmlFor={`part-name-${part.id}`}>Part Name</Label>
                      <Input
                        id={`part-name-${part.id}`}
                        type="text"
                        value={part.name}
                        onChange={(e) => handlePartChange(part.id, 'name', e.target.value)}
                        placeholder="e.g., Brake Pads"
                      />
                    </div>
                    
                    <div className="w-24">
                      <Label htmlFor={`part-cost-${part.id}`}>Cost ($)</Label>
                      <Input
                        id={`part-cost-${part.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={part.cost}
                        onChange={(e) => handlePartChange(part.id, 'cost', e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`part-available-${part.id}`}
                        checked={part.available}
                        onChange={(e) => handlePartChange(part.id, 'available', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor={`part-available-${part.id}`} className="text-sm">Available</Label>
                    </div>
                    
                    {parts.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removePart(part.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Add Car
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
