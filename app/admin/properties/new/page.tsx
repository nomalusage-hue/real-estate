// // app/admin/properties/new/page.tsx
// "use client";

// import { useState, useEffect, useRef, ChangeEvent } from 'react';
// import Link from 'next/link';
// // import { useIsAdmin } from "@/hooks/useIsAdmin";
// import { useRouter } from "next/navigation";
// import "./styles.css"
// import { PropertyService } from '@/services/PropertyService';
// import { ImageUploadService } from '@/services/ImageUploadService';
// // import { useIsAdmin } from '@/hooks/useIsAdmin';
// import { onAuthStateChanged } from 'firebase/auth';
// import { firebaseAuth } from '@/config/firebase';
// import { checkIfAdmin } from '@/utils/checkIfAdmin';
// // import { useRouter } from 'next/router';


// interface PropertyData {
//   id: string;
//   title: string;
//   description: string;
//   propertyType: string;
//   price: number;
//   status: 'For Sale' | 'For Rent' | 'Sold';
//   address: string;
//   city: string;
//   showAddress: boolean;
//   images: string[];
//   bedrooms?: number;
//   bathrooms?: number;
//   areaSize?: number;
//   areaUnit: string;
//   yearBuilt?: number;
//   garage?: number;
//   lotSize?: number;
//   lotSizeUnit: string;
//   zoning?: string;
//   utilities: {
//     water: boolean;
//     electricity: boolean;
//     sewage: boolean;
//     roadAccess: boolean;
//   };
//   hot: boolean;
//   newListing: boolean;
//   featured: boolean;
//   exclusive: boolean;
//   interiorFeatures: string[];
//   exteriorFeatures: string[];
//   customFeatures: string[];
//   videoUrl?: string;
//   virtualTourUrl?: string;
//   showAgent: boolean;
//   agent?: {
//     name: string;
//     title: string;
//     phone: string;
//     email: string;
//     photo?: File;
//   };
// }

// export default function NewPropertyPage() {
//   // const isAdmin = useIsAdmin();
//   const router = useRouter();
//   const [currentStep, setCurrentStep] = useState<number>(1);
//   const [selectedPropertyType, setSelectedPropertyType] = useState<string>('');
//   const [uploadedImages, setUploadedImages] = useState<string[]>([]);
//   const [selectedImages, setSelectedImages] = useState<File[]>([]);
//   const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
//   const [interiorFeatures, setInteriorFeatures] = useState<Set<string>>(new Set());
//   const [exteriorFeatures, setExteriorFeatures] = useState<Set<string>>(new Set());
//   const dropzoneRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [checking, setChecking] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const [propertyData, setPropertyData] = useState<PropertyData>({
//     id: '',
//     title: '',
//     description: '',
//     propertyType: '',
//     price: 0,
//     status: 'For Sale',
//     address: '',
//     city: '',
//     showAddress: true,
//     images: [],
//     areaUnit: 'm2',
//     lotSizeUnit: 'm2',
//     utilities: {
//       water: false,
//       electricity: false,
//       sewage: false,
//       roadAccess: false
//     },
//     hot: false,
//     newListing: false,
//     featured: false,
//     exclusive: false,
//     interiorFeatures: [],
//     exteriorFeatures: [],
//     customFeatures: [],
//     showAgent: true,
//   });

//   const totalSteps = 5;
//   const progressPercentage = (currentStep / totalSteps) * 100;

//   // Property types
//   const propertyTypes = [
//     { type: 'house', icon: 'bi-house-door', label: 'House' },
//     { type: 'apartment', icon: 'bi-building', label: 'Apartment' },
//     { type: 'villa', icon: 'bi-house-heart', label: 'Villa' },
//     { type: 'commercial', icon: 'bi-shop', label: 'Commercial' },
//     { type: 'land', icon: 'bi-tree', label: 'Land' },
//   ];

//   // Feature tags
//   const featureTags = [
//     { id: 'hot', icon: 'bi-fire', label: 'Hot Property' },
//     { id: 'newListing', icon: 'bi-star', label: 'New Listing' },
//     { id: 'featured', icon: 'bi-gem', label: 'Featured' },
//     { id: 'exclusive', icon: 'bi-shield-lock', label: 'Exclusive' },
//   ];

//   // Interior features
//   const interiorFeaturesList = [
//     'Hardwood Floors',
//     'Updated Kitchen',
//     'Walk-in Closets',
//     'Central Air Conditioning',
//     'Fireplace',
//     'High Ceilings',
//     'Smart Home System',
//     'Home Office',
//     'Finished Basement',
//     'In-unit Laundry'
//   ];

//   // Exterior features
//   const exteriorFeaturesList = [
//     'Swimming Pool',
//     'Garden',
//     'Patio/Deck',
//     'Security System',
//     'Sprinkler System',
//     'BBQ Area',
//     'Playground',
//     'Tennis Court',
//     'Parking Lot',
//     'Roof Deck'
//   ];


//   // Handle property type selection
//   const handlePropertyTypeSelect = (type: string) => {
//     setSelectedPropertyType(type);
//     setPropertyData(prev => ({ ...prev, propertyType: type }));
//   };

//   // Toggle feature tag
//   const toggleFeatureTag = (feature: string) => {
//     setSelectedFeatures(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(feature)) {
//         newSet.delete(feature);
//       } else {
//         newSet.add(feature);
//       }
//       return newSet;
//     });
//   };

//   // Toggle interior feature
//   const toggleInteriorFeature = (feature: string) => {
//     setInteriorFeatures(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(feature)) {
//         newSet.delete(feature);
//       } else {
//         newSet.add(feature);
//       }
//       return newSet;
//     });
//   };

//   // Toggle exterior feature
//   const toggleExteriorFeature = (feature: string) => {
//     setExteriorFeatures(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(feature)) {
//         newSet.delete(feature);
//       } else {
//         newSet.add(feature);
//       }
//       return newSet;
//     });
//   };

//   // Handle input changes
//   const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
    
//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
//       if (name.startsWith('utilities.')) {
//         const utilityKey = name.split('.')[1] as keyof PropertyData['utilities'];
//         setPropertyData(prev => ({
//           ...prev,
//           utilities: {
//             ...prev.utilities,
//             [utilityKey]: checked
//           }
//         }));
//       } else {
//         setPropertyData(prev => ({ ...prev, [name]: checked }));
//       }
//     } else if (type === 'number') {
//       const numValue = value === '' ? undefined : parseFloat(value);
//       setPropertyData(prev => ({ ...prev, [name]: numValue }));
//     } else if (name === 'price') {
//       const numValue = parseFloat(value) || 0;
//       setPropertyData(prev => ({ ...prev, [name]: numValue }));
//     } else {
//       setPropertyData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   // Handle radio button changes
//   const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setPropertyData(prev => ({ ...prev, [name]: value }));
//   };

//   // // Handle file upload
//   // const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
//   //   const files = e.target.files;
//   //   if (!files) return;

//   //   const newImages: string[] = [];
//   //   Array.from(files).forEach(file => {
//   //     const reader = new FileReader();
//   //     reader.onload = (e) => {
//   //       const result = e.target?.result as string;
//   //       newImages.push(result);
//   //       setUploadedImages(prev => [...prev, result]);
//   //       setPropertyData(prev => ({
//   //         ...prev,
//   //         images: [...prev.images, result]
//   //       }));
//   //     };
//   //     reader.readAsDataURL(file);
//   //   });
//   // };


// // const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
// //   const files = e.target.files;
// //   if (!files) return;

// //   const fileArray = Array.from(files);

// //   // 1️⃣ Save original files for ImgBB
// //   setSelectedImages((prev) => [...prev, ...fileArray]);

// //   // 2️⃣ Generate preview URLs (NOT base64)
// //   const previews = fileArray.map((file) =>
// //     URL.createObjectURL(file)
// //   );

// //   setUploadedImages((prev) => [...prev, ...previews]);

// //   // 3️⃣ Keep propertyData clean (only previews for now)
// //   setPropertyData((prev) => ({
// //     ...prev,
// //     images: [...prev.images, ...previews],
// //   }));
// // };
// // Updated handleFileUpload function with validation
// const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
//   const files = e.target.files;
//   if (!files) return;

//   const validFiles = Array.from(files).filter(validateFile);
  
//   if (validFiles.length === 0) return;
  
//   const fileArray = Array.from(validFiles);

//   // 1️⃣ Save original files for ImgBB
//   setSelectedImages((prev) => [...prev, ...fileArray]);

//   // 2️⃣ Generate preview URLs (NOT base64)
//   const previews = fileArray.map((file) =>
//     URL.createObjectURL(file)
//   );

//   setUploadedImages((prev) => [...prev, ...previews]);

//   // 3️⃣ Keep propertyData clean (only previews for now)
//   setPropertyData((prev) => ({
//     ...prev,
//     images: [...prev.images, ...previews],
//   }));
// };


//   // Remove image
//   const removeImage = (index: number) => {
//     setUploadedImages(prev => prev.filter((_, i) => i !== index));
//     setPropertyData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//   };

//   // Handle custom features
//   const handleCustomFeatures = (e: ChangeEvent<HTMLInputElement>) => {
//     const features = e.target.value
//       .split(',')
//       .map(f => f.trim())
//       .filter(f => f.length > 0);
    
//     setPropertyData(prev => ({ ...prev, customFeatures: features }));
//   };

//   // Navigation functions
//   const nextStep = () => {
//     if (validateStep(currentStep)) {
//       setCurrentStep(prev => Math.min(prev + 1, totalSteps));
//       if (currentStep === totalSteps - 1) {
//         updateReviewSummary();
//       }
//     }
//   };

//   const prevStep = () => {
//     setCurrentStep(prev => Math.max(prev - 1, 1));
//   };

//   // Validate step
//   const validateStep = (step: number): boolean => {
//     switch (step) {
//       case 1:
//         if (!propertyData.title || !propertyData.propertyType || propertyData.price <= 0 || 
//             !propertyData.description || !propertyData.address || !propertyData.city) {
//           alert('Please fill all required fields marked with *');
//           return false;
//         }
//         return true;
//       case 2:
//         if (!selectedPropertyType) {
//           alert('Please select a property type');
//           return false;
//         }
//         return true;
//       default:
//         return true;
//     }
//   };

//   // Update review summary
//   const updateReviewSummary = () => {
//     // This function updates the UI in real-time through React state
//     // No need for manual DOM manipulation
//   };

//   // Generate ID
//   const generateId = (): string => {
//     return 'prop_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
//   };

//   // // Submit property
//   // const submitProperty = async () => {
//   //   const termsCheckbox = document.getElementById('terms-agreement') as HTMLInputElement;
//   //   if (!termsCheckbox?.checked) {
//   //     alert('Please agree to the Terms of Service before publishing.');
//   //     return;
//   //   }

//   //   // Validate final step
//   //   if (!validateStep(5)) {
//   //     alert('Please complete all required information.');
//   //     return;
//   //   }

//   //   // Gather all data
//   //   const finalData = {
//   //     ...propertyData,
//   //     id: generateId(),
//   //     hot: selectedFeatures.has('hot'),
//   //     newListing: selectedFeatures.has('newListing'),
//   //     featured: selectedFeatures.has('featured'),
//   //     exclusive: selectedFeatures.has('exclusive'),
//   //     interiorFeatures: Array.from(interiorFeatures),
//   //     exteriorFeatures: Array.from(exteriorFeatures)
//   //   };

//   //   if (!propertyData.showAgent) {
//   //     delete finalData.agent;
//   //   }

//   //   console.log('Property Data:', finalData);
    
//   //   // Here you would typically make an API call
//   //   try {
//   //     // await fetch('/api/properties', {
//   //     //   method: 'POST',
//   //     //   headers: { 'Content-Type': 'application/json' },
//   //     //   body: JSON.stringify(finalData)
//   //     // });
      
//   //     alert('Property published successfully!');
//   //     // router.push('/properties');
//   //   } catch (error) {
//   //     console.error('Error submitting property:', error);
//   //     alert('Failed to publish property. Please try again.');
//   //   }
//   // };



  
// const imageService = new ImageUploadService();
// const propertyService = new PropertyService();

// const submitProperty = async () => {
//   try {
//     const termsCheckbox = document.getElementById(
//       "terms-agreement"
//     ) as HTMLInputElement;

//     if (!termsCheckbox?.checked) {
//       alert("Please agree to the Terms of Service before publishing.");
//       return;
//     }

//     if (!validateStep(5)) {
//       alert("Please complete all required information.");
//       return;
//     }

//     /* 1️⃣ Upload images to ImgBB */
//     const uploadedImageUrls: string[] = [];

//     for (const file of selectedImages) {
//       const url = await imageService.upload(file);
//       uploadedImageUrls.push(url);
//     }

//     /* 2️⃣ Build final clean domain object */
//     const finalData = {
//       ...propertyData,
//       id: generateId(),
//       images: uploadedImageUrls,

//       hot: selectedFeatures.has("hot"),
//       newListing: selectedFeatures.has("newListing"),
//       featured: selectedFeatures.has("featured"),
//       exclusive: selectedFeatures.has("exclusive"),

//       interiorFeatures: Array.from(interiorFeatures),
//       exteriorFeatures: Array.from(exteriorFeatures),

//       createdAt: new Date().toISOString(),
//     };

//     if (!propertyData.showAgent) {
//       // delete (finalData as any).agent;
//       delete (finalData).agent;
//     }

//     /* 3️⃣ Save to Firebase (admin-only) */
//     await propertyService.create(finalData);

//     alert("Property published successfully!");
//     // router.push("/properties");

//   } catch (error) {
//     console.error("Error submitting property:", error);
//     alert("Failed to publish property. Please try again.");
//   }
// };

//   // Save as draft
//   const saveAsDraft = () => {
//     const draftData = {
//       ...propertyData,
//       hot: selectedFeatures.has('hot'),
//       newListing: selectedFeatures.has('newListing'),
//       featured: selectedFeatures.has('featured'),
//       exclusive: selectedFeatures.has('exclusive'),
//       interiorFeatures: Array.from(interiorFeatures),
//       exteriorFeatures: Array.from(exteriorFeatures)
//     };

//     localStorage.setItem('propertyDraft', JSON.stringify(draftData));
//     alert('Draft saved successfully!');
//   };


//   // useEffect(() => {
//   //     if (isAdmin === false) router.replace("/"); // redirect non-admin
//   // }, [isAdmin, router]);



// // Add to your state declarations:
// const [isDragging, setIsDragging] = useState(false);

// // File validation function
// const validateFile = (file: File): boolean => {
//   const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
//   const maxSize = 5 * 1024 * 1024; // 5MB
  
//   if (!validTypes.includes(file.type)) {
//     alert(`File type not supported: ${file.type}. Please upload JPG, PNG, or WEBP files.`);
//     return false;
//   }
  
//   if (file.size > maxSize) {
//     alert(`File ${file.name} is too large. Maximum size is 5MB.`);
//     return false;
//   }
  
//   return true;
// };

// // Drag event handlers
// const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
//   e.preventDefault();
//   e.stopPropagation();
//   setIsDragging(true);
// };

// const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//   e.preventDefault();
//   e.stopPropagation();
//   setIsDragging(false);
// };

// const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//   e.preventDefault();
//   e.stopPropagation();
//   if (!isDragging) setIsDragging(true);
// };

// const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//   e.preventDefault();
//   e.stopPropagation();
//   setIsDragging(false);
  
//   const files = e.dataTransfer.files;
//   if (!files || files.length === 0) return;

//   const validFiles = Array.from(files).filter(validateFile);
  
//   if (validFiles.length === 0) return;
  
//   const fileArray = Array.from(validFiles);
  
//   // 1️⃣ Save original files for ImgBB
//   setSelectedImages((prev) => [...prev, ...fileArray]);

//   // 2️⃣ Generate preview URLs
//   const previews = fileArray.map((file) => URL.createObjectURL(file));

//   setUploadedImages((prev) => [...prev, ...previews]);

//   // 3️⃣ Update property data
//   setPropertyData((prev) => ({
//     ...prev,
//     images: [...prev.images, ...previews],
//   }));
// };





//   // Load draft if exists
//   useEffect(() => {
//     const savedDraft = localStorage.getItem('propertyDraft');
//     if (savedDraft) {
//       const draft = JSON.parse(savedDraft);
//       setPropertyData(draft);
//       if (draft.propertyType) setSelectedPropertyType(draft.propertyType);
//       if (draft.images) setUploadedImages(draft.images);
//     }
//   }, []);

//   // Update propertyData when features change
//   useEffect(() => {
//     setPropertyData(prev => ({
//       ...prev,
//       hot: selectedFeatures.has('hot'),
//       newListing: selectedFeatures.has('newListing'),
//       featured: selectedFeatures.has('featured'),
//       exclusive: selectedFeatures.has('exclusive')
//     }));
//   }, [selectedFeatures]);

//   useEffect(() => {
//     return () => {
//       uploadedImages.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [uploadedImages]);


// useEffect(() => {
//   const unsub = onAuthStateChanged(firebaseAuth, async (user) => {
//     if (!user) {
//       router.replace("/login");
//       return;
//     }

//     // Example admin check (Firestore / claims / API)
//     const admin = await checkIfAdmin(user);
//     // const admin = await isAdmin(user);

//     if (!admin) {
//       router.replace("/");
//       return;
//     }

//     setIsAdmin(true);
//     setChecking(false);
//   });

//   return () => unsub();
// }, [router]);

// // ⛔ BLOCK rendering
// if (checking) {
//   return null; // or <LoadingScreen />
// }

//   return (
//     <main className="main">

//       {/* Page Title */}
//       <div className="page-title">
//         <div className="heading">
//           <div className="container">
//             <div className="row d-flex justify-content-center text-center">
//               <div className="col-lg-8">
//                 <h1 className="heading-title">Add New Property</h1>
//                 <p className="mb-0">
//                   List your property with us and reach thousands of potential buyers. Fill in the details below to get started.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <nav className="breadcrumbs">
//           <div className="container">
//             <ol>
//               <li><Link href="/">Home</Link></li>
//               <li><Link href="/properties">Properties</Link></li>
//               <li className="current">Add New Property</li>
//             </ol>
//           </div>
//         </nav>
//       </div>
//       {/* End Page Title */}

//       {/* Add Property Form Section */}
//       <section id="add-property" className="add-property section">
//         <div className="container" data-aos="fade-up" data-aos-delay="100">

//           {/* Progress Indicator */}
//           <div className="step-indicator">
//             {[1, 2, 3, 4, 5].map(step => (
//               <div 
//                 key={step}
//                 className={`step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
//                 data-step={step}
//               >
//                 <div className="step-number">{step}</div>
//                 <div className="step-label">
//                   {step === 1 && 'Basic Info'}
//                   {step === 2 && 'Details'}
//                   {step === 3 && 'Amenities'}
//                   {step === 4 && 'Media'}
//                   {step === 5 && 'Review'}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Form Progress */}
//           <div className="progress-bar mb-4">
//             <div className="progress-fill" id="form-progress" style={{width: `${progressPercentage}%`}}></div>
//           </div>

//           {/* Step 1: Basic Information */}
//           {currentStep === 1 && (
//             <div className="form-step active" id="step-1">
//               <div className="form-section">
//                 <h4><i className="bi bi-info-circle me-2"></i>Basic Information</h4>

//                 <div className="row">
//                   <div className="col-md-12 mb-4">
//                     <label htmlFor="property-title" className="form-label required-label">Property Title</label>
//                     <input 
//                       type="text" 
//                       className="form-control" 
//                       id="property-title" 
//                       placeholder="e.g., Modern Luxury Villa with Pool" 
//                       value={propertyData.title}
//                       onChange={handleInputChange}
//                       name="title"
//                       required
//                     />
//                     <div className="form-text">Make it descriptive and appealing to potential buyers</div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6 mb-4">
//                     <label className="form-label required-label">Property Type</label>
//                     <div className="row g-3" id="property-type-selection">
//                       {propertyTypes.map(({type, icon, label}) => (
//                         <div className="col-6 col-md-3" key={type}>
//                           <button
//                             type="button"
//                             className={`property-type-btn ${selectedPropertyType === type ? 'active' : ''}`}
//                             data-type={type}
//                             onClick={() => handlePropertyTypeSelect(type)}
//                           >
//                             <i className={`bi ${icon}`}></i>
//                             <div>{label}</div>
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                     <input 
//                       type="hidden" 
//                       id="property-type" 
//                       value={propertyData.propertyType}
//                       required 
//                     />
//                   </div>

//                   <div className="col-md-6 mb-4">
//                     <label className="form-label required-label">Property Status</label>
//                     <div className="btn-group w-100" role="group">
//                       {(['For Sale', 'For Rent', 'Sold'] as const).map(status => (
//                         <div key={status}>
//                           <input 
//                             type="radio" 
//                             className="btn-check" 
//                             name="status" 
//                             id={`status-${status.toLowerCase().replace(' ', '-')}`} 
//                             value={status}
//                             checked={propertyData.status === status}
//                             onChange={handleRadioChange}
//                           />
//                           <label 
//                             className="btn btn-outline-primary" 
//                             htmlFor={`status-${status.toLowerCase().replace(' ', '-')}`}
//                           >
//                             {status}
//                           </label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6 mb-4">
//                     <label htmlFor="price" className="form-label required-label">Price</label>
//                     <div className="input-group">
//                       <span className="input-group-text">$</span>
//                       <input 
//                         type="number" 
//                         className="form-control" 
//                         id="price" 
//                         placeholder="0.00" 
//                         min="0" 
//                         step="0.01" 
//                         value={propertyData.price || ''}
//                         onChange={handleInputChange}
//                         name="price"
//                         required 
//                       />
//                       <span className="input-group-text" id="price-period">
//                         {propertyData.status === 'For Rent' ? '/month' : ''}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="col-md-6 mb-4">
//                     <label htmlFor="description" className="form-label required-label">Description</label>
//                     <textarea 
//                       className="form-control" 
//                       id="description" 
//                       rows={4} 
//                       placeholder="Describe your property in detail..." 
//                       value={propertyData.description}
//                       onChange={handleInputChange}
//                       name="description"
//                       required
//                     ></textarea>
//                     <div className="form-text">Minimum 100 characters recommended</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="form-section">
//                 <h4><i className="bi bi-geo-alt me-2"></i>Location Details</h4>

//                 <div className="row">
//                   <div className="col-md-6 mb-4">
//                     <label htmlFor="address" className="form-label required-label">Full Address</label>
//                     <input 
//                       type="text" 
//                       className="form-control" 
//                       id="address" 
//                       placeholder="e.g., 1234 Maple Street, Beverly Hills" 
//                       value={propertyData.address}
//                       onChange={handleInputChange}
//                       name="address"
//                       required 
//                     />
//                   </div>
//                   <div className="col-md-6 mb-4">
//                     <label htmlFor="city" className="form-label required-label">City</label>
//                     <input 
//                       type="text" 
//                       className="form-control" 
//                       id="city" 
//                       placeholder="e.g., Los Angeles" 
//                       value={propertyData.city}
//                       onChange={handleInputChange}
//                       name="city"
//                       required 
//                     />
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6 mb-4">
//                     <div className="form-check">
//                       <input 
//                         className="form-check-input" 
//                         type="checkbox" 
//                         id="show-address" 
//                         checked={propertyData.showAddress}
//                         onChange={handleInputChange}
//                         name="showAddress"
//                       />
//                       <label className="form-check-label" htmlFor="show-address">
//                         Show exact address to potential buyers
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-12">
//                     <div id="location-map" style={{
//                       height: "300px",
//                       borderRadius: "8px",
//                       background: "#f8f9fa",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center"
//                     }}>
//                       <div className="text-center">
//                         <i className="bi bi-map" style={{fontSize: "3rem", color: "#6c757d"}}></i>
//                         <p className="mt-2">Map will be displayed here</p>
//                         <button type="button" className="btn btn-outline-primary btn-sm">
//                           <i className="bi bi-pin-map"></i> Set Location on Map
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="d-flex justify-content-between">
//                 <div></div>
//                 <button type="button" className="btn btn-primary" onClick={nextStep}>
//                   Next Step <i className="bi bi-arrow-right"></i>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 2: Property Details */}
//           {currentStep === 2 && (
//             <div className="form-step active" id="step-2">
//               <div className="form-section">
//                 <h4><i className="bi bi-rulers me-2"></i>Property Specifications</h4>

//                 {selectedPropertyType !== 'land' ? (
//                   <>
//                     <div className="row" id="building-specs">
//                       <div className="col-md-4 mb-4">
//                         <label htmlFor="bedrooms" className="form-label">Bedrooms</label>
//                         <input 
//                           type="number" 
//                           className="form-control" 
//                           id="bedrooms" 
//                           min="0" 
//                           placeholder="0" 
//                           value={propertyData.bedrooms || ''}
//                           onChange={handleInputChange}
//                           name="bedrooms"
//                         />
//                       </div>
//                       <div className="col-md-4 mb-4">
//                         <label htmlFor="bathrooms" className="form-label">Bathrooms</label>
//                         <input 
//                           type="number" 
//                           className="form-control" 
//                           id="bathrooms" 
//                           min="0" 
//                           step="0.5" 
//                           placeholder="0" 
//                           value={propertyData.bathrooms || ''}
//                           onChange={handleInputChange}
//                           name="bathrooms"
//                         />
//                       </div>
//                       <div className="col-md-4 mb-4">
//                         <label htmlFor="garage" className="form-label">Garage Spaces</label>
//                         <input 
//                           type="number" 
//                           className="form-control" 
//                           id="garage" 
//                           min="0" 
//                           placeholder="0" 
//                           value={propertyData.garage || ''}
//                           onChange={handleInputChange}
//                           name="garage"
//                         />
//                       </div>
//                     </div>

