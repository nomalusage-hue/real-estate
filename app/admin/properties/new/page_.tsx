// app/admin/properties/new/page.tsx
"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import "./styles.css"
import { PropertyService } from '@/services/PropertyService';
import { ImageUploadService } from '@/services/ImageUploadService';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '@/config/firebase';
import { checkIfAdmin } from '@/utils/checkIfAdmin';

interface PropertyData {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  price: number;
  salePrice?: number;  // Optional separate sale price
  rentPrice?: number;  // Optional separate rent price
  status: ('For Sale' | 'For Rent' | 'Sold')[];  // Now an array of statuses
  address: string;
  city: string;
  showAddress: boolean;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  buildingSize?: number;
  landSize?: number;
  sizeUnit: string;
  yearBuilt?: number;
  garage?: number;
  zoning?: string;
  utilities: {
    water: boolean;
    electricity: boolean;
    sewage: boolean;
    roadAccess: boolean;
  };
  hot: boolean;
  newListing: boolean;
  featured: boolean;
  exclusive: boolean;
  interiorFeatures: string[];
  exteriorFeatures: string[];
  customFeatures: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  showAgent: boolean;
  agent?: {
    name: string;
    title: string;
    phone: string;
    email: string;
    photo?: string;
  };
}

interface ValidationError {
  field: string;
  message: string;
}

