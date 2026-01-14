// hooks/useTemplateScripts.js
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useTemplateScripts() {
  const pathname = usePathname();

  useEffect(() => {
    // Re-initialize template scripts on route change
    const initTemplateScripts = () => {
      // Initialize AOS
      if (typeof AOS !== 'undefined') {
        AOS.init({
          duration: 1000,
          easing: 'ease-in-out',
          once: true,
          mirror: false
        });
      }

      // Initialize PureCounter
      if (typeof PureCounter !== 'undefined') {
        new PureCounter();
      }

      // Initialize GLightbox
      if (typeof GLightbox !== 'undefined') {
        const lightbox = GLightbox({
          selector: '.glightbox'
        });
      }

      // Initialize Swiper if exists on page
      if (typeof Swiper !== 'undefined') {
        const swiperElements = document.querySelectorAll('.init-swiper');
        swiperElements.forEach(el => {
          const config = JSON.parse(el.querySelector('.swiper-config')?.textContent || '{}');
          new Swiper(el, config);
        });
      }

      // Initialize image gallery navigation with zoom
      initImageGallery();
    };

    // Initialize after a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initTemplateScripts();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]); // Re-run on route change
}

// Image gallery initialization function with zoom support
function initImageGallery() {
  // Main image gallery navigation
  const thumbnailItems = document.querySelectorAll('.thumbnail-item');
  const mainImage = document.getElementById('main-product-image');
  const prevBtn = document.querySelector('.prev-image');
  const nextBtn = document.querySelector('.next-image');

  if (!thumbnailItems.length || !mainImage) return;

  let currentIndex = 0;
  let driftInstance = null;

  // Function to update main image
  const updateMainImage = (index) => {
    const thumbnail = thumbnailItems[index];
    if (!thumbnail) return;
    
    const imageUrl = thumbnail.getAttribute('data-image');
    mainImage.src = imageUrl;
    mainImage.setAttribute('data-zoom', imageUrl);
    
    // Update active class
    thumbnailItems.forEach(item => item.classList.remove('active'));
    thumbnail.classList.add('active');
    
    currentIndex = index;
    
    // Update Drift zoom image if available
    if (typeof Drift !== 'undefined' && driftInstance) {
      setTimeout(() => {
        driftInstance.setZoomImageURL(imageUrl);
      }, 50);
    }
  };

  // Initialize Drift zoom on the main image - WITHOUT hoverBoundingBox
  const initDriftZoom = () => {
    if (typeof Drift !== 'undefined' && mainImage) {
      driftInstance = new Drift(mainImage, {
        paneContainer: document.querySelector('.image-zoom-container'),
        zoomFactor: 2.5,
        hoverBoundingBox: false, // <-- This removes the dark rectangle
        injectBaseStyles: true,
        containInline: true,
        touchDelay: 0
      });
      
      // Store instance globally for access
      window.driftInstance = driftInstance;
    }
  };

  // Thumbnail click events
  thumbnailItems.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
      updateMainImage(index);
    });
  });

  // Navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : thumbnailItems.length - 1;
      updateMainImage(newIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const newIndex = currentIndex < thumbnailItems.length - 1 ? currentIndex + 1 : 0;
      updateMainImage(newIndex);
    });
  }

  // Initialize Drift zoom on page load
  if (typeof Drift !== 'undefined') {
    setTimeout(() => {
      initDriftZoom();
    }, 200);
  }
}




// // hooks/useTemplateScripts.js
// import { useEffect } from 'react';
// import { usePathname } from 'next/navigation';

// export function useTemplateScripts() {
//   const pathname = usePathname();

//   useEffect(() => {
//     // Re-initialize template scripts on route change
//     const initTemplateScripts = () => {
//       // Initialize AOS
//       if (typeof AOS !== 'undefined') {
//         AOS.init({
//           duration: 1000,
//           easing: 'ease-in-out',
//           once: true,
//           mirror: false
//         });
//       }

//       // Initialize PureCounter
//       if (typeof PureCounter !== 'undefined') {
//         new PureCounter();
//       }

//       // Initialize GLightbox
//       if (typeof GLightbox !== 'undefined') {
//         const lightbox = GLightbox({
//           selector: '.glightbox'
//         });
//       }

//       // Initialize Swiper if exists on page
//       if (typeof Swiper !== 'undefined') {
//         const swiperElements = document.querySelectorAll('.init-swiper');
//         swiperElements.forEach(el => {
//           const config = JSON.parse(el.querySelector('.swiper-config')?.textContent || '{}');
//           new Swiper(el, config);
//         });
//       }