//                     <div className="row" id="building-specs-2">
//                       <div className="col-md-6 mb-4">
//                         <label htmlFor="area-size" className="form-label">Area Size</label>
//                         <div className="input-group">
//                           <input 
//                             type="number" 
//                             className="form-control" 
//                             id="area-size" 
//                             min="0" 
//                             placeholder="0" 
//                             value={propertyData.areaSize || ''}
//                             onChange={handleInputChange}
//                             name="areaSize"
//                           />
//                           <select 
//                             className="form-select" 
//                             id="area-unit" 
//                             style={{maxWidth: "120px"}}
//                             value={propertyData.areaUnit}
//                             onChange={handleInputChange}
//                             name="areaUnit"
//                           >
//                             <option value="m2">m²</option>
//                             <option value="ft2">ft²</option>
//                           </select>
//                         </div>
//                       </div>
//                       <div className="col-md-6 mb-4">
//                         <label htmlFor="year-built" className="form-label">Year Built</label>
//                         <input 
//                           type="number" 
//                           className="form-control" 
//                           id="year-built" 
//                           min="1800" 
//                           max="2025" 
//                           placeholder="YYYY" 
//                           value={propertyData.yearBuilt || ''}
//                           onChange={handleInputChange}
//                           name="yearBuilt"
//                         />
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="row" id="land-specs">
//                       <div className="col-md-6 mb-4">
//                         <label htmlFor="lot-size" className="form-label">Lot Size</label>
//                         <div className="input-group">
//                           <input 
//                             type="number" 
//                             className="form-control" 
//                             id="lot-size" 
//                             min="0" 
//                             placeholder="0" 
//                             value={propertyData.lotSize || ''}
//                             onChange={handleInputChange}
//                             name="lotSize"
//                           />
//                           <select 
//                             className="form-select" 
//                             id="lot-size-unit" 
//                             style={{maxWidth: "120px"}}
//                             value={propertyData.lotSizeUnit}
//                             onChange={handleInputChange}
//                             name="lotSizeUnit"
//                           >
//                             <option value="m2">m²</option>
//                             <option value="ft2">ft²</option>
//                             <option value="acre">Acre</option>
//                             <option value="hectare">Hectare</option>
//                           </select>
//                         </div>
//                       </div>
//                       <div className="col-md-6 mb-4">
//                         <label htmlFor="zoning" className="form-label">Zoning Type</label>
//                         <select 
//                           className="form-select" 
//                           id="zoning"
//                           value={propertyData.zoning || ''}
//                           onChange={handleInputChange}
//                           name="zoning"
//                         >
//                           <option value="">Select Zoning</option>
//                           <option value="residential">Residential</option>
//                           <option value="commercial">Commercial</option>
//                           <option value="industrial">Industrial</option>
//                           <option value="agricultural">Agricultural</option>
//                           <option value="mixed-use">Mixed-Use</option>
//                         </select>
//                       </div>
//                     </div>

//                     <div className="row" id="land-utilities">
//                       <div className="col-12">
//                         <label className="form-label mb-3">Utilities Available</label>
//                         <div className="land-utilities-grid">
//                           {[
//                             { id: 'water', label: 'Water', key: 'water' },
//                             { id: 'electricity', label: 'Electricity', key: 'electricity' },
//                             { id: 'sewage', label: 'Sewage', key: 'sewage' },
//                             { id: 'road-access', label: 'Road Access', key: 'roadAccess' }
//                           ].map(utility => (
//                             <div className="form-check" key={utility.id}>
//                               <input 
//                                 className="form-check-input" 
//                                 type="checkbox" 
//                                 id={`${utility.id}-utility`}
//                                 checked={propertyData.utilities[utility.key as keyof PropertyData['utilities']]}
//                                 onChange={handleInputChange}
//                                 name={`utilities.${utility.key}`}
//                               />
//                               <label className="form-check-label" htmlFor={`${utility.id}-utility`}>
//                                 {utility.label}
//                               </label>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>

//               <div className="form-section">
//                 <h4><i className="bi bi-tags me-2"></i>Property Labels</h4>
//                 <p className="text-muted mb-4">Select labels that apply to your property to help it stand out</p>

//                 <div className="d-flex flex-wrap gap-2">
//                   {featureTags.map(tag => (
//                     <button
//                       key={tag.id}
//                       type="button"
//                       className={`feature-tag ${selectedFeatures.has(tag.id) ? 'active' : ''}`}
//                       data-feature={tag.id}
//                       onClick={() => toggleFeatureTag(tag.id)}
//                     >
//                       <i className={`bi ${tag.icon} me-1`}></i> {tag.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="d-flex justify-content-between">
//                 <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
//                   <i className="bi bi-arrow-left"></i> Previous
//                 </button>
//                 <button type="button" className="btn btn-primary" onClick={nextStep}>
//                   Next Step <i className="bi bi-arrow-right"></i>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 3: Amenities & Features */}
//           {currentStep === 3 && (
//             <div className="form-step active" id="step-3">
//               <div className="form-section">
//                 <h4><i className="bi bi-check-circle me-2"></i>Interior Features</h4>
//                 <div className="amenities-grid">
//                   {interiorFeaturesList.map(feature => (
//                     <div className="form-check" key={feature}>
//                       <input 
//                         className="form-check-input" 
//                         type="checkbox" 
//                         id={feature.toLowerCase().replace(/[ /]/g, '-')}
//                         checked={interiorFeatures.has(feature)}
//                         onChange={() => toggleInteriorFeature(feature)}
//                       />
//                       <label className="form-check-label" htmlFor={feature.toLowerCase().replace(/[ /]/g, '-')}>
//                         {feature}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="form-section">
//                 <h4><i className="bi bi-tree me-2"></i>Exterior Features</h4>
//                 <div className="amenities-grid">
//                   {exteriorFeaturesList.map(feature => (
//                     <div className="form-check" key={feature}>
//                       <input 
//                         className="form-check-input" 
//                         type="checkbox" 
//                         id={feature.toLowerCase().replace(/[ /]/g, '-')}
//                         checked={exteriorFeatures.has(feature)}
//                         onChange={() => toggleExteriorFeature(feature)}
//                       />
//                       <label className="form-check-label" htmlFor={feature.toLowerCase().replace(/[ /]/g, '-')}>
//                         {feature}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="form-section">
//                 <h4><i className="bi bi-plus-circle me-2"></i>Custom Features</h4>
//                 <div className="mb-3">
//                   <label htmlFor="custom-features" className="form-label">Add custom features (comma separated)</label>
//                   <input 
//                     type="text" 
//                     className="form-control" 
//                     id="custom-features" 
//                     placeholder="e.g., Wine cellar, Home theater, Sauna"
//                     onChange={handleCustomFeatures}
//                   />
//                 </div>
//               </div>

//               <div className="d-flex justify-content-between">
//                 <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
//                   <i className="bi bi-arrow-left"></i> Previous
//                 </button>
//                 <button type="button" className="btn btn-primary" onClick={nextStep}>
//                   Next Step <i className="bi bi-arrow-right"></i>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 4: Media & Images */}
//           {currentStep === 4 && (
//             <div className="form-step active" id="step-4">
//               <div className="form-section">
//                 <h4><i className="bi bi-images me-2"></i>Property Images</h4>
//                 <p className="text-muted mb-4">Upload high-quality images of your property. First image will be the cover photo.</p>

//                 <div className="mb-4">
//                   {/* <div 
//                     id="image-dropzone" 
//                     className="dropzone" 
//                     style={{
//                       border: "2px dashed #dee2e6",
//                       borderRadius: "8px",
//                       padding: "40px",
//                       textAlign: "center",
//                       cursor: "pointer"
//                     }}
//                     onClick={() => fileInputRef.current?.click()}
//                     ref={dropzoneRef}
//                   >
//                     <i className="bi bi-cloud-arrow-up" style={{fontSize: "3rem", color: "#6c757d"}}></i>
//                     <h5 className="mt-3">Drop images here or click to upload</h5>
//                     <p className="text-muted">Supported formats: JPG, PNG, WEBP (Max 5MB each)</p>
//                     <input 
//                       type="file" 
//                       ref={fileInputRef}
//                       style={{display: 'none'}}
//                       multiple
//                       accept="image/*"
//                       onChange={handleFileUpload}
//                     />
//                   </div> */}
//                   <div 
//   id="image-dropzone" 
//   className="dropzone" 
//   style={{
//     border: isDragging ? "2px solid #0d6efd" : "2px dashed #dee2e6",
//     borderRadius: "8px",
//     padding: "40px",
//     textAlign: "center",
//     cursor: "pointer",
//     backgroundColor: isDragging ? "rgba(13, 110, 253, 0.05)" : "transparent",
//     transition: "all 0.3s ease"
//   }}
//   onClick={() => fileInputRef.current?.click()}
//   onDragEnter={handleDragEnter}
//   onDragLeave={handleDragLeave}
//   onDragOver={handleDragOver}
//   onDrop={handleDrop}
//   ref={dropzoneRef}
// >
//   <i 
//     className="bi bi-cloud-arrow-up" 
//     style={{
//       fontSize: "3rem", 
//       color: isDragging ? "#0d6efd" : "#6c757d"
//     }}
//   ></i>
//   <h5 className="mt-3">
//     {isDragging ? "Drop images here" : "Drop images here or click to upload"}
//   </h5>
//   <p className="text-muted">Supported formats: JPG, PNG, WEBP (Max 5MB each)</p>
//   <input 
//     type="file" 
//     ref={fileInputRef}
//     style={{display: 'none'}}
//     multiple
//     accept="image/*"
//     onChange={handleFileUpload}
//   />
// </div>
//                 </div>

//                 <div className="image-preview-container" id="image-preview-container">
//                   {uploadedImages.map((image, index) => (
//                     <div className="image-preview" key={index}>
//                       <img src={image} alt={`Property ${index + 1}`} />
//                       <button 
//                         type="button" 
//                         className="remove-image" 
//                         onClick={() => removeImage(index)}
//                       >
//                         <i className="bi bi-x"></i>
//                       </button>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="alert alert-info mt-4">
//                   <i className="bi bi-info-circle me-2"></i>
//                   <strong>Image Tips:</strong> Include photos of all rooms, exterior views, amenities, and neighborhood features. High-quality photos can increase views by up to 40%.
//                 </div>
//               </div>

//               <div className="form-section">
//                 <h4><i className="bi bi-camera-video me-2"></i>Virtual Tour & Videos</h4>

//                 <div className="mb-4">
//                   <label htmlFor="video-url" className="form-label">Video URL (YouTube, Vimeo, etc.)</label>
//                   <input 
//                     type="url" 
//                     className="form-control" 
//                     id="video-url" 
//                     placeholder="https://www.youtube.com/watch?v=..."
//                     value={propertyData.videoUrl || ''}
//                     onChange={handleInputChange}
//                     name="videoUrl"
//                   />
//                   <div className="form-text">Add a link to a video tour of your property</div>
//                 </div>

//                 <div className="mb-4">
//                   <label htmlFor="virtual-tour" className="form-label">Virtual Tour URL</label>
//                   <input 
//                     type="url" 
//                     className="form-control" 
//                     id="virtual-tour" 
//                     placeholder="https://myvirtualtour.com/..."
//                     value={propertyData.virtualTourUrl || ''}
//                     onChange={handleInputChange}
//                     name="virtualTourUrl"
//                   />
//                   <div className="form-text">Link to a 360° virtual tour if available</div>
//                 </div>
//               </div>

//               <div className="d-flex justify-content-between">
//                 <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
//                   <i className="bi bi-arrow-left"></i> Previous
//                 </button>
//                 <button type="button" className="btn btn-primary" onClick={nextStep}>
//                   Next Step <i className="bi bi-arrow-right"></i>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 5: Review & Agent Info */}
//           {currentStep === 5 && (
//             <div className="form-step active" id="step-5">
//               <div className="form-section">
//                 <h4><i className="bi bi-person-circle me-2"></i>Agent Information</h4>

//                 <div className="row">
//                   <div className="col-md-6 mb-4">
//                     <div className="form-check form-switch">
//                       <input 
//                         className="form-check-input" 
//                         type="checkbox"
//                         id="show-agent"
//                         checked={propertyData.showAgent}
//                         onChange={handleInputChange}
//                         name="showAgent"
//                       />
//                       <label className="form-check-label" htmlFor="show-agent">
//                         Show agent information on listing
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//                 {propertyData.showAgent && (
//                   <div id="agent-info-section">
//                     <div className="row">
//                       <div className="col-md-6 mb-4">
//                         <label htmlFor="agent-name" className="form-label">Agent Name</label>
//                         <input 
//                           type="text" 
//                           className="form-control" 
//                           id="agent-name" 
//                           placeholder="e.g., Sarah Johnson"
//                           value={propertyData.agent?.name || ''}
//                           onChange={(e) => setPropertyData(prev => ({
//                             ...prev,
//                             agent: { ...prev.agent!, name: e.target.value }
//                           }))}
//                         />
//                       </div>
//                       <div className="col-md-6 mb-4">
//                         <label htmlFor="agent-title" className="form-label">Agent Title</label>
//                         <input 
//                           type="text" 
//                           className="form-control" 
//                           id="agent-title" 
//                           placeholder="e.g., Licensed Real Estate Agent"
//                           value={propertyData.agent?.title || ''}
//                           onChange={(e) => setPropertyData(prev => ({
//                             ...prev,
//                             agent: { ...prev.agent!, title: e.target.value }
//                           }))}
//                         />
//                       </div>
//                     </div>

//                     <div className="row">
//                       <div className="col-md-6 mb-4">
//                         <label htmlFor="agent-phone" className="form-label">Phone Number</label>
//                         <input 
//                           type="tel" 
//                           className="form-control" 
//                           id="agent-phone" 
//                           placeholder="+1 (555) 123-4567"
//                           value={propertyData.agent?.phone || ''}
//                           onChange={(e) => setPropertyData(prev => ({
//                             ...prev,
//                             agent: { ...prev.agent!, phone: e.target.value }
//                           }))}
//                         />
//                       </div>
//                       <div className="col-md-6 mb-4">
//                         <label htmlFor="agent-email" className="form-label">Email Address</label>
//                         <input 
//                           type="email" 
//                           className="form-control" 
//                           id="agent-email" 
//                           placeholder="agent@example.com"
//                           value={propertyData.agent?.email || ''}
//                           onChange={(e) => setPropertyData(prev => ({
//                             ...prev,
//                             agent: { ...prev.agent!, email: e.target.value }
//                           }))}
//                         />
//                       </div>
//                     </div>

//                     <div className="row">
//                       <div className="col-md-6 mb-4">
//                         <label htmlFor="agent-photo" className="form-label">Agent Photo</label>
//                         <input 
//                           type="file" 
//                           className="form-control" 
//                           id="agent-photo" 
//                           accept="image/*"
//                           onChange={(e) => {
//                             const file = e.target.files?.[0];
//                             if (file && propertyData.agent) {
//                               setPropertyData(prev => ({
//                                 ...prev,
//                                 agent: { ...prev.agent!, photo: file }
//                               }));
//                             }
//                           }}
//                         />
//                         <div className="form-text">Recommended size: 400x400 pixels</div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="form-section">
//                 <h4><i className="bi bi-eye me-2"></i>Review Your Listing</h4>

//                 <div className="alert alert-success">
//                   <h5 className="alert-heading"><i className="bi bi-check-circle-fill me-2"></i>Ready to Publish!</h5>
//                   <p>Review all the information below before publishing your property listing.</p>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="card mb-3">
//                       <div className="card-body">
//                         <h6 className="card-title">Property Summary</h6>
//                         <div id="review-summary">
//                           <div className="mb-3">
//                             <strong>Property:</strong> {propertyData.title}<br />
//                             <strong>Type:</strong> {propertyData.propertyType}<br />
//                             <strong>Status:</strong> {propertyData.status}<br />
//                             <strong>Price:</strong> ${propertyData.price.toLocaleString()}{propertyData.status === 'For Rent' ? '/month' : ''}
//                           </div>
//                           <div className="mb-3">
//                             <strong>Location:</strong> {propertyData.address}, {propertyData.city}<br />
//                             <strong>Show Address:</strong> {propertyData.showAddress ? 'Yes' : 'No'}
//                           </div>
//                           <div className="mb-3">
//                             <strong>Images:</strong> {propertyData.images.length} uploaded<br />
//                             <strong>Features:</strong> {interiorFeatures.size + exteriorFeatures.size} selected
//                           </div>
//                           {propertyData.agent?.name && (
//                             <div className="mb-3">
//                               <strong>Agent:</strong> {propertyData.agent.name}<br />
//                               <strong>Contact:</strong> {propertyData.agent.phone || 'Not provided'}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="card">
//                       <div className="card-body">
//                         <h6 className="card-title">Listing Preview</h6>
//                         <div id="review-preview">
//                           <div className="property-preview">
//                             <div className="preview-image" style={{
//                               height: "150px",
//                               background: "#f8f9fa",
//                               borderRadius: "8px",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               marginBottom: "15px"
//                             }}>
//                               {uploadedImages.length > 0 ? (
//                                 <img 
//                                   src={uploadedImages[0]} 
//                                   alt="Property" 
//                                   style={{
//                                     width: '100%',
//                                     height: '100%',
//                                     objectFit: 'cover',
//                                     borderRadius: '8px'
//                                   }}
//                                 />
//                               ) : (
//                                 <i className="bi bi-house" style={{fontSize: "3rem", color: "#6c757d"}}></i>
//                               )}
//                             </div>
//                             <h6 className="preview-title">{propertyData.title}</h6>
//                             <p className="preview-price mb-2">
//                               <strong>${propertyData.price.toLocaleString()}</strong>
//                               {propertyData.status === 'For Rent' ? '/month' : ''}
//                             </p>
//                             <p className="preview-location text-muted small mb-3">
//                               <i className="bi bi-geo-alt"></i> {propertyData.city}
//                             </p>
//                             <div className="preview-features d-flex justify-content-between text-muted small">
//                               {propertyData.bedrooms && <span><i className="bi bi-house"></i> {propertyData.bedrooms} Bed</span>}
//                               {propertyData.bathrooms && <span><i className="bi bi-water"></i> {propertyData.bathrooms} Bath</span>}
//                               {propertyData.areaSize && (
//                                 <span><i className="bi bi-arrows-angle-expand"></i> {propertyData.areaSize} {propertyData.areaUnit}</span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="form-check mt-4">
//                   <input className="form-check-input" type="checkbox" id="terms-agreement" required />
//                   <label className="form-check-label" htmlFor="terms-agreement">
//                     I agree to the <Link href="/terms">Terms of Service</Link> and confirm that all information provided is accurate
//                   </label>
//                 </div>
//               </div>

//               <div className="d-flex justify-content-between">
//                 <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
//                   <i className="bi bi-arrow-left"></i> Previous
//                 </button>
//                 <div>
//                   <button type="button" className="btn btn-outline-primary me-2" onClick={saveAsDraft}>
//                     <i className="bi bi-save"></i> Save as Draft
//                   </button>
//                   <button type="button" className="btn btn-success" onClick={submitProperty}>
//                     <i className="bi bi-check-lg"></i> Publish Property
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </section>
//       {/* /Add Property Form Section */}
//     </main>
//   );
// }

// // // app/admin/properties/new/page.tsx
// // "use client";

// // // import { useIsAdmin } from "@/hooks/useIsAdmin";
// // // import { useRouter } from "next/navigation";
// // // import { useEffect } from "react";

// // function A(){
// //     console.log("A");
// // }


// // export default function NewPropertyPage() {
// //     // const isAdmin = useIsAdmin();
// //     // const router = useRouter();

// //     // useEffect(() => {
// //     //     if (isAdmin === false) router.replace("/"); // redirect non-admin
// //     // }, [isAdmin, router]);

// //     // if (isAdmin === null) return <div>Loading...</div>; // still checking

// //     return (
// //         <main className="main">

// //             {/* <!-- Page Title --> */}
// //             <div className="page-title">
// //                 <div className="heading">
// //                     <div className="container">
// //                         <div className="row d-flex justify-content-center text-center">
// //                             <div className="col-lg-8">
// //                                 <h1 className="heading-title">Add New Property</h1>
// //                                 <p className="mb-0">
// //                                     List your property with us and reach thousands of potential buyers. Fill in the details below to get started.
// //                                 </p>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //                 <nav className="breadcrumbs">
// //                     <div className="container">
// //                         <ol>
// //                             <li><a href="index.html">Home</a></li>
// //                             <li><a href="properties.html">Properties</a></li>
// //                             <li className="current">Add New Property</li>
// //                         </ol>
// //                     </div>
// //                 </nav>
// //             </div>
// //             {/* <!-- End Page Title --> */}


// //             {/* <!-- Add Property Form Section --> */}
// //             <section id="add-property" className="add-property section">

// //                 <div className="container" data-aos="fade-up" data-aos-delay="100">


// //                     {/* <!-- Progress Indicator --> */}
// //                     <div className="step-indicator">
// //                         <div className="step active" data-step="1">
// //                             <div className="step-number">1</div>
// //                             <div className="step-label">Basic Info</div>
// //                         </div>
// //                         <div className="step" data-step="2">
// //                             <div className="step-number">2</div>
// //                             <div className="step-label">Details</div>
// //                         </div>
// //                         <div className="step" data-step="3">
// //                             <div className="step-number">3</div>
// //                             <div className="step-label">Amenities</div>
// //                         </div>
// //                         <div className="step" data-step="4">
// //                             <div className="step-number">4</div>
// //                             <div className="step-label">Media</div>
// //                         </div>
// //                         <div className="step" data-step="5">
// //                             <div className="step-number">5</div>
// //                             <div className="step-label">Review</div>
// //                         </div>
// //                     </div>


// //                     {/* <!-- Form Progress --> */}
// //                     <div className="progress-bar mb-4">
// //                         <div className="progress-fill" id="form-progress" style={{"width":"20%"}}></div>
// //                     </div>


// //                     {/* <!-- Step 1: Basic Information --> */}
// //                     <div className="form-step active" id="step-1">
// //                         <div className="form-section">
// //                             <h4><i className="bi bi-info-circle me-2"></i>Basic Information</h4>

// //                             <div className="row">
// //                                 <div className="col-md-12 mb-4">
// //                                     <label htmlFor="property-title" className="form-label required-label">Property Title</label>
// //                                     <input type="text" className="form-control" id="property-title" placeholder="e.g., Modern Luxury Villa with Pool" required/>
// //                                         <div className="form-text">Make it descriptive and appealing to potential buyers</div>
// //                                 </div>
// //                             </div>

// //                             <div className="row">
// //                                 <div className="col-md-6 mb-4">
// //                                     <label className="form-label required-label">Property Type</label>
// //                                     <div className="row g-3" id="property-type-selection">
// //                                         <div className="col-6 col-md-3">
// //                                             <div className="property-type-btn" data-type="house">
// //                                                 <i className="bi bi-house-door"></i>
// //                                                 <div>House</div>
// //                                             </div>
// //                                         </div>
// //                                         <div className="col-6 col-md-3">
// //                                             <div className="property-type-btn" data-type="apartment">
// //                                                 <i className="bi bi-building"></i>
// //                                                 <div>Apartment</div>
// //                                             </div>
// //                                         </div>
// //                                         <div className="col-6 col-md-3">
// //                                             <div className="property-type-btn" data-type="villa">
// //                                                 <i className="bi bi-house-heart"></i>
// //                                                 <div>Villa</div>
// //                                             </div>
// //                                         </div>
// //                                         <div className="col-6 col-md-3">
// //                                             <div className="property-type-btn" data-type="commercial">
// //                                                 <i className="bi bi-shop"></i>
// //                                                 <div>Commercial</div>
// //                                             </div>
// //                                         </div>
// //                                         <div className="col-6 col-md-3">
// //                                             <div className="property-type-btn" data-type="land">
// //                                                 <i className="bi bi-tree"></i>
// //                                                 <div>Land</div>
// //                                             </div>
// //                                         </div>
// //                                     </div>
// //                                     <input type="hidden" id="property-type" required />
// //                                 </div>

// //                                 <div className="col-md-6 mb-4">
// //                                     <label className="form-label required-label">Property Status</label>
// //                                     <div className="btn-group w-100" role="group">
// //                                         <input type="radio" className="btn-check" name="status" id="for-sale" value="For Sale" checked />
// //                                             <label className="btn btn-outline-primary" htmlFor="for-sale">For Sale</label>

// //                                             <input type="radio" className="btn-check" name="status" id="for-rent" value="For Rent" />
// //                                                 <label className="btn btn-outline-primary" htmlFor="for-rent">For Rent</label>

