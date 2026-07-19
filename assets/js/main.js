// BHARTI GREEN TECH - Main Controller Script

document.addEventListener('DOMContentLoaded', () => {
  // 1. PAGE LOADER INITIALIZATION
  const loader = document.getElementById('pageLoader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
      }, 300);
    });
  }

  // 2. STICKY HEADER ACTIONS
  const header = document.querySelector('header');
  const scrollThreshold = 40;

  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initial scroll check

  // 3. RESPONSIVE BURGER DRAWER
  const burger = document.querySelector('.burger-menu');
  const navLinks = document.querySelector('.nav-links');
  
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close mobile menu on clicking any navigation link
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // 4. INTERSECTION OBSERVER FOR SCROLL REVEALS
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // 5. LANGUAGE SUPPORT EVENTS
  // Redundant local language switcher removed. Handled by global languageManager.js.
  // We listen to the languageChanged event to update dynamic select components:
  window.addEventListener('languageChanged', () => {
    populateProductDropdown();
  });

  // 6. SCROLL TO TOP UTILITY
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 7. INQUIRY FORM VALIDATION AND SUBMIT
  const populateProductDropdown = () => {
    const productSelect = document.getElementById('interestedProduct');
    if (productSelect && typeof PRODUCTS_DATA !== 'undefined') {
      const savedVal = productSelect.value;
      const placeholderText = window.i18n ? window.i18n.t('contact.chooseProductOption') : '-- Choose Product --';
      
      productSelect.innerHTML = `<option value="">${placeholderText}</option>`;
      PRODUCTS_DATA.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.name;
        opt.textContent = p.name;
        productSelect.appendChild(opt);
      });
      if (typeof ADDITIONAL_PRODUCTS_DATA !== 'undefined') {
        ADDITIONAL_PRODUCTS_DATA.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.name;
          opt.textContent = p.name;
          productSelect.appendChild(opt);
        });
      }
      // Re-apply saved select value if possible
      if (savedVal) {
        productSelect.value = savedVal;
      }
    }
  };

  const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? (window.location.port === '3000' ? '' : 'http://localhost:3000')
    : (window.location.protocol.startsWith('file') ? 'http://localhost:3000' : '');

  const COMPANY_CONFIG = {
    whatsapp: "+919049747555"
  };

  const inquiryForm = document.getElementById('inquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('fullName').value.trim();
      const mobile = document.getElementById('phoneNumber').value.trim();
      const email = document.getElementById('email').value.trim();
      const state = document.getElementById('state').value.trim();
      const district = document.getElementById('district').value.trim();
      const crop = document.getElementById('cropType').value.trim();
      const productSelect = document.getElementById('interestedProduct');
      const product = productSelect ? productSelect.value : '';
      const message = document.getElementById('inquiryMessage').value.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      const statusMsg = document.getElementById('formStatusMsg');
      const showStatus = (text, isSuccess) => {
        if (!statusMsg) return;
        statusMsg.textContent = text;
        statusMsg.style.display = 'block';
        if (isSuccess) {
          statusMsg.style.backgroundColor = '#E8F5E9';
          statusMsg.style.color = '#2E7D32';
          statusMsg.style.border = '1px solid #A5D6A7';
        } else {
          statusMsg.style.backgroundColor = '#FFEBEE';
          statusMsg.style.color = '#C62828';
          statusMsg.style.border = '1px solid #FFCDD2';
        }
      };

      if (statusMsg) {
        statusMsg.style.display = 'none';
      }

      // Frontend validation: Required fields
      if (!name || !mobile || !state || !district || !product || !message) {
        showStatus(window.i18n ? window.i18n.t('contact.validationRequired') : 'Please fill out all required fields marked with *', false);
        return;
      }

      // Frontend validation: Mobile number must contain exactly 10 digits
      const exactly10Digits = /^\d{10}$/;
      if (!exactly10Digits.test(mobile)) {
        showStatus(window.i18n ? window.i18n.t('contact.validationPhone') : 'Mobile number must contain exactly 10 digits.', false);
        return;
      }

      if (email && !emailRegex.test(email)) {
        showStatus(window.i18n ? window.i18n.t('contact.validationEmail') : 'Please enter a valid email address.', false);
        return;
      }

      const submitBtn = inquiryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = window.i18n ? window.i18n.t('contact.submitting') : 'Submitting...';

      const payload = {
        full_name: name,
        phone_number: mobile,
        email: email,
        state: state,
        district: district,
        interested_product: product,
        crop_type: crop,
        message: message
      };

      try {
        const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        let data;
        try {
          data = await response.json();
        } catch {
          throw new Error(`Server returned a non-JSON response. Status: ${response.status}`);
        }

        console.log("Response status:", response.status);
        console.log("Response body:", data);

        if (!response.ok || !data.success) {
          throw new Error(data.message || `Submission failed with status ${response.status}`);
        }

        // Success state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        showStatus(window.i18n ? window.i18n.t('successSubmit') : 'Thank you! Your inquiry has been submitted successfully. Our team will contact you soon.', true);
        inquiryForm.reset();
        populateProductDropdown();

      } catch (error) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        console.error("Submission error:", error);
        showStatus(error.message || 'Failed to submit inquiry. Please check your connection and try again.', false);
      }
    });

    populateProductDropdown();
  }

  // 8. WHATSAPP ENQUIRY BUTTON
  const whatsappSubmitBtn = document.getElementById('whatsappSubmitBtn');
  if (whatsappSubmitBtn && inquiryForm) {
    whatsappSubmitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('fullName').value.trim();
      const mobile = document.getElementById('phoneNumber').value.trim();
      const state = document.getElementById('state').value.trim();
      const productSelect = document.getElementById('interestedProduct');
      const product = productSelect ? productSelect.value : '';
      const message = document.getElementById('inquiryMessage').value.trim();

      if (!name || !mobile || !state) {
        alert(window.i18n ? window.i18n.t('contact.whatsappValidation') : 'To generate a WhatsApp inquiry, please fill in your Name, Mobile, and State first.');
        return;
      }

      let text = `Hello BHARTI GREEN TECH, my name is ${name}. I am calling from ${state}.`;
      if (product) {
        text += ` I am interested in your product: ${product}.`;
      }
      if (message) {
        text += ` Message: ${message}`;
      }

      const encodedText = encodeURIComponent(text);
      const waLink = `https://wa.me/${COMPANY_CONFIG.whatsapp.replace('+', '')}?text=${encodedText}`;
      window.open(waLink, '_blank');
    });
  }

  // 9. MAP MOCK PLACEHOLDER TRIGGER
  const mapPlaceholder = document.getElementById('mapPlaceholder');
  if (mapPlaceholder) {
    mapPlaceholder.addEventListener('click', () => {
      // Replace with genuine Google Maps iframe on click
      mapPlaceholder.innerHTML = `
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.3559312157777!2d73.08051237584558!3d18.99298758289454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7e96b864a784d%3A0xe510b64d39bc1efd!2sRoadpali%2C%20Kalamboli%2C%20Panvel%2C%20Navi%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1710528400000!5m2!1sen!2sin" 
          width="100%" 
          height="350" 
          style="border:0; border-radius:16px;" 
          allowfullscreen="" 
          loading="lazy">
        </iframe>
      `;
    });
  }
});