//       // Initialize image gallery navigation WITH zoom support
//       initImageGalleryWithZoom();
//     };

//     // Initialize after a small delay to ensure DOM is ready
//     const timer = setTimeout(() => {
//       initTemplateScripts();
//     }, 100);

//     return () => clearTimeout(timer);
//   }, [pathname]); // Re-run on route change
// }

// // Image gallery initialization function with zoom support
// function initImageGalleryWithZoom() {
//   // Main image gallery navigation
//   const thumbnailItems = document.querySelectorAll('.thumbnail-item');
//   const mainImage = document.getElementById('main-product-image');
//   const prevBtn = document.querySelector('.prev-image');
//   const nextBtn = document.querySelector('.next-image');

//   if (!thumbnailItems.length || !mainImage) return;

//   let currentIndex = 0;
//   let driftInstance = null;

//   // Initialize Drift zoom if available
//   const initDriftZoom = (imageElement) => {
//     if (typeof Drift !== 'undefined') {
//       // Destroy previous instance if exists
//       if (driftInstance) {
//         driftInstance.destroy();
//       }
      
//       // Create new Drift instance
//       driftInstance = new Drift(imageElement, {
//         paneContainer: imageElement.parentElement,
//         zoomFactor: 3,
//         hoverBoundingBox: true,
//         injectBaseStyles: true,
//         zoomFactor: 2.5,
//         containInline: true,
//         hoverDelay: 100,
//         touchDelay: 100,
//         onShow: () => console.log('Zoom shown'),
//         onHide: () => console.log('Zoom hidden')
//       });
      
//       // Store instance globally for updates
//       window.driftInstance = driftInstance;
//     }
//   };

//   // Function to update main image
//   const updateMainImage = (index) => {
//     const thumbnail = thumbnailItems[index];
//     if (!thumbnail) return;
    
//     const imageUrl = thumbnail.getAttribute('data-image') || thumbnail.querySelector('img').src;
//     const zoomImageUrl = thumbnail.getAttribute('data-zoom-image') || imageUrl;
    
//     // Update main image source
//     mainImage.src = imageUrl;
//     mainImage.setAttribute('data-zoom', zoomImageUrl);
    
//     // Update active class
//     thumbnailItems.forEach(item => item.classList.remove('active'));
//     thumbnail.classList.add('active');
    
//     currentIndex = index;
    
//     // Re-initialize Drift zoom with new image
//     if (typeof Drift !== 'undefined') {
//       // Small delay to ensure image is loaded
//       setTimeout(() => {
//         if (driftInstance) {
//           // Update the zoom image source
//           driftInstance.setZoomImageURL(zoomImageUrl);
//           driftInstance._zoomPane.style.backgroundImage = `url('${zoomImageUrl}')`;
//         } else {
//           // Initialize Drift if not already initialized
//           initDriftZoom(mainImage);
//         }
//       }, 50);
//     }
//   };

//   // Clean up event listeners to prevent duplicates
//   const cleanupEventListeners = () => {
//     thumbnailItems.forEach((thumbnail, index) => {
//       const newThumbnail = thumbnail.cloneNode(true);
//       thumbnail.parentNode.replaceChild(newThumbnail, thumbnail);
//     });
//   };

//   // Initialize event listeners
//   const setupEventListeners = () => {
//     // Thumbnail click events
//     thumbnailItems.forEach((thumbnail, index) => {
//       thumbnail.addEventListener('click', () => {
//         updateMainImage(index);
//       });
//     });

//     // Navigation buttons
//     if (prevBtn) {
//       const newPrevBtn = prevBtn.cloneNode(true);
//       prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
//       newPrevBtn.addEventListener('click', (e) => {
//         e.preventDefault();
//         const newIndex = currentIndex > 0 ? currentIndex - 1 : thumbnailItems.length - 1;
//         updateMainImage(newIndex);
//       });
//     }

//     if (nextBtn) {
//       const newNextBtn = nextBtn.cloneNode(true);
//       nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
//       newNextBtn.addEventListener('click', (e) => {
//         e.preventDefault();
//         const newIndex = currentIndex < thumbnailItems.length - 1 ? currentIndex + 1 : 0;
//         updateMainImage(newIndex);
//       });
//     }
//   };

//   // Clean up and set up listeners
//   cleanupEventListeners();
//   setupEventListeners();

//   // Initialize Drift zoom on first load
//   if (typeof Drift !== 'undefined' && mainImage) {
//     setTimeout(() => {
//       initDriftZoom(mainImage);
//     }, 200);
//   }
// }

// // Export a function to manually trigger gallery initialization
// export function initPropertyGallery() {
//   initImageGalleryWithZoom();
// }