// //                                                 <input type="radio" className="btn-check" name="status" id="sold" value="Sold" />
// //                                                     <label className="btn btn-outline-primary" htmlFor="sold">Sold</label>
// //                                                 </div>
// //                                             </div>
// //                                     </div>

// //                                     <div className="row">
// //                                         <div className="col-md-6 mb-4">
// //                                             <label htmlFor="price" className="form-label required-label">Price</label>
// //                                             <div className="input-group">
// //                                                 <span className="input-group-text">$</span>
// //                                                 <input type="number" className="form-control" id="price" placeholder="0.00" min="0" step="0.01" required />
// //                                                     <span className="input-group-text" id="price-period">/month</span>
// //                                             </div>
// //                                         </div>
// //                                         <div className="col-md-6 mb-4">
// //                                             <label htmlFor="description" className="form-label required-label">Description</label>
// //                                             <textarea className="form-control" id="description" rows={4} placeholder="Describe your property in detail..." required></textarea>
// //                                             <div className="form-text">Minimum 100 characters recommended</div>
// //                                         </div>
// //                                     </div>
// //                                 </div>

// //                                 <div className="form-section">
// //                                     <h4><i className="bi bi-geo-alt me-2"></i>Location Details</h4>

// //                                     <div className="row">
// //                                         <div className="col-md-6 mb-4">
// //                                             <label htmlFor="address" className="form-label required-label">Full Address</label>
// //                                             <input type="text" className="form-control" id="address" placeholder="e.g., 1234 Maple Street, Beverly Hills" required />
// //                                         </div>
// //                                         <div className="col-md-6 mb-4">
// //                                             <label htmlFor="city" className="form-label required-label">City</label>
// //                                             <input type="text" className="form-control" id="city" placeholder="e.g., Los Angeles" required />
// //                                         </div>
// //                                     </div>

// //                                     <div className="row">
// //                                         <div className="col-md-6 mb-4">
// //                                             <div className="form-check">
// //                                                 <input className="form-check-input" type="checkbox" id="show-address" />
// //                                                     <label className="form-check-label" htmlFor="show-address">
// //                                                         Show exact address to potential buyers
// //                                                     </label>
// //                                             </div>
// //                                         </div>
// //                                     </div>

// //                                     <div className="row">
// //                                         <div className="col-12">
// //                                             <div id="location-map" style={{"height":" 300px","borderRadius":" 8px","background":" #f8f9fa","display":"flex","alignItems":"center","justifyContent":"center"}}>
// //                                                 <div className="text-center">
// //                                                     <i className="bi bi-map" style={{"fontSize":"3rem", "color":"#6c757d"}}></i>
// //                                                     <p className="mt-2">Map will be displayed here</p>
// //                                                     <button type="button" className="btn btn-outline-primary btn-sm">
// //                                                         <i className="bi bi-pin-map"></i> Set Location on Map
// //                                                     </button>
// //                                                 </div>
// //                                             </div>
// //                                         </div>
// //                                     </div>
// //                                 </div>

// //                                 <div className="d-flex justify-content-between">
// //                                     <div></div>
// //                                     {/* <button type="button" className="btn btn-primary" onClick="nextStep()"> */}
// //                                     <button type="button" className="btn btn-primary" onClick={A}>
// //                                         Next Step <i className="bi bi-arrow-right"></i>
// //                                     </button>
// //                                 </div>
// //                             </div>


// //                             {/* <!-- Step 2: Property Details --> */}
// //                             <div className="form-step" id="step-2">
// //                                 <div className="form-section">
// //                                     <h4><i className="bi bi-rulers me-2"></i>Property Specifications</h4>

// //                                     <div className="row" id="building-specs">
// //                                         <div className="col-md-4 mb-4">
// //                                             <label htmlFor="bedrooms" className="form-label">Bedrooms</label>
// //                                             <input type="number" className="form-control" id="bedrooms" min="0" placeholder="0" />
// //                                         </div>
// //                                         <div className="col-md-4 mb-4">
// //                                             <label htmlFor="bathrooms" className="form-label">Bathrooms</label>
// //                                             <input type="number" className="form-control" id="bathrooms" min="0" step="0.5" placeholder="0" />
// //                                         </div>
// //                                         <div className="col-md-4 mb-4">
// //                                             <label htmlFor="garage" className="form-label">Garage Spaces</label>
// //                                             <input type="number" className="form-control" id="garage" min="0" placeholder="0" />
// //                                         </div>
// //                                     </div>

// //                                     <div className="row" id="building-specs-2">
// //                                         <div className="col-md-6 mb-4">
// //                                             <label htmlFor="area-size" className="form-label">Area Size</label>
// //                                             <div className="input-group">
// //                                                 <input type="number" className="form-control" id="area-size" min="0" placeholder="0" />
// //                                                     <select className="form-select" id="area-unit" style={{"maxWidth": "120px"}}>
// //                                                         <option value="m2">m²</option>
// //                                                         <option value="ft2">ft²</option>
// //                                                     </select>
// //                                             </div>
// //                                         </div>
// //                                         <div className="col-md-6 mb-4">
// //                                             <label htmlFor="year-built" className="form-label">Year Built</label>
// //                                             <input type="number" className="form-control" id="year-built" min="1800" max="2025" placeholder="YYYY" />
// //                                         </div>
// //                                     </div>

// //                                     <div className="row" id="land-specs" style={{"display": "none"}}>
// //                                         <div className="col-md-6 mb-4">
// //                                             <label htmlFor="lot-size" className="form-label">Lot Size</label>
// //                                             <div className="input-group">
// //                                                 <input type="number" className="form-control" id="lot-size" min="0" placeholder="0" />
// //                                                     <select className="form-select" id="lot-size-unit" style={{"maxWidth": "120px"}}>
// //                                                         <option value="m2">m²</option>
// //                                                         <option value="ft2">ft²</option>
// //                                                         <option value="acre">Acre</option>
// //                                                         <option value="hectare">Hectare</option>
// //                                                     </select>
// //                                             </div>
// //                                         </div>
// //                                         <div className="col-md-6 mb-4">
// //                                             <label htmlFor="zoning" className="form-label">Zoning Type</label>
// //                                             <select className="form-select" id="zoning">
// //                                                 <option value="">Select Zoning</option>
// //                                                 <option value="residential">Residential</option>
// //                                                 <option value="commercial">Commercial</option>
// //                                                 <option value="industrial">Industrial</option>
// //                                                 <option value="agricultural">Agricultural</option>
// //                                                 <option value="mixed-use">Mixed-Use</option>
// //                                             </select>
// //                                         </div>
// //                                     </div>

// //                                     <div className="row" id="land-utilities" style={{"display": "none"}}>
// //                                         <div className="col-12">
// //                                             <label className="form-label mb-3">Utilities Available</label>
// //                                             <div className="land-utilities-grid">
// //                                                 <div className="form-check">
// //                                                     <input className="form-check-input" type="checkbox" id="water-utility" />
// //                                                     <label className="form-check-label" htmlFor="water-utility">Water</label>
// //                                                 </div>
// //                                                 <div className="form-check">
// //                                                     <input className="form-check-input" type="checkbox" id="electricity-utility" />
// //                                                     <label className="form-check-label" htmlFor="electricity-utility">Electricity</label>
// //                                                 </div>
// //                                                 <div className="form-check">
// //                                                     <input className="form-check-input" type="checkbox" id="sewage-utility" />
// //                                                     <label className="form-check-label" htmlFor="sewage-utility">Sewage</label>
// //                                                 </div>
// //                                                 <div className="form-check">
// //                                                     <input className="form-check-input" type="checkbox" id="road-access" />
// //                                                     <label className="form-check-label" htmlFor="road-access">Road Access</label>
// //                                                 </div>
// //                                             </div>
// //                                         </div>
// //                                     </div>
// //                                 </div>

// //                                 <div className="form-section">
// //                                     <h4><i className="bi bi-tags me-2"></i>Property Labels</h4>
// //                                     <p className="text-muted mb-4">Select labels that apply to your property to help it stand out</p>

// //                                     <div className="d-flex flex-wrap gap-2">
// //                                         <div className="feature-tag" data-feature="hot">
// //                                             <i className="bi bi-fire me-1"></i> Hot Property
// //                                         </div>
// //                                         <div className="feature-tag" data-feature="newListing">
// //                                             <i className="bi bi-star me-1"></i> New Listing
// //                                         </div>
// //                                         <div className="feature-tag" data-feature="featured">
// //                                             <i className="bi bi-gem me-1"></i> Featured
// //                                         </div>
// //                                         <div className="feature-tag" data-feature="exclusive">
// //                                             <i className="bi bi-shield-lock me-1"></i> Exclusive
// //                                         </div>
// //                                     </div>
// //                                 </div>

// //                                 <div className="d-flex justify-content-between">
// //                                     {/* <button type="button" className="btn btn-outline-secondary" onClick="prevStep()"> */}
// //                                     <button type="button" className="btn btn-outline-secondary" onClick={A}>
// //                                         <i className="bi bi-arrow-left"></i> Previous
// //                                     </button>
// //                                     {/* <button type="button" className="btn btn-primary" onClick="nextStep()"> */}
// //                                     <button type="button" className="btn btn-primary" onClick={A}>
// //                                         Next Step <i className="bi bi-arrow-right"></i>
// //                                     </button>
// //                                 </div>
// //                             </div>


// //                             {/* <!-- Step 3: Amenities & Features --> */}
// //                             <div className="form-step" id="step-3">
// //                                 <div className="form-section">
// //                                     <h4><i className="bi bi-check-circle me-2"></i>Interior Features</h4>
// //                                     <div className="amenities-grid">
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="hardwood-floors" />
// //                                             <label className="form-check-label" htmlFor="hardwood-floors">Hardwood Floors</label>
// //                                         </div>
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="updated-kitchen" />
// //                                             <label className="form-check-label" htmlFor="updated-kitchen">Updated Kitchen</label>
// //                                         </div>
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="walkin-closets" />
// //                                             <label className="form-check-label" htmlFor="walkin-closets">Walk-in Closets</label>
// //                                         </div>
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="central-air" />
// //                                             <label className="form-check-label" htmlFor="central-air">Central Air Conditioning</label>
// //                                         </div>
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="fireplace" />
// //                                             <label className="form-check-label" htmlFor="fireplace">Fireplace</label>
// //                                         </div>
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="high-ceilings" />
// //                                             <label className="form-check-label" htmlFor="high-ceilings">High Ceilings</label>
// //                                         </div>
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="smart-home" />
// //                                             <label className="form-check-label" htmlFor="smart-home">Smart Home System</label>
// //                                         </div>
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="home-office" />
// //                                             <label className="form-check-label" htmlFor="home-office">Home Office</label>
// //                                         </div>
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="basement" />
// //                                             <label className="form-check-label" htmlFor="basement">Finished Basement</label>
// //                                         </div>
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="laundry" />
// //                                             <label className="form-check-label" htmlFor="laundry">In-unit Laundry</label>
// //                                         </div>
// //                                     </div>
// //                                 </div>

// //                                 <div className="form-section">
// //                                     <h4><i className="bi bi-tree me-2"></i>Exterior Features</h4>
// //                                     <div className="amenities-grid">
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="swimming-pool" />
// //                                             <label className="form-check-label" htmlFor="swimming-pool">Swimming Pool</label>
// //                                         </div>
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="garden" />
// //                                             <label className="form-check-label" htmlFor="garden">Garden</label>
// //                                         </div>
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="patio-deck" />
// //                                             <label className="form-check-label" htmlFor="patio-deck">Patio/Deck</label>
// //                                         </div>
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="security-system" />
// //                                             <label className="form-check-label" htmlFor="security-system">Security System</label>
// //                                         </div>
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="sprinkler-system" />
// //                                             <label className="form-check-label" htmlFor="sprinkler-system">Sprinkler System</label>
// //                                         </div>
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="bbq-area" />
// //                                             <label className="form-check-label" htmlFor="bbq-area">BBQ Area</label>
// //                                         </div>
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="playground" />
// //                                             <label className="form-check-label" htmlFor="playground">Playground</label>
// //                                         </div>
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="tennis-court" />
// //                                             <label className="form-check-label" htmlFor="tennis-court">Tennis Court</label>
// //                                         </div>
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="parking-lot" />
// //                                             <label className="form-check-label" htmlFor="parking-lot">Parking Lot</label>
// //                                         </div>
// //                                         <div className="form-check">
// //                                             <input className="form-check-input" type="checkbox" id="roof-deck" />
// //                                             <label className="form-check-label" htmlFor="roof-deck">Roof Deck</label>
// //                                         </div>
// //                                     </div>
// //                                 </div>

// //                                 <div className="form-section">
// //                                     <h4><i className="bi bi-plus-circle me-2"></i>Custom Features</h4>
// //                                     <div className="mb-3">
// //                                         <label htmlFor="custom-features" className="form-label">Add custom features (comma separated)</label>
// //                                         <input type="text" className="form-control" id="custom-features" placeholder="e.g., Wine cellar, Home theater, Sauna" />
// //                                     </div>
// //                                 </div>

// //                                 <div className="d-flex justify-content-between">
// //                                     {/* <button type="button" className="btn btn-outline-secondary" onClick="prevStep()"> */}
// //                                     <button type="button" className="btn btn-outline-secondary" onClick={A}>
// //                                         <i className="bi bi-arrow-left"></i> Previous
// //                                     </button>
// //                                     {/* <button type="button" className="btn btn-primary" onClick="nextStep()"> */}
// //                                     <button type="button" className="btn btn-primary" onClick={A}>
// //                                         Next Step <i className="bi bi-arrow-right"></i>
// //                                     </button>
// //                                 </div>
// //                             </div>


// //                             {/* <!-- Step 4: Media & Images --> */}
// //                             <div className="form-step" id="step-4">
// //                                 <div className="form-section">
// //                                     <h4><i className="bi bi-images me-2"></i>Property Images</h4>
// //                                     <p className="text-muted mb-4">Upload high-quality images of your property. First image will be the cover photo.</p>

// //                                     <div className="mb-4">
// //                                         <div id="image-dropzone" className="dropzone" style={{"border":"2px dashed #dee2e6","borderRadius":"8px","padding":"40px","textAlign":"center","cursor":"pointer"}}>
// //                                             <i className="bi bi-cloud-arrow-up" style={{"fontSize": "3rem", "color": "#6c757d"}}></i>
// //                                             <h5 className="mt-3">Drop images here or click to upload</h5>
// //                                             <p className="text-muted">Supported formats: JPG, PNG, WEBP (Max 5MB each)</p>
// //                                         </div>
// //                                     </div>

// //                                     <div className="image-preview-container" id="image-preview-container">

// //                                         {/* <!-- Image previews will be added here --> */}
// //                                     </div>

// //                                     <div className="alert alert-info mt-4">
// //                                         <i className="bi bi-info-circle me-2"></i>
// //                                         <strong>Image Tips:</strong> Include photos of all rooms, exterior views, amenities, and neighborhood features. High-quality photos can increase views by up to 40%.
// //                                     </div>
// //                                 </div>

// //                                 <div className="form-section">
// //                                     <h4><i className="bi bi-camera-video me-2"></i>Virtual Tour & Videos</h4>

// //                                     <div className="mb-4">
// //                                         <label htmlFor="video-url" className="form-label">Video URL (YouTube, Vimeo, etc.)</label>
// //                                         <input type="url" className="form-control" id="video-url" placeholder="https://www.youtube.com/watch?v=..." />
// //                                         <div className="form-text">Add a link to a video tour of your property</div>
// //                                     </div>

// //                                     <div className="mb-4">
// //                                         <label htmlFor="virtual-tour" className="form-label">Virtual Tour URL</label>
// //                                         <input type="url" className="form-control" id="virtual-tour" placeholder="https://myvirtualtour.com/..." />
// //                                         <div className="form-text">Link to a 360° virtual tour if available</div>
// //                                     </div>
// //                                 </div>

// //                                 <div className="d-flex justify-content-between">
// //                                     {/* <button type="button" className="btn btn-outline-secondary" onClick="prevStep()"> */}
// //                                     <button type="button" className="btn btn-outline-secondary" onClick={A}>
// //                                         <i className="bi bi-arrow-left"></i> Previous
// //                                     </button>
// //                                     {/* <button type="button" className="btn btn-primary" onClick="nextStep()"> */}
// //                                     <button type="button" className="btn btn-primary" onClick={A}>
// //                                         Next Step <i className="bi bi-arrow-right"></i>
// //                                     </button>
// //                                 </div>
// //                             </div>


// //                             {/* <!-- Step 5: Review & Agent Info --> */}
// //                             <div className="form-step" id="step-5">
// //                                 <div className="form-section">
// //                                     <h4><i className="bi bi-person-circle me-2"></i>Agent Information</h4>

// //                                     <div className="row">
// //                                         <div className="col-md-6 mb-4">
// //                                             <div className="form-check form-switch">
// //                                                 <input className="form-check-input" type="checkbox" id="show-agent" checked />
// //                                                 <label className="form-check-label" htmlFor="show-agent">Show agent information on listing</label>
// //                                             </div>
// //                                         </div>
// //                                     </div>

// //                                     <div id="agent-info-section">
// //                                         <div className="row">
// //                                             <div className="col-md-6 mb-4">
// //                                                 <label htmlFor="agent-name" className="form-label">Agent Name</label>
// //                                                 <input type="text" className="form-control" id="agent-name" placeholder="e.g., Sarah Johnson" />
// //                                             </div>
// //                                             <div className="col-md-6 mb-4">
// //                                                 <label htmlFor="agent-title" className="form-label">Agent Title</label>
// //                                                 <input type="text" className="form-control" id="agent-title" placeholder="e.g., Licensed Real Estate Agent" />
// //                                             </div>
// //                                         </div>

// //                                         <div className="row">
// //                                             <div className="col-md-6 mb-4">
// //                                                 <label htmlFor="agent-phone" className="form-label">Phone Number</label>
// //                                                 <input type="tel" className="form-control" id="agent-phone" placeholder="+1 (555) 123-4567" />
// //                                             </div>
// //                                             <div className="col-md-6 mb-4">
// //                                                 <label htmlFor="agent-email" className="form-label">Email Address</label>
// //                                                 <input type="email" className="form-control" id="agent-email" placeholder="agent@example.com" />
// //                                             </div>
// //                                         </div>

// //                                         <div className="row">
// //                                             <div className="col-md-6 mb-4">
// //                                                 <label htmlFor="agent-photo" className="form-label">Agent Photo</label>
// //                                                 <input type="file" className="form-control" id="agent-photo" accept="image/*" />
// //                                                 <div className="form-text">Recommended size: 400x400 pixels</div>
// //                                             </div>
// //                                         </div>
// //                                     </div>
// //                                 </div>

// //                                 <div className="form-section">
// //                                     <h4><i className="bi bi-eye me-2"></i>Review Your Listing</h4>

// //                                     <div className="alert alert-success">
// //                                         <h5 className="alert-heading"><i className="bi bi-check-circle-fill me-2"></i>Ready to Publish!</h5>
// //                                         <p>Review all the information below before publishing your property listing.</p>
// //                                     </div>

// //                                     <div className="row">
// //                                         <div className="col-md-6">
// //                                             <div className="card mb-3">
// //                                                 <div className="card-body">
// //                                                     <h6 className="card-title">Property Summary</h6>
// //                                                     <div id="review-summary">

// //                                                         {/* <!-- Summary will be populated here --> */}
// //                                                     </div>
// //                                                 </div>
// //                                             </div>
// //                                         </div>
// //                                         <div className="col-md-6">
// //                                             <div className="card">
// //                                                 <div className="card-body">
// //                                                     <h6 className="card-title">Listing Preview</h6>
// //                                                     <div id="review-preview">
// //                                                         <div className="text-center p-4">
// //                                                             <i className="bi bi-house" style={{"fontSize": "3rem", "color": "#6c757d"}}></i>
// //                                                             <p className="mt-2">Your listing preview will appear here</p>
// //                                                         </div>
// //                                                     </div>
// //                                                 </div>
// //                                             </div>
// //                                         </div>
// //                                     </div>

// //                                     <div className="form-check mt-4">
// //                                         <input className="form-check-input" type="checkbox" id="terms-agreement" required />
// //                                         <label className="form-check-label" htmlFor="terms-agreement">
// //                                             I agree to the <a href="terms.html">Terms of Service</a> and confirm that all information provided is accurate
// //                                         </label>
// //                                     </div>
// //                                 </div>

// //                                 <div className="d-flex justify-content-between">
// //                                     {/* <button type="button" className="btn btn-outline-secondary" onClick="prevStep()"> */}
// //                                     <button type="button" className="btn btn-outline-secondary" onClick={A}>
// //                                         <i className="bi bi-arrow-left"></i> Previous
// //                                     </button>
// //                                     <div>
// //                                         <button type="button" className="btn btn-outline-primary me-2">
// //                                             <i className="bi bi-save"></i> Save as Draft
// //                                         </button>
// //                                         {/* <button type="button" className="btn btn-success" onClick="submitProperty()"> */}
// //                                         <button type="button" className="btn btn-success" onClick={A}>
// //                                             <i className="bi bi-check-lg"></i> Publish Property
// //                                         </button>
// //                                     </div>
// //                                 </div>
// //                             </div>

// //                         </div>
// //                     {/* </div> */}

// //                 {/* </div> */}

// //             </section>
// //             {/* <!-- /Add Property Form Section --> */}
// //         </main>
// //     );
// // }








// "use client";

// import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
// import Link from 'next/link';
// import { useRouter } from "next/navigation";
// import "./styles.css"
// import { PropertyService } from '@/services/PropertyService';
// import { ImageUploadService } from '@/services/ImageUploadService';
// import { onAuthStateChanged } from 'firebase/auth';
// import { firebaseAuth } from '@/config/firebase';
// import { checkIfAdmin } from '@/utils/checkIfAdmin';

// interface PropertyData {
//   id: string;
//   title: string;
//   description: string;
//   propertyType: string;
//   price: number;
//   status: 'For Sale' | 'For Rent' | 'Sold';
//   address: string;
//   city: string;
//   showAddress: boolean;
//   images: string[];
//   bedrooms?: number;
//   bathrooms?: number;
//   buildingSize?: number;
//   landSize?: number;
//   sizeUnit: string;
//   yearBuilt?: number;
//   garage?: number;
//   zoning?: string;
//   utilities: {
//     water: boolean;
//     electricity: boolean;
//     sewage: boolean;
//     roadAccess: boolean;
//   };
//   hot: boolean;
//   newListing: boolean;
//   featured: boolean;
//   exclusive: boolean;
//   interiorFeatures: string[];
//   exteriorFeatures: string[];
//   customFeatures: string[];
//   videoUrl?: string;
//   virtualTourUrl?: string;
//   showAgent: boolean;
//   agent?: {
//     name: string;
//     title: string;
//     phone: string;
//     email: string;
//     photo?: string;
//   };
// }

// interface ValidationError {
//   field: string;
//   message: string;
// }

// export default function NewPropertyPage() {
//   const router = useRouter();
//   const [currentStep, setCurrentStep] = useState<number>(1);
//   const [selectedPropertyType, setSelectedPropertyType] = useState<string>('');
//   const [uploadedImages, setUploadedImages] = useState<string[]>([]);
//   const [selectedImages, setSelectedImages] = useState<File[]>([]);
//   const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
//   const [interiorFeatures, setInteriorFeatures] = useState<Set<string>>(new Set());
//   const [exteriorFeatures, setExteriorFeatures] = useState<Set<string>>(new Set());
//   const [isDragging, setIsDragging] = useState(false);
//   const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [checking, setChecking] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const dropzoneRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [propertyData, setPropertyData] = useState<PropertyData>({
//     id: '',
//     title: '',
//     description: '',
//     propertyType: '',
//     price: 0,
//     status: 'For Sale',
//     address: '',
//     city: '',
//     showAddress: true,
//     images: [],
//     sizeUnit: 'm2',
//     utilities: {
//       water: false,
//       electricity: false,
//       sewage: false,
//       roadAccess: false
//     },
//     hot: false,
//     newListing: false,
//     featured: false,
//     exclusive: false,
//     interiorFeatures: [],
//     exteriorFeatures: [],
//     customFeatures: [],
//     showAgent: true,
//   });

//   const totalSteps = 5;
//   const progressPercentage = (currentStep / totalSteps) * 100;

//   // Property types
//   const propertyTypes = [
//     { type: 'house', icon: 'bi-house-door', label: 'House' },
//     { type: 'apartment', icon: 'bi-building', label: 'Apartment' },
//     { type: 'villa', icon: 'bi-house-heart', label: 'Villa' },
//     { type: 'commercial', icon: 'bi-shop', label: 'Commercial' },
//     { type: 'land', icon: 'bi-tree', label: 'Land' },
//   ];

//   // Feature tags
//   const featureTags = [
//     { id: 'hot', icon: 'bi-fire', label: 'Hot Property', description: 'Highlight this property as in high demand' },
//     { id: 'newListing', icon: 'bi-star', label: 'New Listing', description: 'Recently added to our listings' },
//     { id: 'featured', icon: 'bi-gem', label: 'Featured', description: 'Prominently featured on homepage' },
//     { id: 'exclusive', icon: 'bi-shield-lock', label: 'Exclusive', description: 'Only available through our agency' },
//   ];