export default function NewPropertyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
  const [interiorFeatures, setInteriorFeatures] = useState<Set<string>>(new Set());
  const [exteriorFeatures, setExteriorFeatures] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const dropzoneRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [propertyData, setPropertyData] = useState<PropertyData>({
    id: '',
    title: '',
    description: '',
    propertyType: '',
    price: 0,
    status: [],  // Empty array to start
    address: '',
    city: '',
    showAddress: true,
    images: [],
    sizeUnit: 'm2',
    utilities: {
      water: false,
      electricity: false,
      sewage: false,
      roadAccess: false
    },
    hot: false,
    newListing: false,
    featured: false,
    exclusive: false,
    interiorFeatures: [],
    exteriorFeatures: [],
    customFeatures: [],
    showAgent: true,
  });

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Property types
  const propertyTypes = [
    { type: 'house', icon: 'bi-house-door', label: 'House' },
    { type: 'apartment', icon: 'bi-building', label: 'Apartment' },
    { type: 'villa', icon: 'bi-house-heart', label: 'Villa' },
    { type: 'commercial', icon: 'bi-shop', label: 'Commercial' },
    { type: 'land', icon: 'bi-tree', label: 'Land' },
  ];

  // Property status options
  const statusOptions = ['For Sale', 'For Rent', 'Sold'] as const;

  // Feature tags
  const featureTags = [
    { id: 'hot', icon: 'bi-fire', label: 'Hot Property', description: 'Highlight this property as in high demand' },
    { id: 'newListing', icon: 'bi-star', label: 'New Listing', description: 'Recently added to our listings' },
    { id: 'featured', icon: 'bi-gem', label: 'Featured', description: 'Prominently featured on homepage' },
    { id: 'exclusive', icon: 'bi-shield-lock', label: 'Exclusive', description: 'Only available through our agency' },
  ];

  // Interior features (grouped by category)
  const interiorFeaturesList = [
    { category: 'Floors & Walls', features: ['Hardwood Floors', 'Tile Flooring', 'Carpeted', 'Marble Flooring', 'Wall Paneling'] },
    { category: 'Kitchen', features: ['Updated Kitchen', 'Granite Countertops', 'Stainless Steel Appliances', 'Kitchen Island', 'Walk-in Pantry'] },
    { category: 'Living Areas', features: ['Fireplace', 'High Ceilings', 'Home Office', 'Finished Basement', 'Sun Room'] },
    { category: 'Comfort & Systems', features: ['Central Air Conditioning', 'Smart Home System', 'In-unit Laundry', 'Security System', 'Sound System'] },
  ];

  // Exterior features (grouped by category)
  const exteriorFeaturesList = [
    { category: 'Outdoor Living', features: ['Swimming Pool', 'Garden', 'Patio/Deck', 'BBQ Area', 'Outdoor Kitchen'] },
    { category: 'Recreation', features: ['Tennis Court', 'Playground', 'Basketball Court', 'Putting Green', 'Jacuzzi'] },
    { category: 'Parking & Access', features: ['Garage', 'Parking Lot', 'Gated Community', 'Elevator', 'Ramp Access'] },
    { category: 'Landscaping', features: ['Sprinkler System', 'Mature Trees', 'Fenced Yard', 'Garden Shed', 'Greenhouse'] },
  ];

  // Step validation rules
  const stepValidationRules = {
    1: (data: PropertyData) => {
      const errors: ValidationError[] = [];
      if (!data.title.trim()) errors.push({ field: 'title', message: 'Property title is required' });
      if (!data.propertyType) errors.push({ field: 'propertyType', message: 'Please select a property type' });
      if (data.status.length === 0) errors.push({ field: 'status', message: 'Please select at least one property status' });
      
      // Validate prices based on selected status
      if (data.status.includes('For Sale') && !data.salePrice && data.salePrice !== 0) {
        errors.push({ field: 'salePrice', message: 'Sale price is required when property is for sale' });
      }
      if (data.status.includes('For Rent') && !data.rentPrice && data.rentPrice !== 0) {
        errors.push({ field: 'rentPrice', message: 'Rent price is required when property is for rent' });
      }
      
      // Validate at least one price is set
      if (!data.salePrice && !data.rentPrice) {
        errors.push({ field: 'price', message: 'At least one price (sale or rent) must be set' });
      }
      
      if (!data.description.trim() || data.description.length < 100) 
        errors.push({ field: 'description', message: 'Description must be at least 100 characters' });
      if (!data.address.trim()) errors.push({ field: 'address', message: 'Address is required' });
      if (!data.city.trim()) errors.push({ field: 'city', message: 'City is required' });
      return errors;
    },
    2: (data: PropertyData) => {
      const errors: ValidationError[] = [];
      if (data.propertyType !== 'land' && data.propertyType !== 'commercial') {
        if (!data.bedrooms && data.bedrooms !== 0) 
          errors.push({ field: 'bedrooms', message: 'Number of bedrooms is required' });
        if (!data.buildingSize) 
          errors.push({ field: 'buildingSize', message: 'Building size is required' });
      }
      if (data.propertyType === 'land' && !data.landSize) {
        errors.push({ field: 'landSize', message: 'Land size is required' });
      }
      return errors;
    },
    4: () => {
      const errors: ValidationError[] = [];
      if (uploadedImages.length === 0) 
        errors.push({ field: 'images', message: 'At least one property image is required' });
      return errors;
    }
  };

  // Handle property type selection
  const handlePropertyTypeSelect = (type: string) => {
    setSelectedPropertyType(type);
    setPropertyData(prev => ({ ...prev, propertyType: type }));
    clearValidationError('propertyType');
  };

  // Handle status toggle
  const toggleStatus = (status: 'For Sale' | 'For Rent' | 'Sold') => {
    setPropertyData(prev => {
      const currentStatus = [...prev.status];
      const index = currentStatus.indexOf(status);
      
      if (index > -1) {
        // Remove status if already selected
        currentStatus.splice(index, 1);
        
        // Also remove associated price
        if (status === 'For Sale') {
          return { ...prev, status: currentStatus, salePrice: undefined };
        } else if (status === 'For Rent') {
          return { ...prev, status: currentStatus, rentPrice: undefined };
        }
        return { ...prev, status: currentStatus };
      } else {
        // Add status if not selected
        // If selecting "Sold", remove "For Sale" and "For Rent"
        if (status === 'Sold') {
          return { 
            ...prev, 
            status: ['Sold'],
            salePrice: undefined,
            rentPrice: undefined
          };
        }
        
        // If already has "Sold", remove it when adding other statuses
        if (currentStatus.includes('Sold')) {
          return { 
            ...prev, 
            status: [status],
            salePrice: status === 'For Sale' ? prev.salePrice : undefined,
            rentPrice: status === 'For Rent' ? prev.rentPrice : undefined
          };
        }
        
        // Add new status
        return { 
          ...prev, 
          status: [...currentStatus, status]
        };
      }
    });
    clearValidationError('status');
  };

  // Toggle feature tag
  const toggleFeatureTag = (feature: string) => {
    setSelectedFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(feature)) {
        newSet.delete(feature);
      } else {
        newSet.add(feature);
      }
      return newSet;
    });
  };

  // Toggle interior feature
  const toggleInteriorFeature = (feature: string) => {
    setInteriorFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(feature)) {
        newSet.delete(feature);
      } else {
        newSet.add(feature);
      }
      return newSet;
    });
  };

  // Toggle exterior feature
  const toggleExteriorFeature = (feature: string) => {
    setExteriorFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(feature)) {
        newSet.delete(feature);
      } else {
        newSet.add(feature);
      }
      return newSet;
    });
  };

  // Handle input changes with validation
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    clearValidationError(name);
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.startsWith('utilities.')) {
        const utilityKey = name.split('.')[1] as keyof PropertyData['utilities'];
        setPropertyData(prev => ({
          ...prev,
          utilities: {
            ...prev.utilities,
            [utilityKey]: checked
          }
        }));
      } else {
        setPropertyData(prev => ({ ...prev, [name]: checked }));
      }
    } else if (type === 'number') {
      const numValue = value === '' ? undefined : parseFloat(value);
      setPropertyData(prev => ({ ...prev, [name]: numValue }));
      
      // Validate prices
      if (name === 'salePrice' && parseFloat(value) <= 0) {
        setValidationErrors(prev => [...prev, { field: 'salePrice', message: 'Sale price must be greater than 0' }]);
      }
      if (name === 'rentPrice' && parseFloat(value) <= 0) {
        setValidationErrors(prev => [...prev, { field: 'rentPrice', message: 'Rent price must be greater than 0' }]);
      }
    } else {
      setPropertyData(prev => ({ ...prev, [name]: value }));
      
      // Validate required fields
      if (name === 'title' && !value.trim()) {
        setValidationErrors(prev => [...prev, { field: 'title', message: 'Property title is required' }]);
      }
      if (name === 'description' && value.length < 100) {
        setValidationErrors(prev => [...prev, { field: 'description', message: 'Description must be at least 100 characters' }]);
      }
    }
  };

  // Clear validation error
  const clearValidationError = (fieldName: string) => {
    setValidationErrors(prev => prev.filter(error => error.field !== fieldName));
  };

  // File validation
  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      alert(`File type not supported: ${file.type}. Please upload JPG, PNG, or WEBP files.`);
      return false;
    }
    
    if (file.size > maxSize) {
      alert(`File ${file.name} is too large. Maximum size is 5MB.`);
      return false;
    }
    
    return true;
  };

  // Handle file upload
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles = Array.from(files).filter(validateFile);
    if (validFiles.length === 0) return;
    
    const fileArray = Array.from(validFiles);
    
    // Save original files for upload
    setSelectedImages((prev) => [...prev, ...fileArray]);

    // Generate preview URLs
    const previews = fileArray.map((file) => URL.createObjectURL(file));

    setUploadedImages((prev) => [...prev, ...previews]);
    clearValidationError('images');

    // Update property data
    setPropertyData((prev) => ({
      ...prev,
      images: [...prev.images, ...previews],
    }));
  };

  // Drag event handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(validateFile);
    if (validFiles.length === 0) return;
    
    // Create a fake event object to reuse the handleFileUpload function
    const dataTransfer = new DataTransfer();
    validFiles.forEach(file => dataTransfer.items.add(file));
    
    // Trigger file input
    if (fileInputRef.current) {
      fileInputRef.current.files = dataTransfer.files;
      handleFileUpload({ target: { files: dataTransfer.files } } as ChangeEvent<HTMLInputElement>);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(uploadedImages[index]);
    
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPropertyData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Handle custom features
  const handleCustomFeatures = (e: ChangeEvent<HTMLInputElement>) => {
    const features = e.target.value
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);
    
    setPropertyData(prev => ({ ...prev, customFeatures: features }));
  };

  // Navigation functions with validation
  const nextStep = () => {
    const validator = stepValidationRules[currentStep as keyof typeof stepValidationRules];
    if (validator) {
      const errors = validator(propertyData);
      if (errors.length > 0) {
        setValidationErrors(errors);
        
        // Scroll to first error
        const firstErrorField = document.querySelector(`[name="${errors[0].field}"]`);
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
    }
    
    setValidationErrors([]);
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setValidationErrors([]);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Generate ID
  const generateId = (): string => {
    return 'prop_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // Submit property
  const imageService = new ImageUploadService();
  const propertyService = new PropertyService();

  const submitProperty = async (e: FormEvent) => {
    e.preventDefault();
    
    const termsCheckbox = document.getElementById("terms-agreement") as HTMLInputElement;
    if (!termsCheckbox?.checked) {
      alert("Please agree to the Terms of Service before publishing.");
      termsCheckbox.focus();
      return;
    }

    // Validate all steps
    const allErrors: ValidationError[] = [];
    Object.values(stepValidationRules).forEach(validator => {
      if (validator) {
        allErrors.push(...validator(propertyData));
      }
    });

    if (allErrors.length > 0) {
      setValidationErrors(allErrors);
      alert('Please fix all validation errors before submitting.');
      return;
    }

    if (uploadedImages.length === 0) {
      alert('Please upload at least one property image.');
      return;
    }

    setIsSubmitting(true);

    try {
      /* 1️⃣ Upload images to ImgBB */
      const uploadedImageUrls: string[] = [];
      
      for (const file of selectedImages) {
        try {
          const url = await imageService.upload(file);
          uploadedImageUrls.push(url);
        } catch (error) {
          console.error('Error uploading image:', error);
          throw new Error(`Failed to upload image: ${file.name}`);
        }
      }

      /* 2️⃣ Build final clean domain object */
      const finalData = {
        ...propertyData,
        id: generateId(),
        images: uploadedImageUrls,
        hot: selectedFeatures.has("hot"),
        newListing: selectedFeatures.has("newListing"),
        featured: selectedFeatures.has("featured"),
        exclusive: selectedFeatures.has("exclusive"),
        interiorFeatures: Array.from(interiorFeatures),
        exteriorFeatures: Array.from(exteriorFeatures),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        published: true
      };

      if (!propertyData.showAgent) {
        delete (finalData as any).agent;
      }

      /* 3️⃣ Save to Firebase */
      await propertyService.create(finalData);

      /* 4️⃣ Clear draft and redirect */
      localStorage.removeItem('propertyDraft');
      alert("Property published successfully!");
      // router.push("/admin/properties");
      router.push("/admin/properties/new");
      
    } catch (error: any) {
      console.error("Error submitting property:", error);
      alert(`Failed to publish property: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save as draft
  const saveAsDraft = () => {
    const draftData = {
      ...propertyData,
      hot: selectedFeatures.has('hot'),
      newListing: selectedFeatures.has('newListing'),
      featured: selectedFeatures.has('featured'),
      exclusive: selectedFeatures.has('exclusive'),
      interiorFeatures: Array.from(interiorFeatures),
      exteriorFeatures: Array.from(exteriorFeatures),
      draft: true,
      lastSaved: new Date().toISOString()
    };

    localStorage.setItem('propertyDraft', JSON.stringify(draftData));
    alert('Draft saved successfully! You can continue editing later.');
  };

  // Load draft if exists
  useEffect(() => {
    const savedDraft = localStorage.getItem('propertyDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setPropertyData(draft);
        if (draft.propertyType) setSelectedPropertyType(draft.propertyType);
        if (draft.images) setUploadedImages(draft.images);
        if (draft.hot) setSelectedFeatures(prev => new Set([...prev, 'hot']));
        if (draft.newListing) setSelectedFeatures(prev => new Set([...prev, 'newListing']));
        if (draft.featured) setSelectedFeatures(prev => new Set([...prev, 'featured']));
        if (draft.exclusive) setSelectedFeatures(prev => new Set([...prev, 'exclusive']));
        if (draft.interiorFeatures) setInteriorFeatures(new Set(draft.interiorFeatures));
        if (draft.exteriorFeatures) setExteriorFeatures(new Set(draft.exteriorFeatures));
        
        console.log('Loaded draft data');
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Update propertyData when features change
  useEffect(() => {
    setPropertyData(prev => ({
      ...prev,
      hot: selectedFeatures.has('hot'),
      newListing: selectedFeatures.has('newListing'),
      featured: selectedFeatures.has('featured'),
      exclusive: selectedFeatures.has('exclusive')
    }));
  }, [selectedFeatures]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      uploadedImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [uploadedImages]);

  // Authentication check
  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      const admin = await checkIfAdmin(user);

      if (!admin) {
        router.replace("/");
        return;
      }

      setIsAdmin(true);
      setChecking(false);
    });

    return () => unsub();
  }, [router]);

  // Show loading while checking authentication
  if (checking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4 className="alert-heading">Access Denied</h4>
          <p>You don&#39;t have permission to access this page.</p>
          <Link href="/" className="btn btn-primary">Return to Home</Link>
        </div>
      </div>
    );
  }

  // Render property specifications based on type
  const renderPropertySpecifications = () => {
    switch (selectedPropertyType) {
      case 'land':
        return (
          <>
            <div className="row">
              <div className="col-md-6 mb-4">
                <label htmlFor="land-size" className="form-label required-label">
                  Total Land Size <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input 
                    type="number" 
                    className={`form-control ${validationErrors.some(e => e.field === 'landSize') ? 'is-invalid' : ''}`}
                    id="land-size" 
                    min="0" 
                    step="0.01"
                    placeholder="0" 
                    value={propertyData.landSize || ''}
                    onChange={handleInputChange}
                    name="landSize"
                  />
                  <select 
                    className="form-select" 
                    id="size-unit" 
                    style={{maxWidth: "120px"}}
                    value={propertyData.sizeUnit}
                    onChange={handleInputChange}
                    name="sizeUnit"
                  >
                    <option value="m2">m²</option>
                    <option value="ft2">ft²</option>
                    <option value="acre">Acre</option>
                    <option value="hectare">Hectare</option>
                  </select>
                </div>
                <div className="form-text">Total area including all outdoor spaces</div>
              </div>
              <div className="col-md-6 mb-4">
                <label htmlFor="zoning" className="form-label">Zoning Type</label>
                <select 
                  className="form-select" 
                  id="zoning"
                  value={propertyData.zoning || ''}
                  onChange={handleInputChange}
                  name="zoning"
                >
                  <option value="">Select Zoning</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="agricultural">Agricultural</option>
                  <option value="mixed-use">Mixed-Use</option>
                  <option value="recreational">Recreational</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <label className="form-label mb-3">Utilities Available</label>
                <div className="land-utilities-grid">
                  {[
                    { id: 'water', label: 'Water Connection', key: 'water' },
                    { id: 'electricity', label: 'Electricity', key: 'electricity' },
                    { id: 'sewage', label: 'Sewage System', key: 'sewage' },
                    { id: 'road-access', label: 'Paved Road Access', key: 'roadAccess' }
                  ].map(utility => (
                    <div className="form-check" key={utility.id}>
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id={`${utility.id}-utility`}
                        checked={propertyData.utilities[utility.key as keyof PropertyData['utilities']]}
                        onChange={handleInputChange}
                        name={`utilities.${utility.key}`}
                      />
                      <label className="form-check-label" htmlFor={`${utility.id}-utility`}>
                        {utility.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      default:
        return (
          <>
            <div className="row">
              <div className="col-md-3 mb-4">
                <label htmlFor="bedrooms" className="form-label required-label">
                  Bedrooms <span className="text-danger">*</span>
                </label>
                <input 
                  type="number" 
                  className={`form-control ${validationErrors.some(e => e.field === 'bedrooms') ? 'is-invalid' : ''}`}
                  id="bedrooms" 
                  min="0" 
                  max="20"
                  placeholder="0" 
                  value={propertyData.bedrooms || ''}
                  onChange={handleInputChange}
                  name="bedrooms"
                />
                <div className="form-text">Enter 0 for studio apartments</div>
              </div>
              <div className="col-md-3 mb-4">
                <label htmlFor="bathrooms" className="form-label">Bathrooms</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id="bathrooms" 
                  min="0" 
                  max="20"
                  step="0.5" 
                  placeholder="0" 
                  value={propertyData.bathrooms || ''}
                  onChange={handleInputChange}
                  name="bathrooms"
                />
                <div className="form-text">0.5 = toilet only</div>
              </div>
              <div className="col-md-3 mb-4">
                <label htmlFor="garage" className="form-label">Garage Spaces</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id="garage" 
                  min="0" 
                  max="10"
                  placeholder="0" 
                  value={propertyData.garage || ''}
                  onChange={handleInputChange}
                  name="garage"
                />
              </div>
              <div className="col-md-3 mb-4">
                <label htmlFor="year-built" className="form-label">Year Built</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id="year-built" 
                  min="1800" 
                  max={new Date().getFullYear() + 1}
                  placeholder="YYYY" 
                  value={propertyData.yearBuilt || ''}
                  onChange={handleInputChange}
                  name="yearBuilt"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-4">
                <label htmlFor="building-size" className="form-label required-label">
                  Building Size <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input 
                    type="number" 
                    className={`form-control ${validationErrors.some(e => e.field === 'buildingSize') ? 'is-invalid' : ''}`}
                    id="building-size" 
                    min="0" 
                    step="0.1"
                    placeholder="0" 
                    value={propertyData.buildingSize || ''}
                    onChange={handleInputChange}
                    name="buildingSize"
                  />
                  <select 
                    className="form-select" 
                    id="size-unit" 
                    style={{maxWidth: "100px"}}
                    value={propertyData.sizeUnit}
                    onChange={handleInputChange}
                    name="sizeUnit"
                  >
                    <option value="m2">m²</option>
                    <option value="ft2">ft²</option>
                    <option value="sqm">sqm</option>
                    <option value="sqft">sqft</option>
                  </select>
                </div>
                <div className="form-text">Size of the building structure (excluding outdoor areas)</div>
              </div>
              
              <div className="col-md-6 mb-4">
                <label htmlFor="land-size" className="form-label">
                  Total Land Size
                </label>
                <div className="input-group">
                  <input 
                    type="number" 
                    className="form-control" 
                    id="land-size" 
                    min="0" 
                    step="0.01"
                    placeholder="0" 
                    value={propertyData.landSize || ''}
                    onChange={handleInputChange}
                    name="landSize"
                  />
                  <select 
                    className="form-select" 
                    id="land-size-unit" 
                    style={{maxWidth: "120px"}}
                    value={propertyData.sizeUnit}
                    onChange={handleInputChange}
                    name="sizeUnit"
                    disabled
                  >
                    <option value="m2">m²</option>
                    <option value="ft2">ft²</option>
                    <option value="acre">Acre</option>
                    <option value="hectare">Hectare</option>
                  </select>
                </div>
                <div className="form-text">Total property area including garden, pool, driveway, etc.</div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Size Guide:</strong> 
                  <ul className="mb-0 mt-2">
                    <li><strong>Building Size:</strong> Interior living space only (house/apartment structure)</li>
                    <li><strong>Land Size:</strong> Total property area including all outdoor spaces</li>
                    <li>For apartments, land size typically equals building size</li>
                    <li>For villas/houses, land size includes garden, pool, driveway, etc.</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  // Helper function to format price display
  const formatPriceDisplay = () => {
    const parts = [];
    if (propertyData.salePrice) {
      parts.push(`$${propertyData.salePrice.toLocaleString()} (Sale)`);
    }
    if (propertyData.rentPrice) {
      parts.push(`$${propertyData.rentPrice.toLocaleString()}/month (Rent)`);
    }
    return parts.join(' • ');
  };

  return (
    <main className="main">
      {/* Page Title */}
      <div className="page-title">
        <div className="heading">
          <div className="container">
            <div className="row d-flex justify-content-center text-center">
              <div className="col-lg-8">
                <h1 className="heading-title">Add New Property</h1>
                <p className="mb-0">
                  List your property with us and reach thousands of potential buyers. Fill in the details below to get started.
                </p>
              </div>
            </div>
          </div>
        </div>
        <nav className="breadcrumbs">
          <div className="container">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/admin">Admin</Link></li>
              <li className="current">Add New Property</li>
            </ol>
          </div>
        </nav>
      </div>
      {/* End Page Title */}

      {/* Add Property Form Section */}
      <section id="add-property" className="add-property section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">

          {/* Progress Indicator */}
          <div className="step-indicator">
            {[1, 2, 3, 4, 5].map(step => (
              <div 
                key={step}
                className={`step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
                data-step={step}
              >
                <div className="step-number">{step}</div>
                <div className="step-label">
                  {step === 1 && 'Basic Info'}
                  {step === 2 && 'Details'}
                  {step === 3 && 'Features'}
                  {step === 4 && 'Media'}
                  {step === 5 && 'Review'}
                </div>
              </div>
            ))}
          </div>

          {/* Form Progress */}
          <div className="progress-bar mb-4">
            <div className="progress-fill" style={{width: `${progressPercentage}%`}}></div>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="alert alert-danger">
              <h5 className="alert-heading">Please fix the following errors:</h5>
              <ul className="mb-0">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="form-step active">
              <div className="form-section">
                <h4><i className="bi bi-info-circle me-2"></i>Basic Information</h4>

                <div className="row">
                  <div className="col-md-12 mb-4">
                    <label htmlFor="property-title" className="form-label required-label">
                      Property Title <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={`form-control ${validationErrors.some(e => e.field === 'title') ? 'is-invalid' : ''}`}
                      id="property-title" 
                      placeholder="e.g., Modern Luxury Villa with Pool" 
                      value={propertyData.title}
                      onChange={handleInputChange}
                      name="title"
                      required
                    />
                    <div className="form-text">Make it descriptive and appealing to potential buyers</div>
                    <div className="form-text text-muted">
                      Character count: {propertyData.title.length} (Minimum 10 characters)
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label className="form-label required-label">
                      Property Type <span className="text-danger">*</span>
                    </label>
                    <div className="row g-3" id="property-type-selection">
                      {propertyTypes.map(({type, icon, label}) => (
                        <div className="col-6 col-md-4 col-lg-3" key={type}>
                          <button
                            type="button"
                            className={`property-type-btn ${selectedPropertyType === type ? 'active' : ''} ${validationErrors.some(e => e.field === 'propertyType') ? 'border-danger' : ''}`}
                            data-type={type}
                            onClick={() => handlePropertyTypeSelect(type)}
                          >
                            <i className={`bi ${icon}`}></i>
                            <div>{label}</div>
                          </button>
                        </div>
                      ))}
                    </div>
                    {validationErrors.some(e => e.field === 'propertyType') && (
                      <div className="text-danger small mt-1">Please select a property type</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-4">
                    <label className="form-label required-label">
                      Property Status <span className="text-danger">*</span>
                    </label>
                    <div className="property-status-buttons">
                      <div className="btn-group w-100" role="group">
                        {statusOptions.map(status => (
                          <div key={status}>
                            <input 
                              type="checkbox" 
                              className="btn-check" 
                              name={`status-${status}`}
                              id={`status-${status.toLowerCase().replace(' ', '-')}`}
                              checked={propertyData.status.includes(status)}
                              onChange={() => toggleStatus(status)}
                            />
                            <label 
                              className={`btn btn-outline-primary ${propertyData.status.includes(status) ? 'active' : ''}`}
                              htmlFor={`status-${status.toLowerCase().replace(' ', '-')}`}
                            >
                              {status}
                              {propertyData.status.includes(status) && (
                                <i className="bi bi-check-lg ms-1"></i>
                              )}
                            </label>
                          </div>
                        ))}
                      </div>
                      {validationErrors.some(e => e.field === 'status') && (
                        <div className="text-danger small mt-1">Please select at least one status</div>
                      )}
                      <div className="form-text mt-2">
                        You can select multiple statuses (e.g., &#34;For Sale&#34; and &#34;For Rent&#34;)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Price Fields Based on Selected Status */}
                <div className="row">
                  {propertyData.status.includes('For Sale') && (
                    <div className="col-md-6 mb-4">
                      <label htmlFor="sale-price" className="form-label required-label">
                        Sale Price <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input 
                          type="number" 
                          className={`form-control ${validationErrors.some(e => e.field === 'salePrice') ? 'is-invalid' : ''}`}
                          id="sale-price" 
                          placeholder="0.00" 
                          min="0" 
                          step="0.01" 
                          value={propertyData.salePrice || ''}
                          onChange={handleInputChange}
                          name="salePrice"
                        />
                        <span className="input-group-text">total</span>
                      </div>
                      {propertyData.salePrice && propertyData.salePrice > 0 && (
                        <div className="form-text">
                          Formatted: ${propertyData.salePrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {propertyData.status.includes('For Rent') && (
                    <div className="col-md-6 mb-4">
                      <label htmlFor="rent-price" className="form-label required-label">
                        Rent Price <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input 
                          type="number" 
                          className={`form-control ${validationErrors.some(e => e.field === 'rentPrice') ? 'is-invalid' : ''}`}
                          id="rent-price" 
                          placeholder="0.00" 
                          min="0" 
                          step="0.01" 
                          value={propertyData.rentPrice || ''}
                          onChange={handleInputChange}
                          name="rentPrice"
                        />
                        <span className="input-group-text">/month</span>
                      </div>
                      {propertyData.rentPrice && propertyData.rentPrice > 0 && (
                        <div className="form-text">
                          Formatted: ${propertyData.rentPrice.toLocaleString()}/month
                        </div>
                      )}
                    </div>
                  )}

                  {propertyData.status.includes('Sold') && (
                    <div className="col-md-12 mb-4">
                      <div className="alert alert-warning">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        <strong>Property is marked as Sold.</strong> Price information is not required for sold properties.
                      </div>
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-12 mb-4">
                    <label htmlFor="description" className="form-label required-label">
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea 
                      className={`form-control ${validationErrors.some(e => e.field === 'description') ? 'is-invalid' : ''}`}
                      id="description" 
                      rows={5}
                      placeholder="Describe your property in detail. Include key features, neighborhood information, and unique selling points. You can mention 'For Sale or For Rent' if applicable." 
                      value={propertyData.description}
                      onChange={handleInputChange}
                      name="description"
                      required
                    ></textarea>
                    <div className="form-text">
                      Character count: {propertyData.description.length} (Minimum 100 characters recommended)
                    </div>
                    <div className="form-text text-muted">
                      Example: &#34;Villa For Sale or for rent at Kedungu Tabanan 30 mins from Canggu located at quiet and peaceful Area. Now is under renovation&#34;
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4><i className="bi bi-geo-alt me-2"></i>Location Details</h4>

                <div className="row">
                  <div className="col-md-8 mb-4">
                    <label htmlFor="address" className="form-label required-label">
                      Full Address <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={`form-control ${validationErrors.some(e => e.field === 'address') ? 'is-invalid' : ''}`}
                      id="address" 
                      placeholder="e.g., 1234 Maple Street, Beverly Hills" 
                      value={propertyData.address}
                      onChange={handleInputChange}
                      name="address"
                      required 
                    />
                  </div>
                  <div className="col-md-4 mb-4">
                    <label htmlFor="city" className="form-label required-label">
                      City <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className={`form-control ${validationErrors.some(e => e.field === 'city') ? 'is-invalid' : ''}`}
                      id="city" 
                      placeholder="e.g., Los Angeles" 
                      value={propertyData.city}
                      onChange={handleInputChange}
                      name="city"
                      required 
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 mb-4">
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="show-address" 
                        checked={propertyData.showAddress}
                        onChange={handleInputChange}
                        name="showAddress"
                      />
                      <label className="form-check-label" htmlFor="show-address">
                        Show exact address to potential buyers
                      </label>
                      <div className="form-text text-muted">
                        If unchecked, only the general area will be shown to protect privacy
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div id="location-map" className="location-map-placeholder">
                      <div className="text-center py-5">
                        <i className="bi bi-map" style={{fontSize: "3rem", color: "#6c757d"}}></i>
                        <p className="mt-2">Map integration available with Google Maps API</p>
                        <button type="button" className="btn btn-outline-primary btn-sm mt-2" disabled>
                          <i className="bi bi-pin-map"></i> Set Location on Map
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <div>
                  <button type="button" className="btn btn-outline-secondary" onClick={saveAsDraft}>
                    <i className="bi bi-save"></i> Save Draft
                  </button>
                </div>
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  Next: Property Details <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Property Details */}
          {currentStep === 2 && (
            <div className="form-step active">
              <div className="form-section">
                <h4><i className="bi bi-rulers me-2"></i>Property Specifications</h4>
                {renderPropertySpecifications()}
              </div>

              <div className="form-section">
                <h4><i className="bi bi-tags me-2"></i>Property Labels</h4>
                <p className="text-muted mb-4">Select labels that apply to your property to help it stand out</p>

                <div className="row g-3">
                  {featureTags.map(tag => (
                    <div className="col-md-6" key={tag.id}>
                      <div 
                        className={`feature-tag-card ${selectedFeatures.has(tag.id) ? 'active' : ''}`}
                        onClick={() => toggleFeatureTag(tag.id)}
                      >
                        <div className="d-flex align-items-center">
                          <div className="feature-icon">
                            <i className={`bi ${tag.icon}`}></i>
                          </div>
                          <div className="ms-3">
                            <h6 className="mb-0">{tag.label}</h6>
                            <p className="text-muted small mb-0">{tag.description}</p>
                          </div>
                          <div className="ms-auto">
                            <input 
                              type="checkbox" 
                              checked={selectedFeatures.has(tag.id)}
                              onChange={() => {}}
                              className="form-check-input"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
                  <i className="bi bi-arrow-left"></i> Back to Basic Info
                </button>
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  Next: Features & Amenities <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Amenities & Features */}
          {currentStep === 3 && (
            <div className="form-step active">
              <div className="form-section">
                <h4><i className="bi bi-house-door me-2"></i>Interior Features</h4>
                {interiorFeaturesList.map((category, index) => (
                  <div key={index} className="mb-4">
                    <h6 className="text-primary mb-3">{category.category}</h6>
                    <div className="row g-2">
                      {category.features.map(feature => (
                        <div className="col-md-6 col-lg-4" key={feature}>
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id={`int-${feature.toLowerCase().replace(/[ /]/g, '-')}`}
                              checked={interiorFeatures.has(feature)}
                              onChange={() => toggleInteriorFeature(feature)}
                            />
                            <label className="form-check-label" htmlFor={`int-${feature.toLowerCase().replace(/[ /]/g, '-')}`}>
                              {feature}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-section">
                <h4><i className="bi bi-tree me-2"></i>Exterior Features</h4>
                {exteriorFeaturesList.map((category, index) => (
                  <div key={index} className="mb-4">
                    <h6 className="text-primary mb-3">{category.category}</h6>
                    <div className="row g-2">
                      {category.features.map(feature => (
                        <div className="col-md-6 col-lg-4" key={feature}>
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id={`ext-${feature.toLowerCase().replace(/[ /]/g, '-')}`}
                              checked={exteriorFeatures.has(feature)}
                              onChange={() => toggleExteriorFeature(feature)}
                            />
                            <label className="form-check-label" htmlFor={`ext-${feature.toLowerCase().replace(/[ /]/g, '-')}`}>
                              {feature}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-section">
                <h4><i className="bi bi-plus-circle me-2"></i>Custom Features</h4>
                <div className="mb-3">
                  <label htmlFor="custom-features" className="form-label">
                    Add custom features not listed above
                  </label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="custom-features" 
                    placeholder="e.g., Wine cellar, Home theater, Sauna, Solar panels"
                    onChange={handleCustomFeatures}
                  />
                  <div className="form-text">
                    Separate features with commas. {propertyData.customFeatures.length} features added.
                  </div>
                  
                  {propertyData.customFeatures.length > 0 && (
                    <div className="mt-3">
                      <div className="d-flex flex-wrap gap-2">
                        {propertyData.customFeatures.map((feature, index) => (
                          <span key={index} className="badge bg-secondary">
                            {feature} <button 
                              type="button" 
                              className="btn-close btn-close-white ms-1" 
                              style={{fontSize: '0.5rem'}}
                              onClick={() => {
                                setPropertyData(prev => ({
                                  ...prev,
                                  customFeatures: prev.customFeatures.filter((_, i) => i !== index)
                                }));
                              }}
                            ></button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
                  <i className="bi bi-arrow-left"></i> Back to Details
                </button>
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  Next: Media & Images <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Media & Images */}
          {currentStep === 4 && (
            <div className="form-step active">
              <div className="form-section">
                <h4><i className="bi bi-images me-2"></i>Property Images</h4>
                <p className="text-muted mb-4">
                  Upload high-quality images of your property. First image will be the cover photo.
                  {validationErrors.some(e => e.field === 'images') && (
                    <span className="text-danger ms-2">At least one image is required</span>
                  )}
                </p>

                <div className="mb-4">
                  <div 
                    id="image-dropzone" 
                    className={`dropzone ${isDragging ? 'dragging' : ''} ${validationErrors.some(e => e.field === 'images') ? 'border-danger' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    ref={dropzoneRef}
                  >
                    <i className={`bi bi-cloud-arrow-up ${isDragging ? 'text-primary' : ''}`} style={{fontSize: "3rem"}}></i>
                    <h5 className="mt-3">
                      {isDragging ? 'Drop images here' : 'Drag & drop images or click to browse'}
                    </h5>
                    <p className="text-muted">Supported formats: JPG, PNG, WEBP (Max 5MB each)</p>
                    <button type="button" className="btn btn-outline-primary mt-2">
                      <i className="bi bi-folder2-open me-2"></i> Browse Files
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      style={{display: 'none'}}
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="mb-4">
                    <h6>Uploaded Images ({uploadedImages.length})</h6>
                    <div className="image-preview-container">
                      {uploadedImages.map((image, index) => (
                        <div className="image-preview" key={index}>
                          <div className="image-preview-inner">
                            <img src={image} alt={`Property ${index + 1}`} />
                            <div className="image-actions">
                              <button 
                                type="button" 
                                className="btn btn-sm btn-danger"
                                onClick={() => removeImage(index)}
                                title="Remove image"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                              {index === 0 && (
                                <span className="badge bg-primary">Cover</span>
                              )}
                            </div>
                            <div className="image-number">{index + 1}</div>
                          </div>
                          {index === 0 && (
                            <div className="image-label text-center small mt-1">Cover Image</div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2">
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          if (uploadedImages.length > 1) {
                            const newOrder = [...uploadedImages];
                            const first = newOrder.shift();
                            if (first) newOrder.push(first);
                            setUploadedImages(newOrder);
                            setPropertyData(prev => ({ ...prev, images: newOrder }));
                          }
                        }}
                      >
                        <i className="bi bi-arrow-clockwise me-1"></i> Rotate Cover Image
                      </button>
                    </div>
                  </div>
                )}

                <div className="alert alert-info mt-4">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Image Tips:</strong> Include photos of all rooms, exterior views, amenities, and neighborhood features. 
                  High-quality photos can increase views by up to 40%. Recommended order: Exterior, Living room, Kitchen, Bedrooms, Bathrooms, Amenities.
                </div>
              </div>

              <div className="form-section">
                <h4><i className="bi bi-camera-video me-2"></i>Virtual Tour & Videos</h4>

                <div className="mb-4">
                  <label htmlFor="video-url" className="form-label">Video URL (YouTube, Vimeo)</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    id="video-url" 
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={propertyData.videoUrl || ''}
                    onChange={handleInputChange}
                    name="videoUrl"
                  />
                  <div className="form-text">Add a link to a video tour of your property</div>
                </div>

                <div className="mb-4">
                  <label htmlFor="virtual-tour" className="form-label">Virtual Tour URL</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    id="virtual-tour" 
                    placeholder="https://myvirtualtour.com/..."
                    value={propertyData.virtualTourUrl || ''}
                    onChange={handleInputChange}
                    name="virtualTourUrl"
                  />
                  <div className="form-text">Link to a 360° virtual tour if available</div>
                </div>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
                  <i className="bi bi-arrow-left"></i> Back to Features
                </button>
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  Next: Review & Publish <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Review & Agent Info */}
          {currentStep === 5 && (
            <div className="form-step active">
              <div className="form-section">
                <h4><i className="bi bi-person-circle me-2"></i>Agent Information</h4>

                <div className="row">
                  <div className="col-md-12 mb-4">
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox"
                        id="show-agent"
                        checked={propertyData.showAgent}
                        onChange={handleInputChange}
                        name="showAgent"
                      />
                      <label className="form-check-label" htmlFor="show-agent">
                        <strong>Show agent information on listing</strong>
                      </label>
                      <div className="form-text">
                        If enabled, agent contact information will be visible to potential buyers
                      </div>
                    </div>
                  </div>
                </div>

                {propertyData.showAgent && (
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6 className="card-title">Agent Details</h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="agent-name" className="form-label">Agent Name</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="agent-name" 
                            placeholder="e.g., Sarah Johnson"
                            value={propertyData.agent?.name || ''}
                            onChange={(e) => setPropertyData(prev => ({
                              ...prev,
                              agent: { ...(prev.agent || { name: '', title: '', phone: '', email: '' }), name: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="agent-title" className="form-label">Agent Title</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="agent-title" 
                            placeholder="e.g., Licensed Real Estate Agent"
                            value={propertyData.agent?.title || ''}
                            onChange={(e) => setPropertyData(prev => ({
                              ...prev,
                              agent: { ...(prev.agent || { name: '', title: '', phone: '', email: '' }), title: e.target.value }
                            }))}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="agent-phone" className="form-label">Phone Number</label>
                          <input 
                            type="tel" 
                            className="form-control" 
                            id="agent-phone" 
                            placeholder="+1 (555) 123-4567"
                            value={propertyData.agent?.phone || ''}
                            onChange={(e) => setPropertyData(prev => ({
                              ...prev,
                              agent: { ...(prev.agent || { name: '', title: '', phone: '', email: '' }), phone: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="agent-email" className="form-label">Email Address</label>
                          <input 
                            type="email" 
                            className="form-control" 
                            id="agent-email" 
                            placeholder="agent@example.com"
                            value={propertyData.agent?.email || ''}
                            onChange={(e) => setPropertyData(prev => ({
                              ...prev,
                              agent: { ...(prev.agent || { name: '', title: '', phone: '', email: '' }), email: e.target.value }
                            }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-section">
                <h4><i className="bi bi-eye me-2"></i>Review Your Listing</h4>

                <div className="alert alert-success">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-3" style={{fontSize: '2rem'}}></i>
                    <div>
                      <h5 className="alert-heading mb-1">Ready to Publish!</h5>
                      <p className="mb-0">Review all the information below before publishing your property listing.</p>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="card mb-3">
                      <div className="card-body">
                        <h6 className="card-title"><i className="bi bi-file-text me-2"></i>Property Summary</h6>
                        <div className="property-summary">
                          <div className="mb-3">
                            <p className="mb-1"><strong>Title:</strong> {propertyData.title || 'Not set'}</p>
                            <p className="mb-1"><strong>Type:</strong> {propertyData.propertyType ? propertyData.propertyType.charAt(0).toUpperCase() + propertyData.propertyType.slice(1) : 'Not set'}</p>
                            <p className="mb-1"><strong>Status:</strong> {propertyData.status.join(' & ') || 'Not set'}</p>
                            {propertyData.salePrice && (
                              <p className="mb-1"><strong>Sale Price:</strong> ${propertyData.salePrice.toLocaleString()}</p>
                            )}
                            {propertyData.rentPrice && (
                              <p className="mb-1"><strong>Rent Price:</strong> ${propertyData.rentPrice.toLocaleString()}/month</p>
                            )}
                          </div>
                          <div className="mb-3">
                            <p className="mb-1"><strong>Location:</strong> {propertyData.address || 'Not set'}, {propertyData.city || 'Not set'}</p>
                            <p className="mb-1"><strong>Show Address:</strong> {propertyData.showAddress ? 'Yes' : 'No'}</p>
                          </div>
                          <div className="mb-3">
                            <p className="mb-1"><strong>Building Size:</strong> {propertyData.buildingSize ? `${propertyData.buildingSize} ${propertyData.sizeUnit}` : 'Not set'}</p>
                            {propertyData.landSize && (
                              <p className="mb-1"><strong>Land Size:</strong> {propertyData.landSize} {propertyData.sizeUnit}</p>
                            )}
                            <p className="mb-1"><strong>Bedrooms:</strong> {propertyData.bedrooms ?? 'Not set'}</p>
                            <p className="mb-1"><strong>Bathrooms:</strong> {propertyData.bathrooms ?? 'Not set'}</p>
                          </div>
                          <div className="mb-3">
                            <p className="mb-1"><strong>Images:</strong> {propertyData.images.length} uploaded</p>
                            <p className="mb-1"><strong>Features:</strong> {interiorFeatures.size + exteriorFeatures.size} selected</p>
                            <p className="mb-1"><strong>Labels:</strong> {Array.from(selectedFeatures).map(f => featureTags.find(t => t.id === f)?.label).filter(Boolean).join(', ') || 'None'}</p>
                          </div>
                          {propertyData.showAgent && propertyData.agent?.name && (
                            <div className="mb-3">
                              <p className="mb-1"><strong>Agent:</strong> {propertyData.agent.name}</p>
                              <p className="mb-1"><strong>Contact:</strong> {propertyData.agent.phone || 'Not provided'}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">
                        <h6 className="card-title"><i className="bi bi-eye me-2"></i>Listing Preview</h6>
                        <div className="property-preview">
                          <div className="preview-image mb-3">
                            {uploadedImages.length > 0 ? (
                              <img 
                                src={uploadedImages[0]} 
                                alt="Property" 
                                className="img-fluid rounded"
                              />
                            ) : (
                              <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{height: '150px'}}>
                                <i className="bi bi-house text-muted" style={{fontSize: "3rem"}}></i>
                              </div>
                            )}
                          </div>
                          <h6 className="preview-title">{propertyData.title || 'Property Title'}</h6>
                          <div className="preview-price mb-2">
                            {propertyData.salePrice && (
                              <p className="text-primary mb-1">
                                <strong>${propertyData.salePrice.toLocaleString()}</strong> (Sale)
                              </p>
                            )}
                            {propertyData.rentPrice && (
                              <p className="text-primary mb-1">
                                <strong>${propertyData.rentPrice.toLocaleString()}/month</strong> (Rent)
                              </p>
                            )}
                          </div>
                          <p className="preview-location text-muted small mb-3">
                            <i className="bi bi-geo-alt"></i> {propertyData.city || 'City'}
                          </p>
                          <div className="preview-features d-flex justify-content-between text-muted small">
                            {propertyData.bedrooms !== undefined && (
                              <span><i className="bi bi-door-closed"></i> {propertyData.bedrooms} Bed</span>
                            )}
                            {propertyData.bathrooms !== undefined && (
                              <span><i className="bi bi-droplet"></i> {propertyData.bathrooms} Bath</span>
                            )}
                            {propertyData.buildingSize && (
                              <span><i className="bi bi-arrows-angle-expand"></i> {propertyData.buildingSize} {propertyData.sizeUnit}</span>
                            )}
                          </div>
                          <div className="preview-status mt-2">
                            {propertyData.status.map(status => (
                              <span key={status} className="badge bg-primary me-1">{status}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-check mt-4">
                  <input className="form-check-input" type="checkbox" id="terms-agreement" required />
                  <label className="form-check-label" htmlFor="terms-agreement">
                    I agree to the <Link href="/terms" className="text-primary">Terms of Service</Link> and confirm that all information provided is accurate.
                    I understand that providing false information may result in listing removal.
                  </label>
                </div>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
                  <i className="bi bi-arrow-left"></i> Back to Media
                </button>
                <div>
                  <button type="button" className="btn btn-outline-primary me-2" onClick={saveAsDraft}>
                    <i className="bi bi-save"></i> Save as Draft
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-success" 
                    onClick={submitProperty}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i> Publish Property
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}