// project/src/components/create/CreateEvent.tsx
import React, { useState } from 'react';
import { Calendar, MapPin, DollarSign, Tag, Image, FileText, Save, Upload, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = 'http://localhost:8080/api';
const BASE_URL = 'http://localhost:8080';

const CreateEvent: React.FC = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: '', shortDescription: '', description: '', date: '', time: '',
    location: '', venue: '', category: 'Technology', price: 0,
    maxAttendees: 100, tags: [''], imageUrl: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    'Technology', 'Marketing', 'Business', 'Education', 'Entertainment',
    'Food & Drink', 'Health & Wellness', 'Sports & Fitness', 'Arts & Culture', 'Networking'
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }));
  };

  const removeTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) { alert('Please select a valid image file'); return; }
      if (file.size > 5 * 1024 * 1024) { alert('Image size must be less than 5MB'); return; }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => { setImagePreview(e.target?.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    if (!token) {
      setError('You must be logged in to create an event.');
      setIsSubmitting(false);
      return;
    }

    try {
      let finalImageUrl = 'https://placehold.co/600x400/6366f1/ffffff?text=Event';

      if (selectedImage) {
        const imageFormData = new FormData();
        imageFormData.append('file', selectedImage);
        const uploadResponse = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: imageFormData,
        });
        if (!uploadResponse.ok) throw new Error('Image upload failed.');
        const uploadResult = await uploadResponse.json();
        
        finalImageUrl = `${BASE_URL}${uploadResult.filePath}`;
      }
      
      const finalTags = formData.tags.filter(tag => tag.trim() !== '');
      const eventData = { ...formData, tags: finalTags, imageUrl: finalImageUrl };

      const eventResponse = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(eventData),
      });

      if (!eventResponse.ok) {
        const errorText = await eventResponse.text();
        throw new Error(errorText || 'Failed to create event.');
      }
      
      const createdEvent = await eventResponse.json();
      setSuccess(`Event "${createdEvent.title}" created successfully!`);
      // Reset form
      setFormData({
        title: '', shortDescription: '', description: '', date: '', time: '',
        location: '', venue: '', category: 'Technology', price: 0,
        maxAttendees: 100, tags: [''], imageUrl: ''
      });
      setSelectedImage(null);
      setImagePreview('');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8"><h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1><p className="text-gray-600">Fill in the details to create an amazing event for your community</p></div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6" role="alert">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center"><FileText className="h-5 w-5 mr-2 text-blue-600" />Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                    <input id="title" name="title" type="text" required value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter event title" />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
                    <input id="shortDescription" name="shortDescription" type="text" required value={formData.shortDescription} onChange={(e) => handleInputChange('shortDescription', e.target.value)} className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Brief description for event cards (max 100 characters)" maxLength={100} />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Full Description *</label>
                    <textarea id="description" name="description" required rows={5} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Detailed event description" />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select id="category" name="category" required value={formData.category} onChange={(e) => handleInputChange('category', e.target.value)} className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">{categories.map(category => (<option key={category} value={category}>{category}</option>))}</select>
                </div>
            </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center"><Calendar className="h-5 w-5 mr-2 text-blue-600" />Date & Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input id="date" name="date" type="date" required value={formData.date} onChange={(e) => handleInputChange('date', e.target.value)} className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                    <input id="time" name="time" type="time" required value={formData.time} onChange={(e) => handleInputChange('time', e.target.value)} className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
            </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center"><MapPin className="h-5 w-5 mr-2 text-blue-600" />Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">Venue Name *</label>
                    <input id="venue" name="venue" type="text" required value={formData.venue} onChange={(e) => handleInputChange('venue', e.target.value)} className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Convention Center, Community Hall" />
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">City, State *</label>
                    <input id="location" name="location" type="text" required value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Kuala Lumpur, Selangor" />
                </div>
            </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center"><DollarSign className="h-5 w-5 mr-2 text-blue-600" />Pricing & Capacity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Ticket Price (RM) *</label>
                    <input id="price" name="price" type="number" required min="0" step="0.01" value={formData.price} onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)} className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0.00" />
                </div>
                <div>
                    <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-2">Maximum Attendees *</label>
                    <input id="maxAttendees" name="maxAttendees" type="number" required min="1" value={formData.maxAttendees} onChange={(e) => handleInputChange('maxAttendees', parseInt(e.target.value) || 1)} className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="100" />
                </div>
            </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"><h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center"><Image className="h-5 w-5 mr-2 text-blue-600" />Event Image</h2><div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors"><div className="space-y-1 text-center"><Upload className="mx-auto h-12 w-12 text-gray-400" /><div className="flex text-sm text-gray-600"><label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"><span>Upload a file</span><input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} /></label><p className="pl-1">or drag and drop</p></div><p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p></div></div>{imagePreview && (<div className="mt-4"><label className="block text-sm font-medium text-gray-700 mb-2">Preview</label><div className="relative inline-block"><img src={imagePreview} alt="Event preview" className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200" /><button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"><X className="h-4 w-4" /></button></div></div>)}</div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center"><Tag className="h-5 w-5 mr-2 text-blue-600" />Tags</h2>
            <div className="space-y-3">
                {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <label htmlFor={`tag-${index}`} className="sr-only">Tag {index + 1}</label>
                    <input id={`tag-${index}`} name={`tag-${index}`} type="text" value={tag} onChange={(e) => handleTagChange(index, e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter tag" />
                    {formData.tags.length > 1 && (<button type="button" onClick={() => removeTag(index)} className="text-red-600 hover:text-red-800 font-medium">Remove</button>)}
                </div>))}
                <button type="button" onClick={addTag} className="text-blue-600 hover:text-blue-800 font-medium text-sm">+ Add Tag</button>
            </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"><button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">{isSubmitting ? ( <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>Creating Event...</> ) : ( <><Save className="h-5 w-5 mr-2" />Create Event</> )}</button></div>
      </form>
    </div>
  );
};

export default CreateEvent;