//   // Interior features (grouped by category)
//   const interiorFeaturesList = [
//     { category: 'Floors & Walls', features: ['Hardwood Floors', 'Tile Flooring', 'Carpeted', 'Marble Flooring', 'Wall Paneling'] },
//     { category: 'Kitchen', features: ['Updated Kitchen', 'Granite Countertops', 'Stainless Steel Appliances', 'Kitchen Island', 'Walk-in Pantry'] },
//     { category: 'Living Areas', features: ['Fireplace', 'High Ceilings', 'Home Office', 'Finished Basement', 'Sun Room'] },
//     { category: 'Comfort & Systems', features: ['Central Air Conditioning', 'Smart Home System', 'In-unit Laundry', 'Security System', 'Sound System'] },
//   ];

//   // Exterior features (grouped by category)
//   const exteriorFeaturesList = [
//     { category: 'Outdoor Living', features: ['Swimming Pool', 'Garden', 'Patio/Deck', 'BBQ Area', 'Outdoor Kitchen'] },
//     { category: 'Recreation', features: ['Tennis Court', 'Playground', 'Basketball Court', 'Putting Green', 'Jacuzzi'] },
//     { category: 'Parking & Access', features: ['Garage', 'Parking Lot', 'Gated Community', 'Elevator', 'Ramp Access'] },
//     { category: 'Landscaping', features: ['Sprinkler System', 'Mature Trees', 'Fenced Yard', 'Garden Shed', 'Greenhouse'] },
//   ];

//   // Step validation rules
//   const stepValidationRules = {
//     1: (data: PropertyData) => {
//       const errors: ValidationError[] = [];
//       if (!data.title.trim()) errors.push({ field: 'title', message: 'Property title is required' });
//       if (!data.propertyType) errors.push({ field: 'propertyType', message: 'Please select a property type' });
//       if (data.price <= 0) errors.push({ field: 'price', message: 'Price must be greater than 0' });
//       if (!data.description.trim() || data.description.length < 100) 
//         errors.push({ field: 'description', message: 'Description must be at least 100 characters' });
//       if (!data.address.trim()) errors.push({ field: 'address', message: 'Address is required' });
//       if (!data.city.trim()) errors.push({ field: 'city', message: 'City is required' });
//       return errors;
//     },
//     2: (data: PropertyData) => {
//       const errors: ValidationError[] = [];
//       if (data.propertyType !== 'land' && data.propertyType !== 'commercial') {
//         if (!data.bedrooms && data.bedrooms !== 0) 
//           errors.push({ field: 'bedrooms', message: 'Number of bedrooms is required' });
//         if (!data.buildingSize) 
//           errors.push({ field: 'buildingSize', message: 'Building size is required' });
//       }
//       if (data.propertyType === 'land' && !data.landSize) {
//         errors.push({ field: 'landSize', message: 'Land size is required' });
//       }
//       return errors;
//     },
//     4: () => {
//       const errors: ValidationError[] = [];
//       if (uploadedImages.length === 0) 
//         errors.push({ field: 'images', message: 'At least one property image is required' });
//       return errors;
//     }
//   };

//   // Handle property type selection
//   const handlePropertyTypeSelect = (type: string) => {
//     setSelectedPropertyType(type);
//     setPropertyData(prev => ({ ...prev, propertyType: type }));
//     clearValidationError('propertyType');
//   };

//   // Toggle feature tag
//   const toggleFeatureTag = (feature: string) => {
//     setSelectedFeatures(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(feature)) {
//         newSet.delete(feature);
//       } else {
//         newSet.add(feature);
//       }
//       return newSet;
//     });
//   };

//   // Toggle interior feature
//   const toggleInteriorFeature = (feature: string) => {
//     setInteriorFeatures(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(feature)) {
//         newSet.delete(feature);
//       } else {
//         newSet.add(feature);
//       }
//       return newSet;
//     });
//   };

//   // Toggle exterior feature
//   const toggleExteriorFeature = (feature: string) => {
//     setExteriorFeatures(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(feature)) {
//         newSet.delete(feature);
//       } else {
//         newSet.add(feature);
//       }
//       return newSet;
//     });
//   };

//   // Handle input changes with validation
//   const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
    
//     clearValidationError(name);
    
//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
//       if (name.startsWith('utilities.')) {
//         const utilityKey = name.split('.')[1] as keyof PropertyData['utilities'];
//         setPropertyData(prev => ({
//           ...prev,
//           utilities: {
//             ...prev.utilities,
//             [utilityKey]: checked
//           }
//         }));
//       } else {
//         setPropertyData(prev => ({ ...prev, [name]: checked }));
//       }
//     } else if (type === 'number') {
//       const numValue = value === '' ? undefined : parseFloat(value);
//       setPropertyData(prev => ({ ...prev, [name]: numValue }));
      
//       // Validate price
//       if (name === 'price' && parseFloat(value) <= 0) {
//         setValidationErrors(prev => [...prev, { field: 'price', message: 'Price must be greater than 0' }]);
//       }
//     } else {
//       setPropertyData(prev => ({ ...prev, [name]: value }));
      
//       // Validate required fields
//       if (name === 'title' && !value.trim()) {
//         setValidationErrors(prev => [...prev, { field: 'title', message: 'Property title is required' }]);
//       }
//       if (name === 'description' && value.length < 100) {
//         setValidationErrors(prev => [...prev, { field: 'description', message: 'Description must be at least 100 characters' }]);
//       }
//     }
//   };

//   // Clear validation error
//   const clearValidationError = (fieldName: string) => {
//     setValidationErrors(prev => prev.filter(error => error.field !== fieldName));
//   };

//   // File validation
//   const validateFile = (file: File): boolean => {
//     const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
//     const maxSize = 5 * 1024 * 1024; // 5MB
    
//     if (!validTypes.includes(file.type)) {
//       alert(`File type not supported: ${file.type}. Please upload JPG, PNG, or WEBP files.`);
//       return false;
//     }
    
//     if (file.size > maxSize) {
//       alert(`File ${file.name} is too large. Maximum size is 5MB.`);
//       return false;
//     }
    
//     return true;
//   };

//   // Handle file upload
//   const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;

//     const validFiles = Array.from(files).filter(validateFile);
//     if (validFiles.length === 0) return;
    
//     const fileArray = Array.from(validFiles);
    
//     // Save original files for upload
//     setSelectedImages((prev) => [...prev, ...fileArray]);

//     // Generate preview URLs
//     const previews = fileArray.map((file) => URL.createObjectURL(file));

//     setUploadedImages((prev) => [...prev, ...previews]);
//     clearValidationError('images');

//     // Update property data
//     setPropertyData((prev) => ({
//       ...prev,
//       images: [...prev.images, ...previews],
//     }));
//   };

//   // Drag event handlers
//   const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(true);
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
    
//     const files = e.dataTransfer.files;
//     if (!files || files.length === 0) return;

//     const validFiles = Array.from(files).filter(validateFile);
//     if (validFiles.length === 0) return;
    
//     // Create a fake event object to reuse the handleFileUpload function
//     const dataTransfer = new DataTransfer();
//     validFiles.forEach(file => dataTransfer.items.add(file));
    
//     // Trigger file input
//     if (fileInputRef.current) {
//       fileInputRef.current.files = dataTransfer.files;
//       handleFileUpload({ target: { files: dataTransfer.files } } as ChangeEvent<HTMLInputElement>);
//     }
//   };

//   // Remove image
//   const removeImage = (index: number) => {
//     // Revoke the object URL to prevent memory leaks
//     URL.revokeObjectURL(uploadedImages[index]);
    
//     setUploadedImages(prev => prev.filter((_, i) => i !== index));
//     setSelectedImages(prev => prev.filter((_, i) => i !== index));
//     setPropertyData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//   };

//   // Handle custom features
//   const handleCustomFeatures = (e: ChangeEvent<HTMLInputElement>) => {
//     const features = e.target.value
//       .split(',')
//       .map(f => f.trim())
//       .filter(f => f.length > 0);
    
//     setPropertyData(prev => ({ ...prev, customFeatures: features }));
//   };

//   // Navigation functions with validation
//   const nextStep = () => {
//     const validator = stepValidationRules[currentStep as keyof typeof stepValidationRules];
//     if (validator) {
//       const errors = validator(propertyData);
//       if (errors.length > 0) {
//         setValidationErrors(errors);
        
//         // Scroll to first error
//         const firstErrorField = document.querySelector(`[name="${errors[0].field}"]`);
//         if (firstErrorField) {
//           firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//         return;
//       }
//     }
    
//     setValidationErrors([]);
//     setCurrentStep(prev => Math.min(prev + 1, totalSteps));
//   };

//   const prevStep = () => {
//     setValidationErrors([]);
//     setCurrentStep(prev => Math.max(prev - 1, 1));
//   };

//   // Generate ID
//   const generateId = (): string => {
//     return 'prop_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
//   };

//   // Submit property
//   const imageService = new ImageUploadService();
//   const propertyService = new PropertyService();

//   const submitProperty = async (e: FormEvent) => {
//     e.preventDefault();
    
//     const termsCheckbox = document.getElementById("terms-agreement") as HTMLInputElement;
//     if (!termsCheckbox?.checked) {
//       alert("Please agree to the Terms of Service before publishing.");
//       termsCheckbox.focus();
//       return;
//     }

//     // Validate all steps
//     const allErrors: ValidationError[] = [];
//     Object.values(stepValidationRules).forEach(validator => {
//       if (validator) {
//         allErrors.push(...validator(propertyData));
//       }
//     });

//     if (allErrors.length > 0) {
//       setValidationErrors(allErrors);
//       alert('Please fix all validation errors before submitting.');
//       return;
//     }

//     if (uploadedImages.length === 0) {
//       alert('Please upload at least one property image.');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       /* 1️⃣ Upload images to ImgBB */
//       const uploadedImageUrls: string[] = [];
      
//       for (const file of selectedImages) {
//         try {
//           const url = await imageService.upload(file);
//           uploadedImageUrls.push(url);
//         } catch (error) {
//           console.error('Error uploading image:', error);
//           throw new Error(`Failed to upload image: ${file.name}`);
//         }
//       }

//       /* 2️⃣ Build final clean domain object */
//       const finalData = {
//         ...propertyData,
//         id: generateId(),
//         images: uploadedImageUrls,
//         hot: selectedFeatures.has("hot"),
//         newListing: selectedFeatures.has("newListing"),
//         featured: selectedFeatures.has("featured"),
//         exclusive: selectedFeatures.has("exclusive"),
//         interiorFeatures: Array.from(interiorFeatures),
//         exteriorFeatures: Array.from(exteriorFeatures),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         published: true
//       };

//       if (!propertyData.showAgent) {
//         delete (finalData as any).agent;
//       }

//       /* 3️⃣ Save to Firebase */
//       await propertyService.create(finalData);

//       /* 4️⃣ Clear draft and redirect */
//       localStorage.removeItem('propertyDraft');
//       alert("Property published successfully!");
//       router.push("/admin/properties");
      
//     } catch (error: any) {
//       console.error("Error submitting property:", error);
//       alert(`Failed to publish property: ${error.message || 'Please try again.'}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Save as draft
//   const saveAsDraft = () => {
//     const draftData = {
//       ...propertyData,
//       hot: selectedFeatures.has('hot'),
//       newListing: selectedFeatures.has('newListing'),
//       featured: selectedFeatures.has('featured'),
//       exclusive: selectedFeatures.has('exclusive'),
//       interiorFeatures: Array.from(interiorFeatures),
//       exteriorFeatures: Array.from(exteriorFeatures),
//       draft: true,
//       lastSaved: new Date().toISOString()
//     };

//     localStorage.setItem('propertyDraft', JSON.stringify(draftData));
//     alert('Draft saved successfully! You can continue editing later.');
//   };

//   // Load draft if exists
//   useEffect(() => {
//     const savedDraft = localStorage.getItem('propertyDraft');
//     if (savedDraft) {
//       try {
//         const draft = JSON.parse(savedDraft);
//         setPropertyData(draft);
//         if (draft.propertyType) setSelectedPropertyType(draft.propertyType);
//         if (draft.images) setUploadedImages(draft.images);
//         if (draft.hot) setSelectedFeatures(prev => new Set([...prev, 'hot']));
//         if (draft.newListing) setSelectedFeatures(prev => new Set([...prev, 'newListing']));
//         if (draft.featured) setSelectedFeatures(prev => new Set([...prev, 'featured']));
//         if (draft.exclusive) setSelectedFeatures(prev => new Set([...prev, 'exclusive']));
//         if (draft.interiorFeatures) setInteriorFeatures(new Set(draft.interiorFeatures));
//         if (draft.exteriorFeatures) setExteriorFeatures(new Set(draft.exteriorFeatures));
        
//         console.log('Loaded draft data');
//       } catch (error) {
//         console.error('Error loading draft:', error);
//       }
//     }
//   }, []);

//   // Update propertyData when features change
//   useEffect(() => {
//     setPropertyData(prev => ({
//       ...prev,
//       hot: selectedFeatures.has('hot'),
//       newListing: selectedFeatures.has('newListing'),
//       featured: selectedFeatures.has('featured'),
//       exclusive: selectedFeatures.has('exclusive')
//     }));
//   }, [selectedFeatures]);

//   // Clean up object URLs
//   useEffect(() => {
//     return () => {
//       uploadedImages.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [uploadedImages]);

//   // Authentication check
//   useEffect(() => {
//     const unsub = onAuthStateChanged(firebaseAuth, async (user) => {
//       if (!user) {
//         router.replace("/login");
//         return;
//       }

//       const admin = await checkIfAdmin(user);

//       if (!admin) {
//         router.replace("/");
//         return;
//       }

//       setIsAdmin(true);
//       setChecking(false);
//     });

//     return () => unsub();
//   }, [router]);

//   // Show loading while checking authentication
//   if (checking) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-3">Verifying permissions...</p>
//         </div>
//       </div>
//     );
//   }

//   // Show access denied if not admin
//   if (!isAdmin) {
//     return (
//       <div className="container py-5">
//         <div className="alert alert-danger">
//           <h4 className="alert-heading">Access Denied</h4>
//           <p>You don't have permission to access this page.</p>
//           <Link href="/" className="btn btn-primary">Return to Home</Link>
//         </div>
//       </div>
//     );
//   }

//   // Render property specifications based on type
//   const renderPropertySpecifications = () => {
//     switch (selectedPropertyType) {
//       case 'land':
//         return (
//           <>
//             <div className="row">
//               <div className="col-md-6 mb-4">
//                 <label htmlFor="land-size" className="form-label required-label">
//                   Total Land Size <span className="text-danger">*</span>
//                 </label>
//                 <div className="input-group">
//                   <input 
//                     type="number" 
//                     className={`form-control ${validationErrors.some(e => e.field === 'landSize') ? 'is-invalid' : ''}`}
//                     id="land-size" 
//                     min="0" 
//                     step="0.01"
//                     placeholder="0" 
//                     value={propertyData.landSize || ''}
//                     onChange={handleInputChange}
//                     name="landSize"
//                   />
//                   <select 
//                     className="form-select" 
//                     id="size-unit" 
//                     style={{maxWidth: "120px"}}
//                     value={propertyData.sizeUnit}
//                     onChange={handleInputChange}
//                     name="sizeUnit"
//                   >
//                     <option value="m2">m²</option>
//                     <option value="ft2">ft²</option>
//                     <option value="acre">Acre</option>
//                     <option value="hectare">Hectare</option>
//                   </select>
//                 </div>
//                 <div className="form-text">Total area including all outdoor spaces</div>
//               </div>
//               <div className="col-md-6 mb-4">
//                 <label htmlFor="zoning" className="form-label">Zoning Type</label>
//                 <select 
//                   className="form-select" 
//                   id="zoning"
//                   value={propertyData.zoning || ''}
//                   onChange={handleInputChange}
//                   name="zoning"
//                 >
//                   <option value="">Select Zoning</option>
//                   <option value="residential">Residential</option>
//                   <option value="commercial">Commercial</option>
//                   <option value="industrial">Industrial</option>
//                   <option value="agricultural">Agricultural</option>
//                   <option value="mixed-use">Mixed-Use</option>
//                   <option value="recreational">Recreational</option>
//                 </select>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-12">
//                 <label className="form-label mb-3">Utilities Available</label>
//                 <div className="land-utilities-grid">
//                   {[
//                     { id: 'water', label: 'Water Connection', key: 'water' },
//                     { id: 'electricity', label: 'Electricity', key: 'electricity' },
//                     { id: 'sewage', label: 'Sewage System', key: 'sewage' },
//                     { id: 'road-access', label: 'Paved Road Access', key: 'roadAccess' }
//                   ].map(utility => (
//                     <div className="form-check" key={utility.id}>
//                       <input 
//                         className="form-check-input" 
//                         type="checkbox" 
//                         id={`${utility.id}-utility`}
//                         checked={propertyData.utilities[utility.key as keyof PropertyData['utilities']]}
//                         onChange={handleInputChange}
//                         name={`utilities.${utility.key}`}
//                       />
//                       <label className="form-check-label" htmlFor={`${utility.id}-utility`}>
//                         {utility.label}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </>
//         );

//       default:
//         return (
//           <>
//             <div className="row">
//               <div className="col-md-3 mb-4">
//                 <label htmlFor="bedrooms" className="form-label required-label">
//                   Bedrooms <span className="text-danger">*</span>
//                 </label>
//                 <input 
//                   type="number" 
//                   className={`form-control ${validationErrors.some(e => e.field === 'bedrooms') ? 'is-invalid' : ''}`}
//                   id="bedrooms" 
//                   min="0" 
//                   max="20"
//                   placeholder="0" 
//                   value={propertyData.bedrooms || ''}
//                   onChange={handleInputChange}
//                   name="bedrooms"
//                 />
//                 <div className="form-text">Enter 0 for studio apartments</div>
//               </div>
//               <div className="col-md-3 mb-4">
//                 <label htmlFor="bathrooms" className="form-label">Bathrooms</label>
//                 <input 
//                   type="number" 
//                   className="form-control" 
//                   id="bathrooms" 
//                   min="0" 
//                   max="20"
//                   step="0.5" 
//                   placeholder="0" 
//                   value={propertyData.bathrooms || ''}
//                   onChange={handleInputChange}
//                   name="bathrooms"
//                 />
//                 <div className="form-text">0.5 = toilet only</div>
//               </div>
//               <div className="col-md-3 mb-4">
//                 <label htmlFor="garage" className="form-label">Garage Spaces</label>
//                 <input 
//                   type="number" 
//                   className="form-control" 
//                   id="garage" 
//                   min="0" 
//                   max="10"
//                   placeholder="0" 
//                   value={propertyData.garage || ''}
//                   onChange={handleInputChange}
//                   name="garage"
//                 />
//               </div>
//               <div className="col-md-3 mb-4">
//                 <label htmlFor="year-built" className="form-label">Year Built</label>
//                 <input 
//                   type="number" 
//                   className="form-control" 
//                   id="year-built" 
//                   min="1800" 
//                   max={new Date().getFullYear() + 1}
//                   placeholder="YYYY" 
//                   value={propertyData.yearBuilt || ''}
//                   onChange={handleInputChange}
//                   name="yearBuilt"
//                 />
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-md-6 mb-4">
//                 <label htmlFor="building-size" className="form-label required-label">
//                   Building Size <span className="text-danger">*</span>
//                 </label>
//                 <div className="input-group">
//                   <input 
//                     type="number" 
//                     className={`form-control ${validationErrors.some(e => e.field === 'buildingSize') ? 'is-invalid' : ''}`}
//                     id="building-size" 
//                     min="0" 
//                     step="0.1"
//                     placeholder="0" 
//                     value={propertyData.buildingSize || ''}
//                     onChange={handleInputChange}
//                     name="buildingSize"
//                   />
//                   <select 
//                     className="form-select" 
//                     id="size-unit" 
//                     style={{maxWidth: "100px"}}
//                     value={propertyData.sizeUnit}
//                     onChange={handleInputChange}
//                     name="sizeUnit"
//                   >
//                     <option value="m2">m²</option>
//                     <option value="ft2">ft²</option>
//                     <option value="sqm">sqm</option>
//                     <option value="sqft">sqft</option>
//                   </select>
//                 </div>
//                 <div className="form-text">Size of the building structure (excluding outdoor areas)</div>
//               </div>
              
//               <div className="col-md-6 mb-4">
//                 <label htmlFor="land-size" className="form-label">
//                   Total Land Size
//                 </label>
//                 <div className="input-group">
//                   <input 
//                     type="number" 
//                     className="form-control" 
//                     id="land-size" 
//                     min="0" 
//                     step="0.01"
//                     placeholder="0" 
//                     value={propertyData.landSize || ''}
//                     onChange={handleInputChange}
//                     name="landSize"
//                   />
//                   <select 
//                     className="form-select" 
//                     id="land-size-unit" 
//                     style={{maxWidth: "120px"}}
//                     value={propertyData.sizeUnit}
//                     onChange={handleInputChange}
//                     name="sizeUnit"
//                     disabled
//                   >
//                     <option value="m2">m²</option>
//                     <option value="ft2">ft²</option>
//                     <option value="acre">Acre</option>
//                     <option value="hectare">Hectare</option>
//                   </select>
//                 </div>
//                 <div className="form-text">Total property area including garden, pool, driveway, etc.</div>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-12">
//                 <div className="alert alert-info">
//                   <i className="bi bi-info-circle me-2"></i>
//                   <strong>Size Guide:</strong> 
//                   <ul className="mb-0 mt-2">
//                     <li><strong>Building Size:</strong> Interior living space only (house/apartment structure)</li>
//                     <li><strong>Land Size:</strong> Total property area including all outdoor spaces</li>
//                     <li>For apartments, land size typically equals building size</li>
//                     <li>For villas/houses, land size includes garden, pool, driveway, etc.</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </>
//         );
//     }
//   };

//   return (
//     <main className="main">
//       {/* Page Title */}
//       <div className="page-title">
//         <div className="heading">
//           <div className="container">
//             <div className="row d-flex justify-content-center text-center">
//               <div className="col-lg-8">
//                 <h1 className="heading-title">Add New Property</h1>
//                 <p className="mb-0">
//                   List your property with us and reach thousands of potential buyers. Fill in the details below to get started.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <nav className="breadcrumbs">
//           <div className="container">
//             <ol>
//               <li><Link href="/">Home</Link></li>
//               <li><Link href="/admin">Admin</Link></li>
//               <li className="current">Add New Property</li>
//             </ol>
//           </div>
//         </nav>
//       </div>
//       {/* End Page Title */}

//       {/* Add Property Form Section */}
//       <section id="add-property" className="add-property section">
//         <div className="container" data-aos="fade-up" data-aos-delay="100">

//           {/* Progress Indicator */}
//           <div className="step-indicator">
//             {[1, 2, 3, 4, 5].map(step => (
//               <div 
//                 key={step}
//                 className={`step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
//                 data-step={step}
//               >
//                 <div className="step-number">{step}</div>
//                 <div className="step-label">
//                   {step === 1 && 'Basic Info'}
//                   {step === 2 && 'Details'}
//                   {step === 3 && 'Features'}
//                   {step === 4 && 'Media'}
//                   {step === 5 && 'Review'}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Form Progress */}
//           <div className="progress-bar mb-4">
//             <div className="progress-fill" style={{width: `${progressPercentage}%`}}></div>
//           </div>

//           {/* Validation Errors */}
//           {validationErrors.length > 0 && (
//             <div className="alert alert-danger">
//               <h5 className="alert-heading">Please fix the following errors:</h5>
//               <ul className="mb-0">
//                 {validationErrors.map((error, index) => (
//                   <li key={index}>{error.message}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* Step 1: Basic Information */}
//           {currentStep === 1 && (
//             <div className="form-step active">
//               <div className="form-section">
//                 <h4><i className="bi bi-info-circle me-2"></i>Basic Information</h4>

