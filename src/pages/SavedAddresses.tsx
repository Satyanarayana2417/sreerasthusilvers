import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import LoadingScreen from '@/components/LoadingScreen';
import { useToast } from '@/hooks/use-toast';
import {
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  Address,
  AddressFormData,
} from '@/services/addressService';
import {
  ArrowLeft,
  Plus,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Check,
  X,
  Home,
  Loader2,
} from 'lucide-react';

const SavedAddresses = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<AddressFormData>({
    fullName: '',
    phoneNumber: '',
    pinCode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    isDefault: false,
  });

  // Fetch addresses on mount
  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userAddresses = await getUserAddresses(user.uid);
      setAddresses(userAddresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load addresses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (!formData.fullName || !formData.phoneNumber || !formData.pinCode || 
        !formData.address || !formData.city || !formData.state) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setFormLoading(true);

      if (editingAddress) {
        // Update existing address
        await updateAddress(user.uid, editingAddress.id, formData);
        toast({
          title: 'Success',
          description: '✓ Address updated successfully',
        });
      } else {
        // Add new address
        await addAddress(user.uid, formData);
        toast({
          title: 'Success',
          description: '✓ Address added successfully',
        });
      }

      // Reset form and reload addresses
      resetForm();
      await loadAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: 'Error',
        description: 'Failed to save address',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      pinCode: address.pinCode,
      locality: address.locality,
      address: address.address,
      city: address.city,
      state: address.state,
      isDefault: address.isDefault,
    });
    setShowForm(true);
  };

  const handleDelete = async (addressId: string) => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(user.uid, addressId);
        toast({
          title: 'Success',
          description: 'Address deleted successfully',
        });
        await loadAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete address',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user) return;

    try {
      await setDefaultAddress(user.uid, addressId);
      toast({
        title: 'Success',
        description: 'Default address updated',
      });
      await loadAddresses();
    } catch (error) {
      console.error('Error setting default:', error);
      toast({
        title: 'Error',
        description: 'Failed to update default address',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phoneNumber: '',
      pinCode: '',
      locality: '',
      address: '',
      city: '',
      state: '',
      isDefault: false,
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/account')}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Saved Addresses</h1>
                <p className="text-gray-600 mt-1">Manage your delivery addresses</p>
              </div>
            </div>
          </div>

          {/* Add New Address Button */}
          {!showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Button
                onClick={() => setShowForm(true)}
                className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-xl shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Address
              </Button>
            </motion.div>
          )}

          {/* Address Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-2 block">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 mb-2 block">
                        Phone Number *
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Pin Code & Locality */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="pinCode" className="text-sm font-medium text-gray-700 mb-2 block">
                          Pin Code *
                        </Label>
                        <Input
                          id="pinCode"
                          name="pinCode"
                          value={formData.pinCode}
                          onChange={handleInputChange}
                          placeholder="6-digit PIN code"
                          maxLength={6}
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="locality" className="text-sm font-medium text-gray-700 mb-2 block">
                          Locality
                        </Label>
                        <Input
                          id="locality"
                          name="locality"
                          value={formData.locality}
                          onChange={handleInputChange}
                          placeholder="Locality/Town"
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
                        Address (Area and Street) *
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Flat/House No., Building, Street"
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* City & State */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="city" className="text-sm font-medium text-gray-700 mb-2 block">
                          City *
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-sm font-medium text-gray-700 mb-2 block">
                          State *
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="State"
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Set as Default */}
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))
                        }
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <Label htmlFor="isDefault" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Set as default shipping address
                      </Label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex space-x-4 pt-4">
                      <Button
                        type="submit"
                        disabled={formLoading}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 rounded-xl font-semibold shadow-lg"
                      >
                        {formLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5 mr-2" />
                            {editingAddress ? 'Update Address' : 'Save Address'}
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        onClick={resetForm}
                        variant="outline"
                        className="px-8 h-12 rounded-xl border-gray-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Address List */}
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm p-12 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No addresses saved</h3>
                <p className="text-gray-600">Add your first delivery address to get started</p>
              </motion.div>
            ) : (
              addresses.map((address, index) => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl shadow-sm p-6 ${
                    address.isDefault ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Home className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {address.fullName}
                          </h3>
                          {address.isDefault && (
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                              Default
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="ml-13 space-y-1 text-gray-700">
                        <p>{address.address}</p>
                        {address.locality && <p>{address.locality}</p>}
                        <p>
                          {address.city}, {address.state} - {address.pinCode}
                        </p>
                        <div className="flex items-center space-x-2 pt-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{address.phoneNumber}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handleEdit(address)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                          title="Set as default"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
      <MobileBottomNav />
    </>
  );
};

export default SavedAddresses;