//                 <div className="row">
//                   <div className="col-md-12 mb-4">
//                     <label htmlFor="property-title" className="form-label required-label">
//                       Property Title <span className="text-danger">*</span>
//                     </label>
//                     <input 
//                       type="text" 
//                       className={`form-control ${validationErrors.some(e => e.field === 'title') ? 'is-invalid' : ''}`}
//                       id="property-title" 
//                       placeholder="e.g., Modern Luxury Villa with Pool" 
//                       value={propertyData.title}
//                       onChange={handleInputChange}
//                       name="title"
//                       required
//                     />
//                     <div className="form-text">Make it descriptive and appealing to potential buyers</div>
//                     <div className="form-text text-muted">
//                       Character count: {propertyData.title.length} (Minimum 10 characters)
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6 mb-4">
//                     <label className="form-label required-label">
//                       Property Type <span className="text-danger">*</span>
//                     </label>
//                     <div className="row g-3" id="property-type-selection">
//                       {propertyTypes.map(({type, icon, label}) => (
//                         <div className="col-6 col-md-4 col-lg-3" key={type}>
//                           <button
//                             type="button"
//                             className={`property-type-btn ${selectedPropertyType === type ? 'active' : ''} ${validationErrors.some(e => e.field === 'propertyType') ? 'border-danger' : ''}`}
//                             data-type={type}
//                             onClick={() => handlePropertyTypeSelect(type)}
//                           >
//                             <i className={`bi ${icon}`}></i>
//                             <div>{label}</div>
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                     {validationErrors.some(e => e.field === 'propertyType') && (
//                       <div className="text-danger small mt-1">Please select a property type</div>
//                     )}
//                   </div>

//                   <div className="col-md-6 mb-4">
//                     <label className="form-label required-label">Property Status</label>
//                     <div className="btn-group w-100" role="group">
//                       {(['For Sale', 'For Rent', 'Sold'] as const).map(status => (
//                         <div key={status}>
//                           <input 
//                             type="radio" 
//                             className="btn-check" 
//                             name="status" 
//                             id={`status-${status.toLowerCase().replace(' ', '-')}`} 
//                             value={status}
//                             checked={propertyData.status === status}
//                             onChange={handleInputChange}
//                           />
//                           <label 
//                             className="btn btn-outline-primary" 
//                             htmlFor={`status-${status.toLowerCase().replace(' ', '-')}`}
//                           >
//                             {status}
//                           </label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6 mb-4">
//                     <label htmlFor="price" className="form-label required-label">
//                       Price <span className="text-danger">*</span>
//                     </label>
//                     <div className="input-group">
//                       <span className="input-group-text">$</span>
//                       <input 
//                         type="number" 
//                         className={`form-control ${validationErrors.some(e => e.field === 'price') ? 'is-invalid' : ''}`}
//                         id="price" 
//                         placeholder="0.00" 
//                         min="0" 
//                         step="0.01" 
//                         value={propertyData.price || ''}
//                         onChange={handleInputChange}
//                         name="price"
//                         required 
//                       />
//                       <span className="input-group-text">
//                         {propertyData.status === 'For Rent' ? '/month' : 'total'}
//                       </span>
//                     </div>
//                     {propertyData.price > 0 && (
//                       <div className="form-text">
//                         Formatted: ${propertyData.price.toLocaleString()}{propertyData.status === 'For Rent' ? '/month' : ''}
//                       </div>
//                     )}
//                   </div>
//                   <div className="col-md-6 mb-4">
//                     <label htmlFor="description" className="form-label required-label">
//                       Description <span className="text-danger">*</span>
//                     </label>
//                     <textarea 
//                       className={`form-control ${validationErrors.some(e => e.field === 'description') ? 'is-invalid' : ''}`}
//                       id="description" 
//                       rows={5}
//                       placeholder="Describe your property in detail. Include key features, neighborhood information, and unique selling points..." 
//                       value={propertyData.description}
//                       onChange={handleInputChange}
//                       name="description"
//                       required
//                     ></textarea>
//                     <div className="form-text">
//                       Character count: {propertyData.description.length} (Minimum 100 characters recommended)
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="form-section">
//                 <h4><i className="bi bi-geo-alt me-2"></i>Location Details</h4>

//                 <div className="row">
//                   <div className="col-md-8 mb-4">
//                     <label htmlFor="address" className="form-label required-label">
//                       Full Address <span className="text-danger">*</span>
//                     </label>
//                     <input 
//                       type="text" 
//                       className={`form-control ${validationErrors.some(e => e.field === 'address') ? 'is-invalid' : ''}`}
//                       id="address" 
//                       placeholder="e.g., 1234 Maple Street, Beverly Hills" 
//                       value={propertyData.address}
//                       onChange={handleInputChange}
//                       name="address"
//                       required 
//                     />
//                   </div>
//                   <div className="col-md-4 mb-4">
//                     <label htmlFor="city" className="form-label required-label">
//                       City <span className="text-danger">*</span>
//                     </label>
//                     <input 
//                       type="text" 
//                       className={`form-control ${validationErrors.some(e => e.field === 'city') ? 'is-invalid' : ''}`}
//                       id="city" 
//                       placeholder="e.g., Los Angeles" 
//                       value={propertyData.city}
//                       onChange={handleInputChange}
//                       name="city"
//                       required 
//                     />
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-12 mb-4">
//                     <div className="form-check form-switch">
//                       <input 
//                         className="form-check-input" 
//                         type="checkbox" 
//                         id="show-address" 
//                         checked={propertyData.showAddress}
//                         onChange={handleInputChange}
//                         name="showAddress"
//                       />
//                       <label className="form-check-label" htmlFor="show-address">
//                         Show exact address to potential buyers
//                       </label>
//                       <div className="form-text text-muted">
//                         If unchecked, only the general area will be shown to protect privacy
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-12">
//                     <div id="location-map" className="location-map-placeholder">
//                       <div className="text-center py-5">
//                         <i className="bi bi-map" style={{fontSize: "3rem", color: "#6c757d"}}></i>
//                         <p className="mt-2">Map integration available with Google Maps API</p>
//                         <button type="button" className="btn btn-outline-primary btn-sm mt-2" disabled>
//                           <i className="bi bi-pin-map"></i> Set Location on Map
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="d-flex justify-content-between mt-4">
//                 <div>
//                   <button type="button" className="btn btn-outline-secondary" onClick={saveAsDraft}>
//                     <i className="bi bi-save"></i> Save Draft
//                   </button>
//                 </div>
//                 <button type="button" className="btn btn-primary" onClick={nextStep}>
//                   Next: Property Details <i className="bi bi-arrow-right"></i>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 2: Property Details */}
//           {currentStep === 2 && (
//             <div className="form-step active">
//               <div className="form-section">
//                 <h4><i className="bi bi-rulers me-2"></i>Property Specifications</h4>
//                 {renderPropertySpecifications()}
//               </div>

//               <div className="form-section">
//                 <h4><i className="bi bi-tags me-2"></i>Property Labels</h4>
//                 <p className="text-muted mb-4">Select labels that apply to your property to help it stand out</p>

//                 <div className="row g-3">
//                   {featureTags.map(tag => (
//                     <div className="col-md-6" key={tag.id}>
//                       <div 
//                         className={`feature-tag-card ${selectedFeatures.has(tag.id) ? 'active' : ''}`}
//                         onClick={() => toggleFeatureTag(tag.id)}
//                       >
//                         <div className="d-flex align-items-center">
//                           <div className="feature-icon">
//                             <i className={`bi ${tag.icon}`}></i>
//                           </div>
//                           <div className="ms-3">
//                             <h6 className="mb-0">{tag.label}</h6>
//                             <p className="text-muted small mb-0">{tag.description}</p>
//                           </div>
//                           <div className="ms-auto">
//                             <input 
//                               type="checkbox" 
//                               checked={selectedFeatures.has(tag.id)}
//                               onChange={() => {}}
//                               className="form-check-input"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="d-flex justify-content-between mt-4">
//                 <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
//                   <i className="bi bi-arrow-left"></i> Back to Basic Info
//                 </button>
//                 <button type="button" className="btn btn-primary" onClick={nextStep}>
//                   Next: Features & Amenities <i className="bi bi-arrow-right"></i>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 3: Amenities & Features */}
//           {currentStep === 3 && (
//             <div className="form-step active">
//               <div className="form-section">
//                 <h4><i className="bi bi-house-door me-2"></i>Interior Features</h4>
//                 {interiorFeaturesList.map((category, index) => (
//                   <div key={index} className="mb-4">
//                     <h6 className="text-primary mb-3">{category.category}</h6>
//                     <div className="row g-2">
//                       {category.features.map(feature => (
//                         <div className="col-md-6 col-lg-4" key={feature}>
//                           <div className="form-check">
//                             <input 
//                               className="form-check-input" 
//                               type="checkbox" 
//                               id={`int-${feature.toLowerCase().replace(/[ /]/g, '-')}`}
//                               checked={interiorFeatures.has(feature)}
//                               onChange={() => toggleInteriorFeature(feature)}
//                             />
//                             <label className="form-check-label" htmlFor={`int-${feature.toLowerCase().replace(/[ /]/g, '-')}`}>
//                               {feature}
//                             </label>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="form-section">
//                 <h4><i className="bi bi-tree me-2"></i>Exterior Features</h4>
//                 {exteriorFeaturesList.map((category, index) => (
//                   <div key={index} className="mb-4">
//                     <h6 className="text-primary mb-3">{category.category}</h6>
//                     <div className="row g-2">
//                       {category.features.map(feature => (
//                         <div className="col-md-6 col-lg-4" key={feature}>
//                           <div className="form-check">
//                             <input 
//                               className="form-check-input" 
//                               type="checkbox" 
//                               id={`ext-${feature.toLowerCase().replace(/[ /]/g, '-')}`}
//                               checked={exteriorFeatures.has(feature)}
//                               onChange={() => toggleExteriorFeature(feature)}
//                             />
//                             <label className="form-check-label" htmlFor={`ext-${feature.toLowerCase().replace(/[ /]/g, '-')}`}>
//                               {feature}
//                             </label>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="form-section">
//                 <h4><i className="bi bi-plus-circle me-2"></i>Custom Features</h4>
//                 <div className="mb-3">
//                   <label htmlFor="custom-features" className="form-label">
//                     Add custom features not listed above
//                   </label>
//                   <input 
//                     type="text" 
//                     className="form-control" 
//                     id="custom-features" 
//                     placeholder="e.g., Wine cellar, Home theater, Sauna, Solar panels"
//                     onChange={handleCustomFeatures}
//                   />
//                   <div className="form-text">
//                     Separate features with commas. {propertyData.customFeatures.length} features added.
//                   </div>
                  
//                   {propertyData.customFeatures.length > 0 && (
//                     <div className="mt-3">
//                       <div className="d-flex flex-wrap gap-2">
//                         {propertyData.customFeatures.map((feature, index) => (
//                           <span key={index} className="badge bg-secondary">
//                             {feature} <button 
//                               type="button" 
//                               className="btn-close btn-close-white ms-1" 
//                               style={{fontSize: '0.5rem'}}
//                               onClick={() => {
//                                 setPropertyData(prev => ({
//                                   ...prev,
//                                   customFeatures: prev.customFeatures.filter((_, i) => i !== index)
//                                 }));
//                               }}
//                             ></button>
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="d-flex justify-content-between mt-4">
//                 <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
//                   <i className="bi bi-arrow-left"></i> Back to Details
//                 </button>
//                 <button type="button" className="btn btn-primary" onClick={nextStep}>
//                   Next: Media & Images <i className="bi bi-arrow-right"></i>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 4: Media & Images */}
//           {currentStep === 4 && (
//             <div className="form-step active">
//               <div className="form-section">
//                 <h4><i className="bi bi-images me-2"></i>Property Images</h4>
//                 <p className="text-muted mb-4">
//                   Upload high-quality images of your property. First image will be the cover photo.
//                   {validationErrors.some(e => e.field === 'images') && (
//                     <span className="text-danger ms-2">At least one image is required</span>
//                   )}
//                 </p>

//                 <div className="mb-4">
//                   <div 
//                     id="image-dropzone" 
//                     className={`dropzone ${isDragging ? 'dragging' : ''} ${validationErrors.some(e => e.field === 'images') ? 'border-danger' : ''}`}
//                     onClick={() => fileInputRef.current?.click()}
//                     onDragEnter={handleDragEnter}
//                     onDragLeave={handleDragLeave}
//                     onDragOver={handleDragOver}
//                     onDrop={handleDrop}
//                     ref={dropzoneRef}
//                   >
//                     <i className={`bi bi-cloud-arrow-up ${isDragging ? 'text-primary' : ''}`} style={{fontSize: "3rem"}}></i>
//                     <h5 className="mt-3">
//                       {isDragging ? 'Drop images here' : 'Drag & drop images or click to browse'}
//                     </h5>
//                     <p className="text-muted">Supported formats: JPG, PNG, WEBP (Max 5MB each)</p>
//                     <button type="button" className="btn btn-outline-primary mt-2">
//                       <i className="bi bi-folder2-open me-2"></i> Browse Files
//                     </button>
//                     <input 
//                       type="file" 
//                       ref={fileInputRef}
//                       style={{display: 'none'}}
//                       multiple
//                       accept="image/*"
//                       onChange={handleFileUpload}
//                     />
//                   </div>
//                 </div>

//                 {uploadedImages.length > 0 && (
//                   <div className="mb-4">
//                     <h6>Uploaded Images ({uploadedImages.length})</h6>
//                     <div className="image-preview-container">
//                       {uploadedImages.map((image, index) => (
//                         <div className="image-preview" key={index}>
//                           <div className="image-preview-inner">
//                             <img src={image} alt={`Property ${index + 1}`} />
//                             <div className="image-actions">
//                               <button 
//                                 type="button" 
//                                 className="btn btn-sm btn-danger"
//                                 onClick={() => removeImage(index)}
//                                 title="Remove image"
//                               >
//                                 <i className="bi bi-trash"></i>
//                               </button>
//                               {index === 0 && (
//                                 <span className="badge bg-primary">Cover</span>
//                               )}
//                             </div>
//                             <div className="image-number">{index + 1}</div>
//                           </div>
//                           {index === 0 && (
//                             <div className="image-label text-center small mt-1">Cover Image</div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                     <div className="mt-2">
//                       <button 
//                         type="button" 
//                         className="btn btn-sm btn-outline-secondary"
//                         onClick={() => {
//                           if (uploadedImages.length > 1) {
//                             const newOrder = [...uploadedImages];
//                             const first = newOrder.shift();
//                             if (first) newOrder.push(first);
//                             setUploadedImages(newOrder);
//                             setPropertyData(prev => ({ ...prev, images: newOrder }));
//                           }
//                         }}
//                       >
//                         <i className="bi bi-arrow-clockwise me-1"></i> Rotate Cover Image
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 <div className="alert alert-info mt-4">
//                   <i className="bi bi-info-circle me-2"></i>
//                   <strong>Image Tips:</strong> Include photos of all rooms, exterior views, amenities, and neighborhood features. 
//                   High-quality photos can increase views by up to 40%. Recommended order: Exterior, Living room, Kitchen, Bedrooms, Bathrooms, Amenities.
//                 </div>
//               </div>

//               <div className="form-section">
//                 <h4><i className="bi bi-camera-video me-2"></i>Virtual Tour & Videos</h4>

//                 <div className="mb-4">
//                   <label htmlFor="video-url" className="form-label">Video URL (YouTube, Vimeo)</label>
//                   <input 
//                     type="url" 
//                     className="form-control" 
//                     id="video-url" 
//                     placeholder="https://www.youtube.com/watch?v=..."
//                     value={propertyData.videoUrl || ''}
//                     onChange={handleInputChange}
//                     name="videoUrl"
//                   />
//                   <div className="form-text">Add a link to a video tour of your property</div>
//                 </div>

//                 <div className="mb-4">
//                   <label htmlFor="virtual-tour" className="form-label">Virtual Tour URL</label>
//                   <input 
//                     type="url" 
//                     className="form-control" 
//                     id="virtual-tour" 
//                     placeholder="https://myvirtualtour.com/..."
//                     value={propertyData.virtualTourUrl || ''}
//                     onChange={handleInputChange}
//                     name="virtualTourUrl"
//                   />
//                   <div className="form-text">Link to a 360° virtual tour if available</div>
//                 </div>
//               </div>

//               <div className="d-flex justify-content-between mt-4">
//                 <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
//                   <i className="bi bi-arrow-left"></i> Back to Features
//                 </button>
//                 <button type="button" className="btn btn-primary" onClick={nextStep}>
//                   Next: Review & Publish <i className="bi bi-arrow-right"></i>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 5: Review & Agent Info */}
//           {currentStep === 5 && (
//             <div className="form-step active">
//               <div className="form-section">
//                 <h4><i className="bi bi-person-circle me-2"></i>Agent Information</h4>

//                 <div className="row">
//                   <div className="col-md-12 mb-4">
//                     <div className="form-check form-switch">
//                       <input 
//                         className="form-check-input" 
//                         type="checkbox"
//                         id="show-agent"
//                         checked={propertyData.showAgent}
//                         onChange={handleInputChange}
//                         name="showAgent"
//                       />
//                       <label className="form-check-label" htmlFor="show-agent">
//                         <strong>Show agent information on listing</strong>
//                       </label>
//                       <div className="form-text">
//                         If enabled, agent contact information will be visible to potential buyers
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {propertyData.showAgent && (
//                   <div className="card bg-light">
//                     <div className="card-body">
//                       <h6 className="card-title">Agent Details</h6>
//                       <div className="row">
//                         <div className="col-md-6 mb-3">
//                           <label htmlFor="agent-name" className="form-label">Agent Name</label>
//                           <input 
//                             type="text" 
//                             className="form-control" 
//                             id="agent-name" 
//                             placeholder="e.g., Sarah Johnson"
//                             value={propertyData.agent?.name || ''}
//                             onChange={(e) => setPropertyData(prev => ({
//                               ...prev,
//                               agent: { ...(prev.agent || { name: '', title: '', phone: '', email: '' }), name: e.target.value }
//                             }))}
//                           />
//                         </div>
//                         <div className="col-md-6 mb-3">
//                           <label htmlFor="agent-title" className="form-label">Agent Title</label>
//                           <input 
//                             type="text" 
//                             className="form-control" 
//                             id="agent-title" 
//                             placeholder="e.g., Licensed Real Estate Agent"
//                             value={propertyData.agent?.title || ''}
//                             onChange={(e) => setPropertyData(prev => ({
//                               ...prev,
//                               agent: { ...(prev.agent || { name: '', title: '', phone: '', email: '' }), title: e.target.value }
//                             }))}
//                           />
//                         </div>
//                       </div>

//                       <div className="row">
//                         <div className="col-md-6 mb-3">
//                           <label htmlFor="agent-phone" className="form-label">Phone Number</label>
//                           <input 
//                             type="tel" 
//                             className="form-control" 
//                             id="agent-phone" 
//                             placeholder="+1 (555) 123-4567"
//                             value={propertyData.agent?.phone || ''}
//                             onChange={(e) => setPropertyData(prev => ({
//                               ...prev,
//                               agent: { ...(prev.agent || { name: '', title: '', phone: '', email: '' }), phone: e.target.value }
//                             }))}
//                           />
//                         </div>
//                         <div className="col-md-6 mb-3">
//                           <label htmlFor="agent-email" className="form-label">Email Address</label>
//                           <input 
//                             type="email" 
//                             className="form-control" 
//                             id="agent-email" 
//                             placeholder="agent@example.com"
//                             value={propertyData.agent?.email || ''}
//                             onChange={(e) => setPropertyData(prev => ({
//                               ...prev,
//                               agent: { ...(prev.agent || { name: '', title: '', phone: '', email: '' }), email: e.target.value }
//                             }))}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="form-section">
//                 <h4><i className="bi bi-eye me-2"></i>Review Your Listing</h4>

//                 <div className="alert alert-success">
//                   <div className="d-flex align-items-center">
//                     <i className="bi bi-check-circle-fill me-3" style={{fontSize: '2rem'}}></i>
//                     <div>
//                       <h5 className="alert-heading mb-1">Ready to Publish!</h5>
//                       <p className="mb-0">Review all the information below before publishing your property listing.</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="card mb-3">
//                       <div className="card-body">
//                         <h6 className="card-title"><i className="bi bi-file-text me-2"></i>Property Summary</h6>
//                         <div className="property-summary">
//                           <div className="mb-3">
//                             <p className="mb-1"><strong>Title:</strong> {propertyData.title || 'Not set'}</p>
//                             <p className="mb-1"><strong>Type:</strong> {propertyData.propertyType ? propertyData.propertyType.charAt(0).toUpperCase() + propertyData.propertyType.slice(1) : 'Not set'}</p>
//                             <p className="mb-1"><strong>Status:</strong> {propertyData.status}</p>
//                             <p className="mb-1"><strong>Price:</strong> ${propertyData.price.toLocaleString()}{propertyData.status === 'For Rent' ? '/month' : ''}</p>
//                           </div>
//                           <div className="mb-3">
//                             <p className="mb-1"><strong>Location:</strong> {propertyData.address || 'Not set'}, {propertyData.city || 'Not set'}</p>
//                             <p className="mb-1"><strong>Show Address:</strong> {propertyData.showAddress ? 'Yes' : 'No'}</p>
//                           </div>
//                           <div className="mb-3">
//                             <p className="mb-1"><strong>Building Size:</strong> {propertyData.buildingSize ? `${propertyData.buildingSize} ${propertyData.sizeUnit}` : 'Not set'}</p>
//                             {propertyData.landSize && (
//                               <p className="mb-1"><strong>Land Size:</strong> {propertyData.landSize} {propertyData.sizeUnit}</p>
//                             )}
//                             <p className="mb-1"><strong>Bedrooms:</strong> {propertyData.bedrooms ?? 'Not set'}</p>
//                             <p className="mb-1"><strong>Bathrooms:</strong> {propertyData.bathrooms ?? 'Not set'}</p>
//                           </div>
//                           <div className="mb-3">
//                             <p className="mb-1"><strong>Images:</strong> {propertyData.images.length} uploaded</p>
//                             <p className="mb-1"><strong>Features:</strong> {interiorFeatures.size + exteriorFeatures.size} selected</p>
//                             <p className="mb-1"><strong>Labels:</strong> {Array.from(selectedFeatures).map(f => featureTags.find(t => t.id === f)?.label).filter(Boolean).join(', ') || 'None'}</p>
//                           </div>
//                           {propertyData.showAgent && propertyData.agent?.name && (
//                             <div className="mb-3">
//                               <p className="mb-1"><strong>Agent:</strong> {propertyData.agent.name}</p>
//                               <p className="mb-1"><strong>Contact:</strong> {propertyData.agent.phone || 'Not provided'}</p>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="card">
//                       <div className="card-body">
//                         <h6 className="card-title"><i className="bi bi-eye me-2"></i>Listing Preview</h6>
//                         <div className="property-preview">
//                           <div className="preview-image mb-3">
//                             {uploadedImages.length > 0 ? (
//                               <img 
//                                 src={uploadedImages[0]} 
//                                 alt="Property" 
//                                 className="img-fluid rounded"
//                               />
//                             ) : (
//                               <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{height: '150px'}}>
//                                 <i className="bi bi-house text-muted" style={{fontSize: "3rem"}}></i>
//                               </div>
//                             )}
//                           </div>
//                           <h6 className="preview-title">{propertyData.title || 'Property Title'}</h6>
//                           <p className="preview-price text-primary mb-2">
//                             <strong>${propertyData.price.toLocaleString()}</strong>
//                             {propertyData.status === 'For Rent' ? '/month' : ''}
//                           </p>
//                           <p className="preview-location text-muted small mb-3">
//                             <i className="bi bi-geo-alt"></i> {propertyData.city || 'City'}
//                           </p>
//                           <div className="preview-features d-flex justify-content-between text-muted small">
//                             {propertyData.bedrooms !== undefined && (
//                               <span><i className="bi bi-door-closed"></i> {propertyData.bedrooms} Bed</span>
//                             )}
//                             {propertyData.bathrooms !== undefined && (
//                               <span><i className="bi bi-droplet"></i> {propertyData.bathrooms} Bath</span>
//                             )}
//                             {propertyData.buildingSize && (
//                               <span><i className="bi bi-arrows-angle-expand"></i> {propertyData.buildingSize} {propertyData.sizeUnit}</span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="form-check mt-4">
//                   <input className="form-check-input" type="checkbox" id="terms-agreement" required />
//                   <label className="form-check-label" htmlFor="terms-agreement">
//                     I agree to the <Link href="/terms" className="text-primary">Terms of Service</Link> and confirm that all information provided is accurate.
//                     I understand that providing false information may result in listing removal.
//                   </label>
//                 </div>
//               </div>

//               <div className="d-flex justify-content-between mt-4">
//                 <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
//                   <i className="bi bi-arrow-left"></i> Back to Media
//                 </button>
//                 <div>
//                   <button type="button" className="btn btn-outline-primary me-2" onClick={saveAsDraft}>
//                     <i className="bi bi-save"></i> Save as Draft
//                   </button>
//                   <button 
//                     type="button" 
//                     className="btn btn-success" 
//                     onClick={submitProperty}
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                         Publishing...
//                       </>
//                     ) : (
//                       <>
//                         <i className="bi bi-check-lg me-2"></i> Publish Property
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </section>
//     </main>
//   );
// }









// // app/admin/properties/new/page.tsx
// "use client";

// // import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
// // import Link from 'next/link';
// // import { useRouter } from "next/navigation";
// // import "./styles.css"
// // import { ImageUploadService } from '@/services/ImageUploadService';
// // import { checkIfAdmin } from '@/utils/checkIfAdmin';
// // import { PropertyService } from '@/services/PropertyService_';

// // import { firebaseAuth } from '@/config/firebase';
// // import { onAuthStateChanged } from 'firebase/auth';


// import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
// import Link from 'next/link';
// import { useRouter } from "next/navigation";
// import "./styles.css"
// import { PropertiesRepository } from '@/lib/repositories/PropertiesRepository'; // Changed
// import { ImageUploadService } from '@/services/ImageUploadService';
// import { createClient } from '@/lib/supabase/supabase'; // Changed
// import { checkIfAdmin } from '@/utils/checkIfAdmin'; // You'll need to update this for Supabase

// interface PropertyData {
//   id: string;
//   title: string;
//   description: string;
//   propertyType: string;
//   price: number;
//   salePrice?: number;  // Optional separate sale price
//   rentPrice?: number;  // Optional separate rent price
//   status: ('For Sale' | 'For Rent' | 'Sold')[];  // Now an array of statuses
//   address: string;
//   city: string;
//   showAddress: boolean;
//   images: string[];
//   bedrooms?: number;
//   bathrooms?: number;
//   buildingSize?: number;
//   landSize?: number;
//   sizeUnit: string;
//   yearBuilt?: number;
//   garage?: number;
//   zoning?: string;
//   utilities: {
//     water: boolean;
//     electricity: boolean;
//     sewage: boolean;
//     roadAccess: boolean;
//   };
//   hot: boolean;
//   newListing: boolean;
//   featured: boolean;
//   exclusive: boolean;
//   interiorFeatures: string[];
//   exteriorFeatures: string[];
//   customFeatures: string[];
//   videoUrl?: string;
//   virtualTourUrl?: string;
//   showAgent: boolean;
//   agent?: {
//     name: string;
//     title: string;
//     phone: string;
//     email: string;
//     photo?: string;
//   };
// }

// interface ValidationError {
//   field: string;
//   message: string;
// }

// export default function NewPropertyPage() {
//   const router = useRouter();
//   const [currentStep, setCurrentStep] = useState<number>(1);
//   const [selectedPropertyType, setSelectedPropertyType] = useState<string>('');
//   const [uploadedImages, setUploadedImages] = useState<string[]>([]);
//   const [selectedImages, setSelectedImages] = useState<File[]>([]);
//   const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
//   const [interiorFeatures, setInteriorFeatures] = useState<Set<string>>(new Set());
//   const [exteriorFeatures, setExteriorFeatures] = useState<Set<string>>(new Set());
//   const [isDragging, setIsDragging] = useState(false);
//   const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [checking, setChecking] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const dropzoneRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   // Add supabase client
//   const supabase = createClient();

//   const [propertyData, setPropertyData] = useState<PropertyData>({
//     id: '',
//     title: '',
//     description: '',
//     propertyType: '',
//     price: 0,
//     status: [],  // Empty array to start
//     address: '',
//     city: '',
//     showAddress: true,
//     images: [],
//     sizeUnit: 'm2',
//     utilities: {
//       water: false,
//       electricity: false,
//       sewage: false,
//       roadAccess: false
//     },
//     hot: false,
//     newListing: false,
//     featured: false,
//     exclusive: false,
//     interiorFeatures: [],
//     exteriorFeatures: [],
//     customFeatures: [],
//     showAgent: true,
//   });

//   const totalSteps = 5;
//   const progressPercentage = (currentStep / totalSteps) * 100;

//   // Property types
//   const propertyTypes = [
//     { type: 'house', icon: 'bi-house-door', label: 'House' },
//     { type: 'apartment', icon: 'bi-building', label: 'Apartment' },
//     { type: 'villa', icon: 'bi-house-heart', label: 'Villa' },
//     { type: 'commercial', icon: 'bi-shop', label: 'Commercial' },
//     { type: 'land', icon: 'bi-tree', label: 'Land' },
//   ];

//   // Property status options
//   const statusOptions = ['For Sale', 'For Rent', 'Sold'] as const;

//   // Feature tags
//   const featureTags = [
//     { id: 'hot', icon: 'bi-fire', label: 'Hot Property', description: 'Highlight this property as in high demand' },
//     { id: 'newListing', icon: 'bi-star', label: 'New Listing', description: 'Recently added to our listings' },
//     { id: 'featured', icon: 'bi-gem', label: 'Featured', description: 'Prominently featured on homepage' },
//     { id: 'exclusive', icon: 'bi-shield-lock', label: 'Exclusive', description: 'Only available through our agency' },
//   ];

//   // Interior features (grouped by category)
//   const interiorFeaturesList = [
//     { category: 'Floors & Walls', features: ['Hardwood Floors', 'Tile Flooring', 'Carpeted', 'Marble Flooring', 'Wall Paneling'] },
//     { category: 'Kitchen', features: ['Updated Kitchen', 'Granite Countertops', 'Stainless Steel Appliances', 'Kitchen Island', 'Walk-in Pantry'] },
//     { category: 'Living Areas', features: ['Fireplace', 'High Ceilings', 'Home Office', 'Finished Basement', 'Sun Room'] },
//     { category: 'Comfort & Systems', features: ['Central Air Conditioning', 'Smart Home System', 'In-unit Laundry', 'Security System', 'Sound System'] },
//   ];

//   // Exterior features (grouped by category)
//   const exteriorFeaturesList = [
//     { category: 'Outdoor Living', features: ['Swimming Pool', 'Garden', 'Patio/Deck', 'BBQ Area', 'Outdoor Kitchen'] },
//     { category: 'Recreation', features: ['Tennis Court', 'Playground', 'Basketball Court', 'Putting Green', 'Jacuzzi'] },
//     { category: 'Parking & Access', features: ['Garage', 'Parking Lot', 'Gated Community', 'Elevator', 'Ramp Access'] },
//     { category: 'Landscaping', features: ['Sprinkler System', 'Mature Trees', 'Fenced Yard', 'Garden Shed', 'Greenhouse'] },
//   ];

//   // Step validation rules
//   const stepValidationRules = {
//     1: (data: PropertyData) => {
//       const errors: ValidationError[] = [];
//       if (!data.title.trim()) errors.push({ field: 'title', message: 'Property title is required' });
//       if (!data.propertyType) errors.push({ field: 'propertyType', message: 'Please select a property type' });
//       if (data.status.length === 0) errors.push({ field: 'status', message: 'Please select at least one property status' });
      
//       // Validate prices based on selected status
//       if (data.status.includes('For Sale') && !data.salePrice && data.salePrice !== 0) {
//         errors.push({ field: 'salePrice', message: 'Sale price is required when property is for sale' });
//       }
//       if (data.status.includes('For Rent') && !data.rentPrice && data.rentPrice !== 0) {
//         errors.push({ field: 'rentPrice', message: 'Rent price is required when property is for rent' });
//       }
      
//       // Validate at least one price is set
//       if (!data.salePrice && !data.rentPrice) {
//         errors.push({ field: 'price', message: 'At least one price (sale or rent) must be set' });
//       }
      
//       if (!data.description.trim() || data.description.length < 100) 
//         errors.push({ field: 'description', message: 'Description must be at least 100 characters' });
//       if (!data.address.trim()) errors.push({ field: 'address', message: 'Address is required' });
//       if (!data.city.trim()) errors.push({ field: 'city', message: 'City is required' });
//       return errors;
//     },
//     2: (data: PropertyData) => {
//       const errors: ValidationError[] = [];
//       if (data.propertyType !== 'land' && data.propertyType !== 'commercial') {
//         if (!data.bedrooms && data.bedrooms !== 0) 
//           errors.push({ field: 'bedrooms', message: 'Number of bedrooms is required' });
//         if (!data.buildingSize) 
//           errors.push({ field: 'buildingSize', message: 'Building size is required' });
//       }
//       if (data.propertyType === 'land' && !data.landSize) {
//         errors.push({ field: 'landSize', message: 'Land size is required' });
//       }
//       return errors;
//     },
//     4: () => {
//       const errors: ValidationError[] = [];
//       if (uploadedImages.length === 0) 
//         errors.push({ field: 'images', message: 'At least one property image is required' });
//       return errors;
//     }
//   };

//   // Handle property type selection
//   const handlePropertyTypeSelect = (type: string) => {
//     setSelectedPropertyType(type);
//     setPropertyData(prev => ({ ...prev, propertyType: type }));
//     clearValidationError('propertyType');
//   };

//   // Handle status toggle
//   const toggleStatus = (status: 'For Sale' | 'For Rent' | 'Sold') => {
//     setPropertyData(prev => {
//       const currentStatus = [...prev.status];
//       const index = currentStatus.indexOf(status);
      
//       if (index > -1) {
//         // Remove status if already selected
//         currentStatus.splice(index, 1);
        
//         // Also remove associated price
//         if (status === 'For Sale') {
//           return { ...prev, status: currentStatus, salePrice: undefined };
//         } else if (status === 'For Rent') {
//           return { ...prev, status: currentStatus, rentPrice: undefined };
//         }
//         return { ...prev, status: currentStatus };
//       } else {
//         // Add status if not selected
//         // If selecting "Sold", remove "For Sale" and "For Rent"
//         if (status === 'Sold') {
//           return { 
//             ...prev, 
//             status: ['Sold'],
//             salePrice: undefined,
//             rentPrice: undefined
//           };
//         }
        
//         // If already has "Sold", remove it when adding other statuses
//         if (currentStatus.includes('Sold')) {
//           return { 
//             ...prev, 
//             status: [status],
//             salePrice: status === 'For Sale' ? prev.salePrice : undefined,
//             rentPrice: status === 'For Rent' ? prev.rentPrice : undefined
//           };
//         }
        
//         // Add new status
//         return { 
//           ...prev, 
//           status: [...currentStatus, status]
//         };
//       }
//     });
//     clearValidationError('status');
//   };

//   // Toggle feature tag
//   const toggleFeatureTag = (feature: string) => {
//     setSelectedFeatures(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(feature)) {
//         newSet.delete(feature);
//       } else {
//         newSet.add(feature);
//       }
//       return newSet;
//     });
//   };

//   // Toggle interior feature
//   const toggleInteriorFeature = (feature: string) => {
//     setInteriorFeatures(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(feature)) {
//         newSet.delete(feature);
//       } else {
//         newSet.add(feature);
//       }
//       return newSet;
//     });
//   };

//   // Toggle exterior feature
//   const toggleExteriorFeature = (feature: string) => {
//     setExteriorFeatures(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(feature)) {
//         newSet.delete(feature);
//       } else {
//         newSet.add(feature);
//       }
//       return newSet;
//     });
//   };

//   // Handle input changes with validation
//   const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
    
//     clearValidationError(name);
    
//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
//       if (name.startsWith('utilities.')) {
//         const utilityKey = name.split('.')[1] as keyof PropertyData['utilities'];
//         setPropertyData(prev => ({
//           ...prev,
//           utilities: {
//             ...prev.utilities,
//             [utilityKey]: checked
//           }
//         }));
//       } else {
//         setPropertyData(prev => ({ ...prev, [name]: checked }));
//       }
//     } else if (type === 'number') {
//       const numValue = value === '' ? undefined : parseFloat(value);
//       setPropertyData(prev => ({ ...prev, [name]: numValue }));
      
//       // Validate prices
//       if (name === 'salePrice' && parseFloat(value) <= 0) {
//         setValidationErrors(prev => [...prev, { field: 'salePrice', message: 'Sale price must be greater than 0' }]);
//       }
//       if (name === 'rentPrice' && parseFloat(value) <= 0) {
//         setValidationErrors(prev => [...prev, { field: 'rentPrice', message: 'Rent price must be greater than 0' }]);
//       }
//     } else {
//       setPropertyData(prev => ({ ...prev, [name]: value }));
      
//       // Validate required fields
//       if (name === 'title' && !value.trim()) {
//         setValidationErrors(prev => [...prev, { field: 'title', message: 'Property title is required' }]);
//       }
//       if (name === 'description' && value.length < 100) {
//         setValidationErrors(prev => [...prev, { field: 'description', message: 'Description must be at least 100 characters' }]);
//       }
//     }
//   };

//   // Clear validation error
//   const clearValidationError = (fieldName: string) => {
//     setValidationErrors(prev => prev.filter(error => error.field !== fieldName));
//   };

//   // File validation
//   const validateFile = (file: File): boolean => {
//     const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
//     const maxSize = 5 * 1024 * 1024; // 5MB
    
//     if (!validTypes.includes(file.type)) {
//       alert(`File type not supported: ${file.type}. Please upload JPG, PNG, or WEBP files.`);
//       return false;
//     }
    
//     if (file.size > maxSize) {
//       alert(`File ${file.name} is too large. Maximum size is 5MB.`);
//       return false;
//     }
    
//     return true;
//   };

//   // Handle file upload
//   const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;

//     const validFiles = Array.from(files).filter(validateFile);
//     if (validFiles.length === 0) return;
    
//     const fileArray = Array.from(validFiles);
    
//     // Save original files for upload
//     setSelectedImages((prev) => [...prev, ...fileArray]);

//     // Generate preview URLs
//     const previews = fileArray.map((file) => URL.createObjectURL(file));

//     setUploadedImages((prev) => [...prev, ...previews]);
//     clearValidationError('images');

//     // Update property data
//     setPropertyData((prev) => ({
//       ...prev,
//       images: [...prev.images, ...previews],
//     }));
//   };

//   // Drag event handlers
//   const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(true);
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDragging(false);
    
//     const files = e.dataTransfer.files;
//     if (!files || files.length === 0) return;

//     const validFiles = Array.from(files).filter(validateFile);
//     if (validFiles.length === 0) return;
    
//     // Create a fake event object to reuse the handleFileUpload function
//     const dataTransfer = new DataTransfer();
//     validFiles.forEach(file => dataTransfer.items.add(file));
    
//     // Trigger file input
//     if (fileInputRef.current) {
//       fileInputRef.current.files = dataTransfer.files;
//       handleFileUpload({ target: { files: dataTransfer.files } } as ChangeEvent<HTMLInputElement>);
//     }
//   };

//   // Remove image
//   const removeImage = (index: number) => {
//     // Revoke the object URL to prevent memory leaks
//     URL.revokeObjectURL(uploadedImages[index]);
    
//     setUploadedImages(prev => prev.filter((_, i) => i !== index));
//     setSelectedImages(prev => prev.filter((_, i) => i !== index));
//     setPropertyData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//   };

//   // Handle custom features
//   const handleCustomFeatures = (e: ChangeEvent<HTMLInputElement>) => {
//     const features = e.target.value
//       .split(',')
//       .map(f => f.trim())
//       .filter(f => f.length > 0);
    
//     setPropertyData(prev => ({ ...prev, customFeatures: features }));
//   };

//   // Navigation functions with validation
//   const nextStep = () => {
//     const validator = stepValidationRules[currentStep as keyof typeof stepValidationRules];
//     if (validator) {
//       const errors = validator(propertyData);
//       if (errors.length > 0) {
//         setValidationErrors(errors);
        
//         // Scroll to first error
//         const firstErrorField = document.querySelector(`[name="${errors[0].field}"]`);
//         if (firstErrorField) {
//           firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//         return;
//       }
//     }
    
//     setValidationErrors([]);
//     setCurrentStep(prev => Math.min(prev + 1, totalSteps));
//   };

//   const prevStep = () => {
//     setValidationErrors([]);
//     setCurrentStep(prev => Math.max(prev - 1, 1));
//   };

//   // Generate ID
//   const generateId = (): string => {
//     return 'prop_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
//   };

//   // Submit property
//   const imageService = new ImageUploadService();
//   // const propertyService = new PropertyService();

//   // const submitProperty = async (e: FormEvent) => {
//   //   e.preventDefault();
    
//   //   const termsCheckbox = document.getElementById("terms-agreement") as HTMLInputElement;
//   //   if (!termsCheckbox?.checked) {
//   //     alert("Please agree to the Terms of Service before publishing.");
//   //     termsCheckbox.focus();
//   //     return;
//   //   }

//   //   // Validate all steps
//   //   const allErrors: ValidationError[] = [];
//   //   Object.values(stepValidationRules).forEach(validator => {
//   //     if (validator) {
//   //       allErrors.push(...validator(propertyData));
//   //     }
//   //   });

//   //   if (allErrors.length > 0) {
//   //     setValidationErrors(allErrors);
//   //     alert('Please fix all validation errors before submitting.');
//   //     return;
//   //   }

//   //   if (uploadedImages.length === 0) {
//   //     alert('Please upload at least one property image.');
//   //     return;
//   //   }

//   //   setIsSubmitting(true);

//   //   try {
//   //     /* 1️⃣ Upload images to ImgBB */
//   //     const uploadedImageUrls: string[] = [];
      
//   //     for (const file of selectedImages) {
//   //       try {
//   //         const url = await imageService.upload(file);
//   //         uploadedImageUrls.push(url);
//   //       } catch (error) {
//   //         console.error('Error uploading image:', error);
//   //         throw new Error(`Failed to upload image: ${file.name}`);
//   //       }
//   //     }

//   //     /* 2️⃣ Build final clean domain object */
//   //     const finalData = {
//   //       ...propertyData,
//   //       id: generateId(),
//   //       images: uploadedImageUrls,
//   //       hot: selectedFeatures.has("hot"),
//   //       newListing: selectedFeatures.has("newListing"),
//   //       featured: selectedFeatures.has("featured"),
//   //       exclusive: selectedFeatures.has("exclusive"),
//   //       interiorFeatures: Array.from(interiorFeatures),
//   //       exteriorFeatures: Array.from(exteriorFeatures),
//   //       createdAt: new Date().toISOString(),
//   //       updatedAt: new Date().toISOString(),
//   //       published: true
//   //     };

//   //     if (!propertyData.showAgent) {
//   //       delete (finalData as any).agent;
//   //     }

//   //     /* 3️⃣ Save to Firebase */
//   //     await propertyService.create(finalData);

//   //     /* 4️⃣ Clear draft and redirect */
//   //     localStorage.removeItem('propertyDraft');
//   //     alert("Property published successfully!");
//   //     // router.push("/admin/properties");
//   //     router.push("/admin/properties/new");
      
//   //   } catch (error: any) {
//   //     console.error("Error submitting property:", error);
//   //     alert(`Failed to publish property: ${error.message || 'Please try again.'}`);
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // };

// const submitProperty = async (e: FormEvent) => {
//   e.preventDefault();
  
//   const termsCheckbox = document.getElementById("terms-agreement") as HTMLInputElement;
//   if (!termsCheckbox?.checked) {
//     alert("Please agree to the Terms of Service before publishing.");
//     termsCheckbox.focus();
//     return;
//   }

//   // Validate all steps
//   const allErrors: ValidationError[] = [];
//   Object.values(stepValidationRules).forEach(validator => {
//     if (validator) {
//       allErrors.push(...validator(propertyData));
//     }
//   });

//   if (allErrors.length > 0) {
//     setValidationErrors(allErrors);
//     alert('Please fix all validation errors before submitting.');
//     return;
//   }

//   if (uploadedImages.length === 0) {
//     alert('Please upload at least one property image.');
//     return;
//   }

//   setIsSubmitting(true);

//   try {
//     console.log('Starting property submission...');
    
//     /* 1️⃣ Upload images to ImgBB */
//     const uploadedImageUrls: string[] = [];
    
//     if (selectedImages.length === 0) {
//       console.warn('No images selected for upload');
//     }
    
//     for (const file of selectedImages) {
//       try {
//         console.log(`Uploading image: ${file.name}`);
//         const url = await imageService.upload(file);
//         uploadedImageUrls.push(url);
//         console.log(`Image uploaded successfully: ${url}`);
//       } catch (error) {
//         console.error('Error uploading image:', error);
//         throw new Error(`Failed to upload image: ${file.name}`);
//       }
//     }

//     /* 2️⃣ Build final clean domain object with snake_case for Supabase */
//     const finalData = {
//       // Map camelCase to snake_case
//       id: generateId(),
//       title: propertyData.title,
//       description: propertyData.description,
//       property_type: propertyData.propertyType, // snake_case
//       sale_price: propertyData.salePrice, // snake_case
//       rent_price: propertyData.rentPrice, // snake_case
//       status: propertyData.status,
//       address: propertyData.address,
//       city: propertyData.city,
//       show_address: propertyData.showAddress, // snake_case
//       images: uploadedImageUrls,
//       bedrooms: propertyData.bedrooms,
//       bathrooms: propertyData.bathrooms,
//       building_size: propertyData.buildingSize, // snake_case
//       land_size: propertyData.landSize, // snake_case
//       size_unit: propertyData.sizeUnit, // snake_case
//       year_built: propertyData.yearBuilt, // snake_case
//       garage: propertyData.garage,
//       zoning: propertyData.zoning,
//       utilities: propertyData.utilities,
//       hot: selectedFeatures.has("hot"),
//       new_listing: selectedFeatures.has("newListing"), // snake_case
//       featured: selectedFeatures.has("featured"),
//       exclusive: selectedFeatures.has("exclusive"),
//       interior_features: Array.from(interiorFeatures), // snake_case
//       exterior_features: Array.from(exteriorFeatures), // snake_case
//       custom_features: propertyData.customFeatures, // snake_case
//       video_url: propertyData.videoUrl, // snake_case
//       virtual_tour_url: propertyData.virtualTourUrl, // snake_case
//       show_agent: propertyData.showAgent, // snake_case
//       agent: propertyData.agent,
//       published: true,
//       draft: false,
//       created_at: new Date().toISOString(), // snake_case
//       updated_at: new Date().toISOString()  // snake_case
//     };

//     if (!propertyData.showAgent) {
//       delete (finalData as any).agent;
//     }

//     console.log('Final data to save:', finalData);

//     /* 3️⃣ Save to Supabase using PropertiesRepository */
//     console.log('Saving to Supabase...');
//     const propertiesRepo = new PropertiesRepository();
    
//     // Test if repository works
//     console.log('PropertiesRepository created');
    
//     try {
//       const result = await propertiesRepo.create(finalData as any);
//       console.log('Property saved successfully:', result);
//     } catch (repoError: any) {
//       console.error('Repository error details:', {
//         message: repoError.message,
//         details: repoError.details,
//         hint: repoError.hint,
//         code: repoError.code
//       });
//       throw repoError;
//     }

//     /* 4️⃣ Clear draft and redirect */
//     localStorage.removeItem('propertyDraft');
//     alert("Property published successfully!");
//     router.push("/admin/properties");
    
//   } catch (error: any) {
//     console.error("Error submitting property:", error);
    
//     // More detailed error message
//     let errorMessage = 'Failed to publish property. ';
    
//     if (error.message) {
//       errorMessage += error.message;
//     }
    
//     if (error.details) {
//       errorMessage += ` Details: ${error.details}`;
//     }
    
//     if (error.hint) {
//       errorMessage += ` Hint: ${error.hint}`;
//     }
    
//     alert(errorMessage);
//   } finally {
//     setIsSubmitting(false);
//   }
// };


//   // Save as draft
//   // const saveAsDraft = () => {
//   //   const draftData = {
//   //     ...propertyData,
//   //     hot: selectedFeatures.has('hot'),
//   //     newListing: selectedFeatures.has('newListing'),
//   //     featured: selectedFeatures.has('featured'),
//   //     exclusive: selectedFeatures.has('exclusive'),
//   //     interiorFeatures: Array.from(interiorFeatures),
//   //     exteriorFeatures: Array.from(exteriorFeatures),
//   //     draft: true,
//   //     lastSaved: new Date().toISOString()
//   //   };

//   //   localStorage.setItem('propertyDraft', JSON.stringify(draftData));
//   //   alert('Draft saved successfully! You can continue editing later.');
//   // };
// const saveAsDraft = async () => {
//   const draftData = {
//     ...propertyData,
//     hot: selectedFeatures.has('hot'),
//     newListing: selectedFeatures.has('newListing'),
//     featured: selectedFeatures.has('featured'),
//     exclusive: selectedFeatures.has('exclusive'),
//     interiorFeatures: Array.from(interiorFeatures),
//     exteriorFeatures: Array.from(exteriorFeatures),
//     draft: true,
//     published: false,
//     lastSaved: new Date().toISOString()
//   };

//   // Save locally
//   localStorage.setItem('propertyDraft', JSON.stringify(draftData));
  
//   // Optionally save to Supabase as draft
//   try {
//     const propertiesRepo = new PropertiesRepository();
//     if (propertyData.id) {
//       // Update existing draft
//       await propertiesRepo.update(propertyData.id, draftData);
//     } else {
//       // Create new draft
//       const created = await propertiesRepo.create({
//         ...draftData,
//         id: generateId()
//       });
//       setPropertyData(prev => ({ ...prev, id: created.id }));
//     }
//     alert('Draft saved successfully! You can continue editing later.');
//   } catch (error) {
//     console.error('Error saving draft to Supabase:', error);
//     alert('Draft saved locally only. Please check your connection.');
//   }
// };


//   // Load draft if exists
//   useEffect(() => {
//     const savedDraft = localStorage.getItem('propertyDraft');
//     if (savedDraft) {
//       try {
//         const draft = JSON.parse(savedDraft);
//         setPropertyData(draft);
//         if (draft.propertyType) setSelectedPropertyType(draft.propertyType);
//         if (draft.images) setUploadedImages(draft.images);
//         if (draft.hot) setSelectedFeatures(prev => new Set([...prev, 'hot']));
//         if (draft.newListing) setSelectedFeatures(prev => new Set([...prev, 'newListing']));
//         if (draft.featured) setSelectedFeatures(prev => new Set([...prev, 'featured']));
//         if (draft.exclusive) setSelectedFeatures(prev => new Set([...prev, 'exclusive']));
//         if (draft.interiorFeatures) setInteriorFeatures(new Set(draft.interiorFeatures));
//         if (draft.exteriorFeatures) setExteriorFeatures(new Set(draft.exteriorFeatures));
        
//         console.log('Loaded draft data');
//       } catch (error) {
//         console.error('Error loading draft:', error);
//       }
//     }
//   }, []);

//   // Update propertyData when features change
//   useEffect(() => {
//     setPropertyData(prev => ({
//       ...prev,
//       hot: selectedFeatures.has('hot'),
//       newListing: selectedFeatures.has('newListing'),
//       featured: selectedFeatures.has('featured'),
//       exclusive: selectedFeatures.has('exclusive')
//     }));
//   }, [selectedFeatures]);

//   // Clean up object URLs
//   useEffect(() => {
//     return () => {
//       uploadedImages.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [uploadedImages]);

//   // Authentication check
//   useEffect(() => {
//     const checkAuth = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
      
//       if (!session) {
//         router.replace("/login");
//         return;
//       }

//       const admin = await checkIfAdmin(session.user.id);

//       if (!admin) {
//         // router.replace("/");
//         console.log(admin, session.user.id)
//         return;
//       }

//       setIsAdmin(true);
//       setChecking(false);
//     };

//     checkAuth();
    
//     // Listen for auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (event === 'SIGNED_OUT' || !session) {
//           router.replace("/login");
//           return;
//         }
        
//         const admin = await checkIfAdmin(session.user.id);
//         if (!admin) {
//           // router.replace("/");
//           console.log(admin, session.user.id)
//           return;
//         }
        
//         setIsAdmin(true);
//         setChecking(false);
//       }
//     );

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [router, supabase]);


//   // Show loading while checking authentication
//   if (checking) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-3">Verifying permissions...</p>
//         </div>
//       </div>
//     );
//   }

//   // Show access denied if not admin
//   if (!isAdmin) {
//     return (
//       <div className="container py-5">
//         <div className="alert alert-danger">
//           <h4 className="alert-heading">Access Denied</h4>
//           <p>You don&#39;t have permission to access this page.</p>
//           <Link href="/" className="btn btn-primary">Return to Home</Link>
//         </div>
//       </div>
//     );
//   }

//   // Render property specifications based on type
//   const renderPropertySpecifications = () => {
//     switch (selectedPropertyType) {
//       case 'land':
//         return (
//           <>
//             <div className="row">
//               <div className="col-md-6 mb-4">
//                 <label htmlFor="land-size" className="form-label required-label">
//                   Total Land Size <span className="text-danger">*</span>
//                 </label>
//                 <div className="input-group">
//                   <input 
//                     type="number" 
//                     className={`form-control ${validationErrors.some(e => e.field === 'landSize') ? 'is-invalid' : ''}`}
//                     id="land-size" 
//                     min="0" 
//                     step="0.01"
//                     placeholder="0" 
//                     value={propertyData.landSize || ''}
//                     onChange={handleInputChange}
//                     name="landSize"
//                   />
//                   <select 
//                     className="form-select" 
//                     id="size-unit" 
//                     style={{maxWidth: "120px"}}
//                     value={propertyData.sizeUnit}
//                     onChange={handleInputChange}
//                     name="sizeUnit"
//                   >
//                     <option value="m2">m²</option>
//                     <option value="ft2">ft²</option>
//                     <option value="acre">Acre</option>
//                     <option value="hectare">Hectare</option>
//                   </select>
//                 </div>
//                 <div className="form-text">Total area including all outdoor spaces</div>
//               </div>
//               <div className="col-md-6 mb-4">
//                 <label htmlFor="zoning" className="form-label">Zoning Type</label>
//                 <select 
//                   className="form-select" 
//                   id="zoning"
//                   value={propertyData.zoning || ''}
//                   onChange={handleInputChange}
//                   name="zoning"
//                 >
//                   <option value="">Select Zoning</option>
//                   <option value="residential">Residential</option>
//                   <option value="commercial">Commercial</option>
//                   <option value="industrial">Industrial</option>
//                   <option value="agricultural">Agricultural</option>
//                   <option value="mixed-use">Mixed-Use</option>
//                   <option value="recreational">Recreational</option>
//                 </select>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-12">
//                 <label className="form-label mb-3">Utilities Available</label>
//                 <div className="land-utilities-grid">
//                   {[
//                     { id: 'water', label: 'Water Connection', key: 'water' },
//                     { id: 'electricity', label: 'Electricity', key: 'electricity' },
//                     { id: 'sewage', label: 'Sewage System', key: 'sewage' },
//                     { id: 'road-access', label: 'Paved Road Access', key: 'roadAccess' }
//                   ].map(utility => (
//                     <div className="form-check" key={utility.id}>
//                       <input 
//                         className="form-check-input" 
//                         type="checkbox" 
//                         id={`${utility.id}-utility`}
//                         checked={propertyData.utilities[utility.key as keyof PropertyData['utilities']]}
//                         onChange={handleInputChange}
//                         name={`utilities.${utility.key}`}
//                       />
//                       <label className="form-check-label" htmlFor={`${utility.id}-utility`}>
//                         {utility.label}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </>
//         );

//       default:
//         return (
//           <>
//             <div className="row">
//               <div className="col-md-3 mb-4">
//                 <label htmlFor="bedrooms" className="form-label required-label">
//                   Bedrooms <span className="text-danger">*</span>
//                 </label>
//                 <input 
//                   type="number" 
//                   className={`form-control ${validationErrors.some(e => e.field === 'bedrooms') ? 'is-invalid' : ''}`}
//                   id="bedrooms" 
//                   min="0" 
//                   max="20"
//                   placeholder="0" 
//                   value={propertyData.bedrooms || ''}
//                   onChange={handleInputChange}
//                   name="bedrooms"
//                 />
//                 <div className="form-text">Enter 0 for studio apartments</div>
//               </div>
//               <div className="col-md-3 mb-4">
//                 <label htmlFor="bathrooms" className="form-label">Bathrooms</label>
//                 <input 
//                   type="number" 
//                   className="form-control" 
//                   id="bathrooms" 
//                   min="0" 
//                   max="20"
//                   step="0.5" 
//                   placeholder="0" 
//                   value={propertyData.bathrooms || ''}
//                   onChange={handleInputChange}
//                   name="bathrooms"
//                 />
//                 <div className="form-text">0.5 = toilet only</div>
//               </div>
//               <div className="col-md-3 mb-4">
//                 <label htmlFor="garage" className="form-label">Garage Spaces</label>
//                 <input 
//                   type="number" 
//                   className="form-control" 
//                   id="garage" 
//                   min="0" 
//                   max="10"
//                   placeholder="0" 
//                   value={propertyData.garage || ''}
//                   onChange={handleInputChange}
//                   name="garage"
//                 />
//               </div>
//               <div className="col-md-3 mb-4">
//                 <label htmlFor="year-built" className="form-label">Year Built</label>
//                 <input 
//                   type="number" 
//                   className="form-control" 
//                   id="year-built" 
//                   min="1800" 
//                   max={new Date().getFullYear() + 1}
//                   placeholder="YYYY" 
//                   value={propertyData.yearBuilt || ''}
//                   onChange={handleInputChange}
//                   name="yearBuilt"
//                 />
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-md-6 mb-4">
//                 <label htmlFor="building-size" className="form-label required-label">
//                   Building Size <span className="text-danger">*</span>
//                 </label>
//                 <div className="input-group">
//                   <input 
//                     type="number" 
//                     className={`form-control ${validationErrors.some(e => e.field === 'buildingSize') ? 'is-invalid' : ''}`}
//                     id="building-size" 
//                     min="0" 
//                     step="0.1"
//                     placeholder="0" 
//                     value={propertyData.buildingSize || ''}
//                     onChange={handleInputChange}
//                     name="buildingSize"
//                   />
//                   <select 
//                     className="form-select" 
//                     id="size-unit" 
//                     style={{maxWidth: "100px"}}
//                     value={propertyData.sizeUnit}
//                     onChange={handleInputChange}
//                     name="sizeUnit"
//                   >
//                     <option value="m2">m²</option>
//                     <option value="ft2">ft²</option>
//                     <option value="sqm">sqm</option>
//                     <option value="sqft">sqft</option>
//                   </select>
//                 </div>
//                 <div className="form-text">Size of the building structure (excluding outdoor areas)</div>
//               </div>
              
//               <div className="col-md-6 mb-4">
//                 <label htmlFor="land-size" className="form-label">
//                   Total Land Size
//                 </label>
//                 <div className="input-group">
//                   <input 
//                     type="number" 
//                     className="form-control" 
//                     id="land-size" 
//                     min="0" 
//                     step="0.01"
//                     placeholder="0" 
//                     value={propertyData.landSize || ''}
//                     onChange={handleInputChange}
//                     name="landSize"
//                   />
//                   <select 
//                     className="form-select" 
//                     id="land-size-unit" 
//                     style={{maxWidth: "120px"}}
//                     value={propertyData.sizeUnit}
//                     onChange={handleInputChange}
//                     name="sizeUnit"
//                     disabled
//                   >
//                     <option value="m2">m²</option>
//                     <option value="ft2">ft²</option>
//                     <option value="acre">Acre</option>
//                     <option value="hectare">Hectare</option>
//                   </select>
//                 </div>
//                 <div className="form-text">Total property area including garden, pool, driveway, etc.</div>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-12">
//                 <div className="alert alert-info">
//                   <i className="bi bi-info-circle me-2"></i>
//                   <strong>Size Guide:</strong> 
//                   <ul className="mb-0 mt-2">
//                     <li><strong>Building Size:</strong> Interior living space only (house/apartment structure)</li>
//                     <li><strong>Land Size:</strong> Total property area including all outdoor spaces</li>
//                     <li>For apartments, land size typically equals building size</li>
//                     <li>For villas/houses, land size includes garden, pool, driveway, etc.</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </>
//         );
//     }
//   };

//   // Helper function to format price display
//   const formatPriceDisplay = () => {
//     const parts = [];
//     if (propertyData.salePrice) {
//       parts.push(`$${propertyData.salePrice.toLocaleString()} (Sale)`);
//     }
//     if (propertyData.rentPrice) {
//       parts.push(`$${propertyData.rentPrice.toLocaleString()}/month (Rent)`);
//     }
//     return parts.join(' • ');
//   };

//   return (
//     <main className="main">
//       {/* Page Title */}
//       <div className="page-title">
//         <div className="heading">
//           <div className="container">
//             <div className="row d-flex justify-content-center text-center">
//               <div className="col-lg-8">
//                 <h1 className="heading-title">Add New Property</h1>
//                 <p className="mb-0">
//                   List your property with us and reach thousands of potential buyers. Fill in the details below to get started.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <nav className="breadcrumbs">
//           <div className="container">
//             <ol>
//               <li><Link href="/">Home</Link></li>
//               <li><Link href="/admin">Admin</Link></li>
//               <li className="current">Add New Property</li>
//             </ol>
//           </div>
//         </nav>
//       </div>
//       {/* End Page Title */}

//       {/* Add Property Form Section */}
//       <section id="add-property" className="add-property section">
//         <div className="container" data-aos="fade-up" data-aos-delay="100">

//           {/* Progress Indicator */}
//           <div className="step-indicator">
//             {[1, 2, 3, 4, 5].map(step => (
//               <div 
//                 key={step}
//                 className={`step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
//                 data-step={step}
//               >
//                 <div className="step-number">{step}</div>
//                 <div className="step-label">
//                   {step === 1 && 'Basic Info'}
//                   {step === 2 && 'Details'}
//                   {step === 3 && 'Features'}
//                   {step === 4 && 'Media'}
//                   {step === 5 && 'Review'}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Form Progress */}
//           <div className="progress-bar mb-4">
//             <div className="progress-fill" style={{width: `${progressPercentage}%`}}></div>
//           </div>

//           {/* Validation Errors */}
//           {validationErrors.length > 0 && (
//             <div className="alert alert-danger">
//               <h5 className="alert-heading">Please fix the following errors:</h5>
//               <ul className="mb-0">
//                 {validationErrors.map((error, index) => (
//                   <li key={index}>{error.message}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* Step 1: Basic Information */}
//           {currentStep === 1 && (
//             <div className="form-step active">
//               <div className="form-section">
//                 <h4><i className="bi bi-info-circle me-2"></i>Basic Information</h4>

//                 <div className="row">
//                   <div className="col-md-12 mb-4">
//                     <label htmlFor="property-title" className="form-label required-label">
//                       Property Title <span className="text-danger">*</span>
//                     </label>
//                     <input 
//                       type="text" 
//                       className={`form-control ${validationErrors.some(e => e.field === 'title') ? 'is-invalid' : ''}`}
//                       id="property-title" 
//                       placeholder="e.g., Modern Luxury Villa with Pool" 
//                       value={propertyData.title}
//                       onChange={handleInputChange}
//                       name="title"
//                       required
//                     />
//                     <div className="form-text">Make it descriptive and appealing to potential buyers</div>
//                     <div className="form-text text-muted">
//                       Character count: {propertyData.title.length} (Minimum 10 characters)
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6 mb-4">
//                     <label className="form-label required-label">
//                       Property Type <span className="text-danger">*</span>
//                     </label>
//                     <div className="row g-3" id="property-type-selection">
//                       {propertyTypes.map(({type, icon, label}) => (
//                         <div className="col-6 col-md-4 col-lg-3" key={type}>
//                           <button
//                             type="button"
//                             className={`property-type-btn ${selectedPropertyType === type ? 'active' : ''} ${validationErrors.some(e => e.field === 'propertyType') ? 'border-danger' : ''}`}
//                             data-type={type}
//                             onClick={() => handlePropertyTypeSelect(type)}
//                           >
//                             <i className={`bi ${icon}`}></i>
//                             <div>{label}</div>
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                     {validationErrors.some(e => e.field === 'propertyType') && (
//                       <div className="text-danger small mt-1">Please select a property type</div>
//                     )}
//                   </div>

//                   <div className="col-md-6 mb-4">
//                     <label className="form-label required-label">
//                       Property Status <span className="text-danger">*</span>
//                     </label>
//                     <div className="property-status-buttons">
//                       <div className="btn-group w-100" role="group">
//                         {statusOptions.map(status => (
//                           <div key={status}>
//                             <input 
//                               type="checkbox" 
//                               className="btn-check" 
//                               name={`status-${status}`}
//                               id={`status-${status.toLowerCase().replace(' ', '-')}`}
//                               checked={propertyData.status.includes(status)}
//                               onChange={() => toggleStatus(status)}
//                             />
//                             <label 
//                               className={`btn btn-outline-primary ${propertyData.status.includes(status) ? 'active' : ''}`}
//                               htmlFor={`status-${status.toLowerCase().replace(' ', '-')}`}
//                             >
//                               {status}
//                               {propertyData.status.includes(status) && (
//                                 <i className="bi bi-check-lg ms-1"></i>
//                               )}
//                             </label>
//                           </div>
//                         ))}
//                       </div>
//                       {validationErrors.some(e => e.field === 'status') && (
//                         <div className="text-danger small mt-1">Please select at least one status</div>
//                       )}
//                       <div className="form-text mt-2">
//                         You can select multiple statuses (e.g., &#34;For Sale&#34; and &#34;For Rent&#34;)
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Dynamic Price Fields Based on Selected Status */}
//                 <div className="row">
//                   {propertyData.status.includes('For Sale') && (
//                     <div className="col-md-6 mb-4">
//                       <label htmlFor="sale-price" className="form-label required-label">
//                         Sale Price <span className="text-danger">*</span>
//                       </label>
//                       <div className="input-group">
//                         <span className="input-group-text">$</span>
//                         <input 
//                           type="number" 
//                           className={`form-control ${validationErrors.some(e => e.field === 'salePrice') ? 'is-invalid' : ''}`}
//                           id="sale-price" 
//                           placeholder="0.00" 
//                           min="0" 
//                           step="0.01" 
//                           value={propertyData.salePrice || ''}
//                           onChange={handleInputChange}
//                           name="salePrice"
//                         />
//                         <span className="input-group-text">total</span>
//                       </div>
//                       {propertyData.salePrice && propertyData.salePrice > 0 && (
//                         <div className="form-text">
//                           Formatted: ${propertyData.salePrice.toLocaleString()}
//                         </div>
//                       )}
//                     </div>
//                   )}
                  
//                   {propertyData.status.includes('For Rent') && (
//                     <div className="col-md-6 mb-4">
//                       <label htmlFor="rent-price" className="form-label required-label">
//                         Rent Price <span className="text-danger">*</span>
//                       </label>
//                       <div className="input-group">
//                         <span className="input-group-text">$</span>
//                         <input 
//                           type="number" 
//                           className={`form-control ${validationErrors.some(e => e.field === 'rentPrice') ? 'is-invalid' : ''}`}
//                           id="rent-price" 
//                           placeholder="0.00" 
//                           min="0" 
//                           step="0.01" 
//                           value={propertyData.rentPrice || ''}
//                           onChange={handleInputChange}
//                           name="rentPrice"
//                         />
//                         <span className="input-group-text">/month</span>
//                       </div>
//                       {propertyData.rentPrice && propertyData.rentPrice > 0 && (
//                         <div className="form-text">
//                           Formatted: ${propertyData.rentPrice.toLocaleString()}/month
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {propertyData.status.includes('Sold') && (
//                     <div className="col-md-12 mb-4">
//                       <div className="alert alert-warning">
//                         <i className="bi bi-exclamation-triangle me-2"></i>
//                         <strong>Property is marked as Sold.</strong> Price information is not required for sold properties.
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div className="row">
//                   <div className="col-md-12 mb-4">
//                     <label htmlFor="description" className="form-label required-label">
//                       Description <span className="text-danger">*</span>
//                     </label>
//                     <textarea 
//                       className={`form-control ${validationErrors.some(e => e.field === 'description') ? 'is-invalid' : ''}`}
//                       id="description" 
//                       rows={5}
//                       placeholder="Describe your property in detail. Include key features, neighborhood information, and unique selling points. You can mention 'For Sale or For Rent' if applicable." 
//                       value={propertyData.description}
//                       onChange={handleInputChange}
//                       name="description"
//                       required
//                     ></textarea>
//                     <div className="form-text">
//                       Character count: {propertyData.description.length} (Minimum 100 characters recommended)
//                     </div>
//                     <div className="form-text text-muted">
//                       Example: &#34;Villa For Sale or for rent at Kedungu Tabanan 30 mins from Canggu located at quiet and peaceful Area. Now is under renovation&#34;
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="form-section">
//                 <h4><i className="bi bi-geo-alt me-2"></i>Location Details</h4>

//                 <div className="row">
//                   <div className="col-md-8 mb-4">
//                     <label htmlFor="address" className="form-label required-label">
//                       Full Address <span className="text-danger">*</span>
//                     </label>
//                     <input 
//                       type="text" 
//                       className={`form-control ${validationErrors.some(e => e.field === 'address') ? 'is-invalid' : ''}`}
//                       id="address" 
//                       placeholder="e.g., 1234 Maple Street, Beverly Hills" 
//                       value={propertyData.address}
//                       onChange={handleInputChange}
//                       name="address"
//                       required 
//                     />
//                   </div>
//                   <div className="col-md-4 mb-4">
//                     <label htmlFor="city" className="form-label required-label">
//                       City <span className="text-danger">*</span>
//                     </label>
//                     <input 
//                       type="text" 
//                       className={`form-control ${validationErrors.some(e => e.field === 'city') ? 'is-invalid' : ''}`}
//                       id="city" 
//                       placeholder="e.g., Los Angeles" 
//                       value={propertyData.city}
//                       onChange={handleInputChange}
//                       name="city"
//                       required 
//                     />
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-12 mb-4">
//                     <div className="form-check form-switch">
//                       <input 
//                         className="form-check-input" 
//                         type="checkbox" 
//                         id="show-address" 
//                         checked={propertyData.showAddress}
//                         onChange={handleInputChange}
//                         name="showAddress"
//                       />
//                       <label className="form-check-label" htmlFor="show-address">
//                         Show exact address to potential buyers
//                       </label>
//                       <div className="form-text text-muted">
//                         If unchecked, only the general area will be shown to protect privacy
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-12">
//                     <div id="location-map" className="location-map-placeholder">
//                       <div className="text-center py-5">
//                         <i className="bi bi-map" style={{fontSize: "3rem", color: "#6c757d"}}></i>
//                         <p className="mt-2">Map integration available with Google Maps API</p>
//                         <button type="button" className="btn btn-outline-primary btn-sm mt-2" disabled>
//                           <i className="bi bi-pin-map"></i> Set Location on Map
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="d-flex justify-content-between mt-4">
//                 <div>
//                   <button type="button" className="btn btn-outline-secondary" onClick={saveAsDraft}>
//                     <i className="bi bi-save"></i> Save Draft
//                   </button>
//                 </div>
//                 <button type="button" className="btn btn-primary" onClick={nextStep}>
//                   Next: Property Details <i className="bi bi-arrow-right"></i>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 2: Property Details */}
//           {currentStep === 2 && (
//             <div className="form-step active">
//               <div className="form-section">
//                 <h4><i className="bi bi-rulers me-2"></i>Property Specifications</h4>
//                 {renderPropertySpecifications()}
//               </div>

//               <div className="form-section">
//                 <h4><i className="bi bi-tags me-2"></i>Property Labels</h4>
//                 <p className="text-muted mb-4">Select labels that apply to your property to help it stand out</p>

//                 <div className="row g-3">
//                   {featureTags.map(tag => (
//                     <div className="col-md-6" key={tag.id}>
//                       <div 
//                         className={`feature-tag-card ${selectedFeatures.has(tag.id) ? 'active' : ''}`}
//                         onClick={() => toggleFeatureTag(tag.id)}
//                       >
//                         <div className="d-flex align-items-center">
//                           <div className="feature-icon">
//                             <i className={`bi ${tag.icon}`}></i>
//                           </div>
//                           <div className="ms-3">
//                             <h6 className="mb-0">{tag.label}</h6>
//                             <p className="text-muted small mb-0">{tag.description}</p>
//                           </div>
//                           <div className="ms-auto">
//                             <input 
//                               type="checkbox" 
//                               checked={selectedFeatures.has(tag.id)}
//                               onChange={() => {}}
//                               className="form-check-input"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="d-flex justify-content-between mt-4">
//                 <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
//                   <i className="bi bi-arrow-left"></i> Back to Basic Info
//                 </button>
//                 <button type="button" className="btn btn-primary" onClick={nextStep}>
//                   Next: Features & Amenities <i className="bi bi-arrow-right"></i>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 3: Amenities & Features */}
//           {currentStep === 3 && (
//             <div className="form-step active">
//               <div className="form-section">
//                 <h4><i className="bi bi-house-door me-2"></i>Interior Features</h4>
//                 {interiorFeaturesList.map((category, index) => (
//                   <div key={index} className="mb-4">
//                     <h6 className="text-primary mb-3">{category.category}</h6>
//                     <div className="row g-2">
//                       {category.features.map(feature => (
//                         <div className="col-md-6 col-lg-4" key={feature}>
//                           <div className="form-check">
//                             <input 
//                               className="form-check-input" 
//                               type="checkbox" 
//                               id={`int-${feature.toLowerCase().replace(/[ /]/g, '-')}`}
//                               checked={interiorFeatures.has(feature)}
//                               onChange={() => toggleInteriorFeature(feature)}
//                             />
//                             <label className="form-check-label" htmlFor={`int-${feature.toLowerCase().replace(/[ /]/g, '-')}`}>
//                               {feature}
//                             </label>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="form-section">
//                 <h4><i className="bi bi-tree me-2"></i>Exterior Features</h4>
//                 {exteriorFeaturesList.map((category, index) => (
//                   <div key={index} className="mb-4">
//                     <h6 className="text-primary mb-3">{category.category}</h6>
//                     <div className="row g-2">
//                       {category.features.map(feature => (
//                         <div className="col-md-6 col-lg-4" key={feature}>
//                           <div className="form-check">
//                             <input 
//                               className="form-check-input" 
//                               type="checkbox" 
//                               id={`ext-${feature.toLowerCase().replace(/[ /]/g, '-')}`}
//                               checked={exteriorFeatures.has(feature)}
//                               onChange={() => toggleExteriorFeature(feature)}
//                             />
//                             <label className="form-check-label" htmlFor={`ext-${feature.toLowerCase().replace(/[ /]/g, '-')}`}>
//                               {feature}
//                             </label>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="form-section">
//                 <h4><i className="bi bi-plus-circle me-2"></i>Custom Features</h4>
//                 <div className="mb-3">
//                   <label htmlFor="custom-features" className="form-label">
//                     Add custom features not listed above
//                   </label>
//                   <input 
//                     type="text" 
//                     className="form-control" 
//                     id="custom-features" 
//                     placeholder="e.g., Wine cellar, Home theater, Sauna, Solar panels"
//                     onChange={handleCustomFeatures}
//                   />
//                   <div className="form-text">
//                     Separate features with commas. {propertyData.customFeatures.length} features added.
//                   </div>
                  
//                   {propertyData.customFeatures.length > 0 && (
//                     <div className="mt-3">
//                       <div className="d-flex flex-wrap gap-2">
//                         {propertyData.customFeatures.map((feature, index) => (
//                           <span key={index} className="badge bg-secondary">
//                             {feature} <button 
//                               type="button" 
//                               className="btn-close btn-close-white ms-1" 
//                               style={{fontSize: '0.5rem'}}
//                               onClick={() => {
//                                 setPropertyData(prev => ({
//                                   ...prev,
//                                   customFeatures: prev.customFeatures.filter((_, i) => i !== index)
//                                 }));
//                               }}
//                             ></button>
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="d-flex justify-content-between mt-4">
//                 <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
//                   <i className="bi bi-arrow-left"></i> Back to Details
//                 </button>
//                 <button type="button" className="btn btn-primary" onClick={nextStep}>
//                   Next: Media & Images <i className="bi bi-arrow-right"></i>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 4: Media & Images */}
//           {currentStep === 4 && (
//             <div className="form-step active">
//               <div className="form-section">
//                 <h4><i className="bi bi-images me-2"></i>Property Images</h4>
//                 <p className="text-muted mb-4">
//                   Upload high-quality images of your property. First image will be the cover photo.
//                   {validationErrors.some(e => e.field === 'images') && (
//                     <span className="text-danger ms-2">At least one image is required</span>
//                   )}
//                 </p>

//                 <div className="mb-4">
//                   <div 
//                     id="image-dropzone" 
//                     className={`dropzone ${isDragging ? 'dragging' : ''} ${validationErrors.some(e => e.field === 'images') ? 'border-danger' : ''}`}
//                     onClick={() => fileInputRef.current?.click()}
//                     onDragEnter={handleDragEnter}
//                     onDragLeave={handleDragLeave}
//                     onDragOver={handleDragOver}
//                     onDrop={handleDrop}
//                     ref={dropzoneRef}
//                   >
//                     <i className={`bi bi-cloud-arrow-up ${isDragging ? 'text-primary' : ''}`} style={{fontSize: "3rem"}}></i>
//                     <h5 className="mt-3">
//                       {isDragging ? 'Drop images here' : 'Drag & drop images or click to browse'}
//                     </h5>
//                     <p className="text-muted">Supported formats: JPG, PNG, WEBP (Max 5MB each)</p>
//                     <button type="button" className="btn btn-outline-primary mt-2">
//                       <i className="bi bi-folder2-open me-2"></i> Browse Files
//                     </button>
//                     <input 
//                       type="file" 
//                       ref={fileInputRef}
//                       style={{display: 'none'}}
//                       multiple
//                       accept="image/*"
//                       onChange={handleFileUpload}
//                     />
//                   </div>
//                 </div>

//                 {uploadedImages.length > 0 && (
//                   <div className="mb-4">
//                     <h6>Uploaded Images ({uploadedImages.length})</h6>
//                     <div className="image-preview-container">
//                       {uploadedImages.map((image, index) => (
//                         <div className="image-preview" key={index}>
//                           <div className="image-preview-inner">
//                             <img src={image} alt={`Property ${index + 1}`} />
//                             <div className="image-actions">
//                               <button 
//                                 type="button" 
//                                 className="btn btn-sm btn-danger"
//                                 onClick={() => removeImage(index)}
//                                 title="Remove image"
//                               >
//                                 <i className="bi bi-trash"></i>
//                               </button>
//                               {index === 0 && (
//                                 <span className="badge bg-primary">Cover</span>
//                               )}
//                             </div>
//                             <div className="image-number">{index + 1}</div>
//                           </div>
//                           {index === 0 && (
//                             <div className="image-label text-center small mt-1">Cover Image</div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                     <div className="mt-2">
//                       <button 
//                         type="button" 
//                         className="btn btn-sm btn-outline-secondary"
//                         onClick={() => {
//                           if (uploadedImages.length > 1) {
//                             const newOrder = [...uploadedImages];
//                             const first = newOrder.shift();
//                             if (first) newOrder.push(first);
//                             setUploadedImages(newOrder);
//                             setPropertyData(prev => ({ ...prev, images: newOrder }));
//                           }
//                         }}
//                       >
//                         <i className="bi bi-arrow-clockwise me-1"></i> Rotate Cover Image
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 <div className="alert alert-info mt-4">
//                   <i className="bi bi-info-circle me-2"></i>
//                   <strong>Image Tips:</strong> Include photos of all rooms, exterior views, amenities, and neighborhood features. 
//                   High-quality photos can increase views by up to 40%. Recommended order: Exterior, Living room, Kitchen, Bedrooms, Bathrooms, Amenities.
//                 </div>
//               </div>

//               <div className="form-section">
//                 <h4><i className="bi bi-camera-video me-2"></i>Virtual Tour & Videos</h4>

//                 <div className="mb-4">
//                   <label htmlFor="video-url" className="form-label">Video URL (YouTube, Vimeo)</label>
//                   <input 
//                     type="url" 
//                     className="form-control" 
//                     id="video-url" 
//                     placeholder="https://www.youtube.com/watch?v=..."
//                     value={propertyData.videoUrl || ''}
//                     onChange={handleInputChange}
//                     name="videoUrl"
//                   />
//                   <div className="form-text">Add a link to a video tour of your property</div>
//                 </div>

//                 <div className="mb-4">
//                   <label htmlFor="virtual-tour" className="form-label">Virtual Tour URL</label>
//                   <input 
//                     type="url" 
//                     className="form-control" 
//                     id="virtual-tour" 
//                     placeholder="https://myvirtualtour.com/..."
//                     value={propertyData.virtualTourUrl || ''}
//                     onChange={handleInputChange}
//                     name="virtualTourUrl"
//                   />
//                   <div className="form-text">Link to a 360° virtual tour if available</div>
//                 </div>
//               </div>

//               <div className="d-flex justify-content-between mt-4">
//                 <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
//                   <i className="bi bi-arrow-left"></i> Back to Features
//                 </button>
//                 <button type="button" className="btn btn-primary" onClick={nextStep}>
//                   Next: Review & Publish <i className="bi bi-arrow-right"></i>
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 5: Review & Agent Info */}
//           {currentStep === 5 && (
//             <div className="form-step active">
//               <div className="form-section">
//                 <h4><i className="bi bi-person-circle me-2"></i>Agent Information</h4>

//                 <div className="row">
//                   <div className="col-md-12 mb-4">
//                     <div className="form-check form-switch">
//                       <input 
//                         className="form-check-input" 
//                         type="checkbox"
//                         id="show-agent"
//                         checked={propertyData.showAgent}
//                         onChange={handleInputChange}
//                         name="showAgent"
//                       />
//                       <label className="form-check-label" htmlFor="show-agent">
//                         <strong>Show agent information on listing</strong>
//                       </label>
//                       <div className="form-text">
//                         If enabled, agent contact information will be visible to potential buyers
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {propertyData.showAgent && (
//                   <div className="card bg-light">
//                     <div className="card-body">
//                       <h6 className="card-title">Agent Details</h6>
//                       <div className="row">
//                         <div className="col-md-6 mb-3">
//                           <label htmlFor="agent-name" className="form-label">Agent Name</label>
//                           <input 
//                             type="text" 
//                             className="form-control" 
//                             id="agent-name" 
//                             placeholder="e.g., Sarah Johnson"
//                             value={propertyData.agent?.name || ''}
//                             onChange={(e) => setPropertyData(prev => ({
//                               ...prev,
//                               agent: { ...(prev.agent || { name: '', title: '', phone: '', email: '' }), name: e.target.value }
//                             }))}
//                           />
//                         </div>
//                         <div className="col-md-6 mb-3">
//                           <label htmlFor="agent-title" className="form-label">Agent Title</label>
//                           <input 
//                             type="text" 
//                             className="form-control" 
//                             id="agent-title" 
//                             placeholder="e.g., Licensed Real Estate Agent"
//                             value={propertyData.agent?.title || ''}
//                             onChange={(e) => setPropertyData(prev => ({
//                               ...prev,
//                               agent: { ...(prev.agent || { name: '', title: '', phone: '', email: '' }), title: e.target.value }
//                             }))}
//                           />
//                         </div>
//                       </div>

//                       <div className="row">
//                         <div className="col-md-6 mb-3">
//                           <label htmlFor="agent-phone" className="form-label">Phone Number</label>
//                           <input 
//                             type="tel" 
//                             className="form-control" 
//                             id="agent-phone" 
//                             placeholder="+1 (555) 123-4567"
//                             value={propertyData.agent?.phone || ''}
//                             onChange={(e) => setPropertyData(prev => ({
//                               ...prev,
//                               agent: { ...(prev.agent || { name: '', title: '', phone: '', email: '' }), phone: e.target.value }
//                             }))}
//                           />
//                         </div>
//                         <div className="col-md-6 mb-3">
//                           <label htmlFor="agent-email" className="form-label">Email Address</label>
//                           <input 
//                             type="email" 
//                             className="form-control" 
//                             id="agent-email" 
//                             placeholder="agent@example.com"
//                             value={propertyData.agent?.email || ''}
//                             onChange={(e) => setPropertyData(prev => ({
//                               ...prev,
//                               agent: { ...(prev.agent || { name: '', title: '', phone: '', email: '' }), email: e.target.value }
//                             }))}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="form-section">
//                 <h4><i className="bi bi-eye me-2"></i>Review Your Listing</h4>

//                 <div className="alert alert-success">
//                   <div className="d-flex align-items-center">
//                     <i className="bi bi-check-circle-fill me-3" style={{fontSize: '2rem'}}></i>
//                     <div>
//                       <h5 className="alert-heading mb-1">Ready to Publish!</h5>
//                       <p className="mb-0">Review all the information below before publishing your property listing.</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="card mb-3">
//                       <div className="card-body">
//                         <h6 className="card-title"><i className="bi bi-file-text me-2"></i>Property Summary</h6>
//                         <div className="property-summary">
//                           <div className="mb-3">
//                             <p className="mb-1"><strong>Title:</strong> {propertyData.title || 'Not set'}</p>
//                             <p className="mb-1"><strong>Type:</strong> {propertyData.propertyType ? propertyData.propertyType.charAt(0).toUpperCase() + propertyData.propertyType.slice(1) : 'Not set'}</p>
//                             <p className="mb-1"><strong>Status:</strong> {propertyData.status.join(' & ') || 'Not set'}</p>
//                             {propertyData.salePrice && (
//                               <p className="mb-1"><strong>Sale Price:</strong> ${propertyData.salePrice.toLocaleString()}</p>
//                             )}
//                             {propertyData.rentPrice && (
//                               <p className="mb-1"><strong>Rent Price:</strong> ${propertyData.rentPrice.toLocaleString()}/month</p>
//                             )}
//                           </div>
//                           <div className="mb-3">
//                             <p className="mb-1"><strong>Location:</strong> {propertyData.address || 'Not set'}, {propertyData.city || 'Not set'}</p>
//                             <p className="mb-1"><strong>Show Address:</strong> {propertyData.showAddress ? 'Yes' : 'No'}</p>
//                           </div>
//                           <div className="mb-3">
//                             <p className="mb-1"><strong>Building Size:</strong> {propertyData.buildingSize ? `${propertyData.buildingSize} ${propertyData.sizeUnit}` : 'Not set'}</p>
//                             {propertyData.landSize && (
//                               <p className="mb-1"><strong>Land Size:</strong> {propertyData.landSize} {propertyData.sizeUnit}</p>
//                             )}
//                             <p className="mb-1"><strong>Bedrooms:</strong> {propertyData.bedrooms ?? 'Not set'}</p>
//                             <p className="mb-1"><strong>Bathrooms:</strong> {propertyData.bathrooms ?? 'Not set'}</p>
//                           </div>
//                           <div className="mb-3">
//                             <p className="mb-1"><strong>Images:</strong> {propertyData.images.length} uploaded</p>
//                             <p className="mb-1"><strong>Features:</strong> {interiorFeatures.size + exteriorFeatures.size} selected</p>
//                             <p className="mb-1"><strong>Labels:</strong> {Array.from(selectedFeatures).map(f => featureTags.find(t => t.id === f)?.label).filter(Boolean).join(', ') || 'None'}</p>
//                           </div>
//                           {propertyData.showAgent && propertyData.agent?.name && (
//                             <div className="mb-3">
//                               <p className="mb-1"><strong>Agent:</strong> {propertyData.agent.name}</p>
//                               <p className="mb-1"><strong>Contact:</strong> {propertyData.agent.phone || 'Not provided'}</p>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="card">
//                       <div className="card-body">
//                         <h6 className="card-title"><i className="bi bi-eye me-2"></i>Listing Preview</h6>
//                         <div className="property-preview">
//                           <div className="preview-image mb-3">
//                             {uploadedImages.length > 0 ? (
//                               <img 
//                                 src={uploadedImages[0]} 
//                                 alt="Property" 
//                                 className="img-fluid rounded"
//                               />
//                             ) : (
//                               <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{height: '150px'}}>
//                                 <i className="bi bi-house text-muted" style={{fontSize: "3rem"}}></i>
//                               </div>
//                             )}
//                           </div>
//                           <h6 className="preview-title">{propertyData.title || 'Property Title'}</h6>
//                           <div className="preview-price mb-2">
//                             {propertyData.salePrice && (
//                               <p className="text-primary mb-1">
//                                 <strong>${propertyData.salePrice.toLocaleString()}</strong> (Sale)
//                               </p>
//                             )}
//                             {propertyData.rentPrice && (
//                               <p className="text-primary mb-1">
//                                 <strong>${propertyData.rentPrice.toLocaleString()}/month</strong> (Rent)
//                               </p>
//                             )}
//                           </div>
//                           <p className="preview-location text-muted small mb-3">
//                             <i className="bi bi-geo-alt"></i> {propertyData.city || 'City'}
//                           </p>
//                           <div className="preview-features d-flex justify-content-between text-muted small">
//                             {propertyData.bedrooms !== undefined && (
//                               <span><i className="bi bi-door-closed"></i> {propertyData.bedrooms} Bed</span>
//                             )}
//                             {propertyData.bathrooms !== undefined && (
//                               <span><i className="bi bi-droplet"></i> {propertyData.bathrooms} Bath</span>
//                             )}
//                             {propertyData.buildingSize && (
//                               <span><i className="bi bi-arrows-angle-expand"></i> {propertyData.buildingSize} {propertyData.sizeUnit}</span>
//                             )}
//                           </div>
//                           <div className="preview-status mt-2">
//                             {propertyData.status.map(status => (
//                               <span key={status} className="badge bg-primary me-1">{status}</span>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="form-check mt-4">
//                   <input className="form-check-input" type="checkbox" id="terms-agreement" required />
//                   <label className="form-check-label" htmlFor="terms-agreement">
//                     I agree to the <Link href="/terms" className="text-primary">Terms of Service</Link> and confirm that all information provided is accurate.
//                     I understand that providing false information may result in listing removal.
//                   </label>
//                 </div>
//               </div>

//               <div className="d-flex justify-content-between mt-4">
//                 <button type="button" className="btn btn-outline-secondary" onClick={prevStep}>
//                   <i className="bi bi-arrow-left"></i> Back to Media
//                 </button>
//                 <div>
//                   <button type="button" className="btn btn-outline-primary me-2" onClick={saveAsDraft}>
//                     <i className="bi bi-save"></i> Save as Draft
//                   </button>
//                   <button 
//                     type="button" 
//                     className="btn btn-success" 
//                     onClick={submitProperty}
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                         Publishing...
//                       </>
//                     ) : (
//                       <>
//                         <i className="bi bi-check-lg me-2"></i> Publish Property
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </section>
//     </main>
//   );
// }








// app/admin/properties/new/page.tsx
"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import "./styles.css"
import { PropertiesRepository } from '@/lib/repositories/PropertiesRepository';
import { ImageUploadService } from '@/services/ImageUploadService';
import { createClient } from '@/lib/supabase/supabase';
import { checkIfAdmin } from '@/utils/checkIfAdmin';
import Image from 'next/image';
import AppLoader from '@/components/ui/AppLoader/AppLoader';

interface PropertyData {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  price: number;
  salePrice?: number;
  rentPrice?: number;
  status: ('For Sale' | 'For Rent' | 'Sold')[];
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
  
  const supabase = createClient();

  const [propertyData, setPropertyData] = useState<PropertyData>({
    id: '',
    title: '',
    description: '',
    propertyType: '',
    price: 0,
    status: [],
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
      
      if (data.status.includes('For Sale') && !data.salePrice && data.salePrice !== 0) {
        errors.push({ field: 'salePrice', message: 'Sale price is required when property is for sale' });
      }
      if (data.status.includes('For Rent') && !data.rentPrice && data.rentPrice !== 0) {
        errors.push({ field: 'rentPrice', message: 'Rent price is required when property is for rent' });
      }
      
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
        currentStatus.splice(index, 1);
        
        if (status === 'For Sale') {
          return { ...prev, status: currentStatus, salePrice: undefined };
        } else if (status === 'For Rent') {
          return { ...prev, status: currentStatus, rentPrice: undefined };
        }
        return { ...prev, status: currentStatus };
      } else {
        if (status === 'Sold') {
          return { 
            ...prev, 
            status: ['Sold'],
            salePrice: undefined,
            rentPrice: undefined
          };
        }
        
        if (currentStatus.includes('Sold')) {
          return { 
            ...prev, 
            status: [status],
            salePrice: status === 'For Sale' ? prev.salePrice : undefined,
            rentPrice: status === 'For Rent' ? prev.rentPrice : undefined
          };
        }
        
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
      
      if (name === 'salePrice' && parseFloat(value) <= 0) {
        setValidationErrors(prev => [...prev, { field: 'salePrice', message: 'Sale price must be greater than 0' }]);
      }
      if (name === 'rentPrice' && parseFloat(value) <= 0) {
        setValidationErrors(prev => [...prev, { field: 'rentPrice', message: 'Rent price must be greater than 0' }]);
      }
    } else {
      setPropertyData(prev => ({ ...prev, [name]: value }));
      
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
    const maxSize = 5 * 1024 * 1024;
    
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
    
    setSelectedImages((prev) => [...prev, ...fileArray]);

    const previews = fileArray.map((file) => URL.createObjectURL(file));

    setUploadedImages((prev) => [...prev, ...previews]);
    clearValidationError('images');

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
    
    const dataTransfer = new DataTransfer();
    validFiles.forEach(file => dataTransfer.items.add(file));
    
    if (fileInputRef.current) {
      fileInputRef.current.files = dataTransfer.files;
      handleFileUpload({ target: { files: dataTransfer.files } } as ChangeEvent<HTMLInputElement>);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
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
    return crypto.randomUUID();
    // return 'prop_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // Submit property - UPDATED to send camelCase
  const imageService = new ImageUploadService();

  const submitProperty = async (e: FormEvent) => {
    e.preventDefault();
    
    const termsCheckbox = document.getElementById("terms-agreement") as HTMLInputElement;
    if (!termsCheckbox?.checked) {
      alert("Please agree to the Terms of Service before publishing.");
      termsCheckbox.focus();
      return;
    }

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
    
    const timeoutId = setTimeout(() => {
      console.error('Submission is taking too long!');
      alert('Submission is taking too long. Please check your connection and try again.');
      setIsSubmitting(false);
    }, 45000);

    try {
      console.log('Starting property submission...');
      
      /* 1️⃣ Upload ALL images to ImgBB */
      const uploadedImageUrls: string[] = [];

      if (selectedImages.length === 0) {
        console.warn('No images selected for upload');
        // Throw error or handle appropriately
        throw new Error('At least one property image is required');
      }

      // Upload all images
      console.log(`Uploading ${selectedImages.length} images...`);
      
      for (let i = 0; i < selectedImages.length; i++) {
        const file = selectedImages[i];
        try {
          console.log(`Uploading image ${i + 1}/${selectedImages.length}: ${file.name}`);
          const url = await imageService.upload(file);
          uploadedImageUrls.push(url);
          console.log(`Image ${i + 1} uploaded successfully`);
        } catch (error) {
          console.error(`Error uploading image ${file.name}:`, error);
          // You can decide whether to continue or stop
          throw new Error(`Failed to upload image: ${file.name}. Please try again.`);
        }
      }

      console.log(`Successfully uploaded ${uploadedImageUrls.length} images to ImgBB`);

      /* 2️⃣ Build final clean domain object - Use CAMEL CASE */
      const finalData = {
        id: generateId(),
        title: propertyData.title,
        description: propertyData.description,
        propertyType: propertyData.propertyType,
        salePrice: propertyData.salePrice,
        rentPrice: propertyData.rentPrice,
        status: propertyData.status,
        address: propertyData.address,
        city: propertyData.city,
        showAddress: propertyData.showAddress,
        images: uploadedImageUrls, // 👈 Now contains ALL image URLs
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        buildingSize: propertyData.buildingSize,
        landSize: propertyData.landSize,
        sizeUnit: propertyData.sizeUnit,
        yearBuilt: propertyData.yearBuilt,
        garage: propertyData.garage,
        zoning: propertyData.zoning,
        utilities: propertyData.utilities,
        hot: selectedFeatures.has("hot"),
        newListing: selectedFeatures.has("newListing"),
        featured: selectedFeatures.has("featured"),
        exclusive: selectedFeatures.has("exclusive"),
        interiorFeatures: Array.from(interiorFeatures),
        exteriorFeatures: Array.from(exteriorFeatures),
        customFeatures: propertyData.customFeatures,
        videoUrl: propertyData.videoUrl,
        virtualTourUrl: propertyData.virtualTourUrl,
        showAgent: propertyData.showAgent,
        agent: propertyData.agent,
        published: true,
        draft: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (!propertyData.showAgent) {
        delete (finalData as any).agent;
      }

      console.log('Final data with images:', finalData);

      /* 3️⃣ Save to Supabase using PropertiesRepository */
      console.log('Saving to Supabase...');
      const propertiesRepo = new PropertiesRepository();
      
      try {
        const result = await propertiesRepo.create(finalData);
        console.log('Property saved successfully with', uploadedImageUrls.length, 'images');
      } catch (repoError: any) {
        console.error('Repository error details:', {
          message: repoError.message,
          details: repoError.details,
          hint: repoError.hint,
          code: repoError.code
        });
        throw repoError;
      }

      /* 4️⃣ Clear draft and redirect */
      localStorage.removeItem('propertyDraft');
      clearTimeout(timeoutId);
      alert(`Property published successfully with ${uploadedImageUrls.length} images!`);
      router.push("/admin/properties");
      
    } catch (error: any) {
      console.error("Error submitting property:", error);
      clearTimeout(timeoutId);
      
      let errorMessage = 'Failed to publish property. ';
      
      if (error.message) {
        errorMessage += error.message;
      }
      
      if (error.details) {
        errorMessage += ` Details: ${error.details}`;
      }
      
      if (error.hint) {
        errorMessage += ` Hint: ${error.hint}`;
      }
      
      alert(errorMessage);
    } finally {
      clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  // Save as draft - UPDATED to send camelCase
  const saveAsDraft = async () => {
    const draftData = {
      ...propertyData,
      hot: selectedFeatures.has('hot'),
      newListing: selectedFeatures.has('newListing'),
      featured: selectedFeatures.has('featured'),
      exclusive: selectedFeatures.has('exclusive'),
      interiorFeatures: Array.from(interiorFeatures),
      exteriorFeatures: Array.from(exteriorFeatures),
      draft: true,
      published: false,
      lastSaved: new Date().toISOString()
    };

    // Save locally
    localStorage.setItem('propertyDraft', JSON.stringify(draftData));
    
    // Optionally save to Supabase as draft
    try {
      const propertiesRepo = new PropertiesRepository();
      if (propertyData.id) {
        await propertiesRepo.update(propertyData.id, draftData);
      } else {
        const created = await propertiesRepo.create({
          ...draftData,
          id: generateId()
        });
        setPropertyData(prev => ({ ...prev, id: created.id }));
      }
      alert('Draft saved successfully! You can continue editing later.');
    } catch (error) {
      console.error('Error saving draft to Supabase:', error);
      alert('Draft saved locally only. Please check your connection.');
    }
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
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace("/login");
        return;
      }

      const admin = await checkIfAdmin(session.user.id);

      if (!admin) {
        console.log('User is not admin:', session.user.id);
        return;
      }

      setIsAdmin(true);
      setChecking(false);
    };

    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.replace("/login");
          return;
        }
        
        const admin = await checkIfAdmin(session.user.id);
        if (!admin) {
          console.log('User is not admin:', session.user.id);
          return;
        }
        
        setIsAdmin(true);
        setChecking(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  // Show loading while checking authentication
  if (checking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          {/* <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div> */}
          <AppLoader />
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

  // // Helper function to format price display
  // const formatPriceDisplay = () => {
  //   const parts = [];
  //   if (propertyData.salePrice) {
  //     parts.push(`$${propertyData.salePrice.toLocaleString()} (Sale)`);
  //   }
  //   if (propertyData.rentPrice) {
  //     parts.push(`$${propertyData.rentPrice.toLocaleString()}/month (Rent)`);
  //   }
  //   return parts.join(' • ');
  // };

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
                            <Image src={image} alt={`Property ${index + 1}`} 
                              width={0}
                              height={0}
                              unoptimized
                            />
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
                              <Image
                                src={uploadedImages[0]} 
                                alt="Property" 
                                className="img-fluid rounded"
                                width={0}
                                height={0}
                                unoptimized
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