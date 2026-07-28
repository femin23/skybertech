document.addEventListener('DOMContentLoaded', () => {





  /* ==========================================================================
     Mobile Navigation Toggle
     ========================================================================== */
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navbar = document.getElementById('navbar');

  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navbar.classList.toggle('active');
  });

  // Close menu when clicking nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.classList.remove('active');
      navbar.classList.remove('active');
    });
  });

  /* ==========================================================================
     Header Scroll Effect
     ========================================================================== */
  const header = document.querySelector('.main-header');
  const hasHeroBanner = document.querySelector('.hero-banner') !== null;

  const updateHeaderState = () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
      header.style.height = '70px';
      if (hasHeroBanner) {
        header.classList.remove('header-transparent');
      }
    } else {
      header.style.boxShadow = 'none';
      header.style.height = '80px';
      if (hasHeroBanner) {
        header.classList.add('header-transparent');
      }
    }
  };

  // Initial call
  updateHeaderState();

  // Scroll listener
  window.addEventListener('scroll', updateHeaderState);

  /* ==========================================================================
     Client Cards Filtering Search
     ========================================================================== */
  const searchInput = document.getElementById('clients-search');
  const clientCards = document.querySelectorAll('.client-card');

  if (clientCards.length > 0) {
    const filterClients = (query) => {
      clientCards.forEach(card => {
        const name = (card.getAttribute('data-name') || '').toLowerCase().trim();
        const category = (card.getAttribute('data-category') || '').toLowerCase().trim();
        
        if (name.includes(query) || category.includes(query)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            if (card.getAttribute('style') && card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, 250);
        }
      });
    };

    // Listen for search input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        filterClients(e.target.value.toLowerCase().trim());
      });
    }

    // Check URL parameters for category filtering (redirected from home page cards)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      if (searchInput) {
        searchInput.value = categoryParam;
      }
      filterClients(categoryParam.toLowerCase().trim());
    }
  }

  /* ==========================================================================
     Statistics Count-Up Animation
     ========================================================================== */
  const stats = document.querySelectorAll('.stat-number');
  let animated = false;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 1500; // 1.5 seconds animation
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic progress
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      let currentValue = Math.floor(easeProgress * target);
      element.textContent = `${currentValue}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = `${target}${suffix}`;
      }
    };

    requestAnimationFrame(updateCount);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        stats.forEach(stat => countUp(stat));
        animated = true;
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.querySelector('.stats-sidebar');
  if (statsSection) {
    observer.observe(statsSection);
  }

  /* ==========================================================================
     Scroll Fade-in Animations
     ========================================================================== */
  const animateOnScroll = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const fadeElements = document.querySelectorAll('.animate-fade');
  fadeElements.forEach(el => animateOnScroll.observe(el));

  /* ==========================================================================
     Contact Navigation & Scroll Interaction
     ========================================================================== */
  const exploreBtn = document.getElementById('btn-explore');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        e.preventDefault();
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* ==========================================================================
     Show More / Show Less Clients Toggle
     ========================================================================== */
  const toggleClientsBtn = document.getElementById('btn-toggle-clients');
  const hiddenClients = document.querySelectorAll('.client-card.hidden-client');

  if (toggleClientsBtn && hiddenClients.length > 0) {
    let clientsExpanded = false;
    
    toggleClientsBtn.addEventListener('click', () => {
      clientsExpanded = !clientsExpanded;
      
      hiddenClients.forEach((card, index) => {
        if (clientsExpanded) {
          card.classList.remove('hidden-client');
          // Staggered reveal fade-in
          setTimeout(() => {
            card.classList.add('visible');
          }, index * 40);
        } else {
          card.classList.remove('visible');
          card.classList.add('hidden-client');
        }
      });
      
      toggleClientsBtn.textContent = clientsExpanded ? 'Show less' : 'Show all clients';
      
      // If closing, scroll back to the clients section top smoothly
      if (!clientsExpanded) {
        document.getElementById('clients').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /* ==========================================================================
     Milestones Timeline Scroll-Linked Animation
     ========================================================================== */
  const updateTimeline = () => {
    const timelineSection = document.querySelector('.milestones-timeline-section');
    if (!timelineSection) return;

    const items = document.querySelectorAll('.milestone-item');
    const numbers = document.querySelectorAll('.milestone-number');
    const activeLine = document.querySelector('.milestones-active-line');
    const isDesktop = window.innerWidth > 1024;
    
    let lastActiveIndex = -1;
    const triggerPoint = window.innerHeight * 0.65; // trigger when card reaches 65% of screen height
    
    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      
      if (itemCenter < triggerPoint) {
        item.classList.add('active');
        if (numbers[index]) numbers[index].classList.add('active');
        lastActiveIndex = index;
      } else {
        // Keep first item active by default when the section enters the screen
        if (index === 0 && lastActiveIndex === -1 && rect.top < window.innerHeight * 0.95) {
          item.classList.add('active');
          if (numbers[index]) numbers[index].classList.add('active');
          lastActiveIndex = 0;
        } else if (index > 0) {
          item.classList.remove('active');
          if (numbers[index]) numbers[index].classList.remove('active');
        }
      }
    });
    
    if (activeLine) {
      if (lastActiveIndex === -1) {
        activeLine.style.height = '0px';
        activeLine.style.width = '2px';
      } else {
        const gridRect = document.querySelector('.milestones-grid').getBoundingClientRect();
        const firstNum = numbers[0].getBoundingClientRect();
        const activeNum = numbers[lastActiveIndex].getBoundingClientRect();
        
        const topDiff = firstNum.top + firstNum.height / 2 - gridRect.top;
        const currentDiff = activeNum.top + activeNum.height / 2 - gridRect.top;
        
        if (isDesktop) {
          activeLine.style.left = '50%';
          activeLine.style.transform = 'translateX(-50%)';
        } else {
          activeLine.style.left = '20px';
          activeLine.style.transform = 'none';
        }
        
        activeLine.style.top = `${topDiff}px`;
        activeLine.style.height = `${currentDiff - topDiff}px`;
        activeLine.style.width = '2px';
      }
    }
  };

  window.addEventListener('scroll', updateTimeline);
  window.addEventListener('resize', updateTimeline);
  
  // Initial run to check position on load
  setTimeout(updateTimeline, 200);

  // Section Enquiry Form Submission
  const contactEnquiryForm = document.getElementById('contact-enquiry-form-section');
  const sectionFormSuccess = document.getElementById('section-form-success');
  
  if (contactEnquiryForm && sectionFormSuccess) {
    contactEnquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('section-form-name').value;
      const email = document.getElementById('section-form-email').value;
      const serviceSelect = document.getElementById('section-form-service');
      const service = serviceSelect.options[serviceSelect.selectedIndex].text;
      const message = document.getElementById('section-form-message').value;
      
      // Construct formatted WhatsApp message
      const whatsappText = `Hi Skybertech,\n\nI have an inquiry from the website contact form:\n\n*Name:* ${name}\n*Email:* ${email}\n*Service:* ${service}\n*Message:* ${message}`;
      
      // URL encode the message content
      const encodedText = encodeURIComponent(whatsappText);
      const whatsappUrl = `https://wa.me/917592888111?text=${encodedText}`;
      
      // Open WhatsApp click-to-chat in a new tab
      window.open(whatsappUrl, '_blank');
      
      // Reveal inline success state
      contactEnquiryForm.classList.add('hidden');
      sectionFormSuccess.classList.remove('hidden');
    });
  }

  /* ==========================================================================
     Mobile Dropdown Toggle
     ========================================================================== */
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        const parent = toggle.closest('.dropdown');
        if (parent) {
          parent.classList.toggle('active');
        }
      }
    });
  });

  /* ==========================================================================
     Hero Spotlight Hover Effect
     ========================================================================== */
  const heroBanner = document.querySelector('.hero-banner');
  const heroSpotlight = document.getElementById('hero-spotlight');

  if (heroBanner && heroSpotlight) {
    heroBanner.addEventListener('mousemove', (e) => {
      const rect = heroBanner.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      heroSpotlight.style.left = `${x}px`;
      heroSpotlight.style.top = `${y}px`;
    });

    heroBanner.addEventListener('mouseenter', () => {
      heroSpotlight.style.opacity = '1';
    });

    heroBanner.addEventListener('mouseleave', () => {
      heroSpotlight.style.opacity = '0';
    });
  }

  // Hide spline loading spinner when loaded and remove watermark logo
  const splineViewer = document.querySelector('spline-viewer');
  const splineLoader = document.querySelector('.spline-loader-wrapper');
  
  const removeSplineLogo = () => {
    let attempts = 0;
    const logoInterval = setInterval(() => {
      if (splineViewer && splineViewer.shadowRoot) {
        const logo = splineViewer.shadowRoot.querySelector('#logo') || 
                     splineViewer.shadowRoot.querySelector('a[href*="spline"]') ||
                     splineViewer.shadowRoot.querySelector('.logo');
        if (logo) {
          logo.style.display = 'none';
          logo.style.visibility = 'hidden';
          logo.style.opacity = '0';
          logo.style.pointerEvents = 'none';
        }
        
        // Inject style into shadowRoot to hide watermark logo permanently
        if (!splineViewer.shadowRoot.querySelector('#hide-spline-logo-style')) {
          const style = document.createElement('style');
          style.id = 'hide-spline-logo-style';
          style.textContent = '#logo, a[href*="spline"], .logo { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }';
          splineViewer.shadowRoot.appendChild(style);
        }
        
        clearInterval(logoInterval);
      }
      attempts++;
      if (attempts > 50) { // stop polling after 5 seconds
        clearInterval(logoInterval);
      }
    }, 100);
  };


  if (splineViewer && splineLoader) {
    let isLoaderHidden = false;

    const hideSplineLoader = () => {
      if (isLoaderHidden) return;
      isLoaderHidden = true;

      splineLoader.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      splineLoader.style.opacity = '0';
      setTimeout(() => {
        splineLoader.style.display = 'none';
      }, 600);

      removeSplineLogo();
    };

    const isSplineReady = () => {
      return splineViewer.hasAttribute('loaded') ||
             splineViewer.loaded === true ||
             (splineViewer.shadowRoot && splineViewer.shadowRoot.querySelector('canvas'));
    };

    if (isSplineReady()) {
      hideSplineLoader();
    } else {
      splineViewer.addEventListener('load-complete', hideSplineLoader);
      
      const pollSpline = setInterval(() => {
        if (isSplineReady()) {
          hideSplineLoader();
          clearInterval(pollSpline);
        }
      }, 100);
    }

    // Safety fallback: hide loader after 5s in case event is missed
    setTimeout(hideSplineLoader, 5000);
    removeSplineLogo();
  }


  /* ==========================================================================
     About Section React Layout Animation
     ========================================================================== */
  const aboutTrigger = document.getElementById('about-react-trigger');
  const revealText = document.querySelector('.vertical-cut-reveal');

  if (revealText) {
    const textContent = revealText.textContent.trim();
    const words = textContent.split(/\s+/);
    revealText.innerHTML = words.map((word, index) => `
      <span class="reveal-word-wrapper">
        <span class="reveal-word" style="transition-delay: calc(0.8s + ${index * 0.08}s)">${word}</span>
      </span>
    `).join(' ');
  }

  const runCounterAnimation = () => {
    const counters = document.querySelectorAll('.stat-count');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000; // 2 seconds duration
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function outQuad
        const easedProgress = progress * (2 - progress);
        const currentValue = Math.floor(easedProgress * target);
        
        counter.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  if (aboutTrigger) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          aboutTrigger.classList.add('animated');
          setTimeout(runCounterAnimation, 600); // Start counting as stats fade in
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });
    observer.observe(aboutTrigger);
  }

  /* ==========================================================================
     Black Smoke Cursor Particle Effect (Hero Section)
     ========================================================================== */
  const heroBannerSection = document.querySelector('.hero-banner');
  if (heroBannerSection) {
    let lastTime = 0;
    
    heroBannerSection.addEventListener('mousemove', (e) => {
      const now = performance.now();
      // Throttle particle creation (every 40ms) to ensure smooth performance
      if (now - lastTime < 40) return;
      lastTime = now;

      const rect = heroBannerSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      createSmoke(x, y);
    });

    const createSmoke = (x, y) => {
      const particle = document.createElement('div');
      particle.className = 'smoke-particle';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      // Set random size between 12px and 28px
      const size = Math.random() * 16 + 12;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      heroBannerSection.appendChild(particle);

      // Clean up after animation finishes (1s)
      setTimeout(() => {
        particle.remove();
      }, 1000);
    };
  }

  /* ==========================================================================
     Typographic Values Word-by-Word Scroll Reveal splitting
     ========================================================================== */
  const valuesPara = document.querySelector('.values-typography');
  if (valuesPara) {
    let wordIndex = 0;
    const newContent = [];
    
    valuesPara.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        // Split text node by spaces
        const words = node.textContent.split(/(\s+)/);
        words.forEach(word => {
          if (word.trim().length > 0) {
            const span = document.createElement('span');
            span.className = 'reveal-word-item';
            span.style.setProperty('--word-index', wordIndex++);
            span.innerText = word;
            newContent.push(span);
          } else if (word.length > 0) {
            // Normalize multi-line indentation/whitespace to a single clean space
            newContent.push(document.createTextNode(' '));
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Clone element (like the highlight box span)
        const words = node.textContent.split(/(\s+)/);
        const spanClone = node.cloneNode(false);
        spanClone.innerHTML = '';
        
        // Track the first index for the outline transition delay
        spanClone.style.setProperty('--highlight-delay', wordIndex);
        
        words.forEach(word => {
          if (word.trim().length > 0) {
            const span = document.createElement('span');
            span.className = 'reveal-word-item inline';
            span.style.setProperty('--word-index', wordIndex++);
            span.innerText = word;
            spanClone.appendChild(span);
          } else if (word.length > 0) {
            spanClone.appendChild(document.createTextNode(' '));
          }
        });
        newContent.push(spanClone);
      }
    });

    
    valuesPara.innerHTML = '';
    newContent.forEach(item => valuesPara.appendChild(item));

    // Scroll-bound reveal controller
    const track = document.getElementById('values-scroll-section');
    const bottomRow = document.querySelector('.values-bottom-row');
    const wordItems = valuesPara.querySelectorAll('.reveal-word-item');
    const totalWords = wordItems.length;

    if (track) {
      if (bottomRow) {
        bottomRow.style.opacity = '0';
        bottomRow.style.transform = 'translateY(10px)';
        bottomRow.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      }

      const updateScrollReveal = () => {
        // Disable scroll reveal animation on mobile and tablet (<= 1024px)
        if (window.innerWidth <= 1024) {
          wordItems.forEach((item) => {
            item.style.opacity = '1';
            const highlightBox = item.closest('.highlight-box');
            if (highlightBox) {
              item.style.color = '';
              highlightBox.style.borderColor = highlightBox.classList.contains('box-blue') ? '#3b82f6' :
                                                highlightBox.classList.contains('box-orange') ? '#f97316' : '#22c55e';
            } else {
              item.style.color = 'var(--text-main)';
            }
          });
          if (bottomRow) {
            bottomRow.style.opacity = '1';
            bottomRow.style.transform = 'none';
          }
          return;
        }

        const rect = track.getBoundingClientRect();
        const trackTop = rect.top + window.scrollY;
        const trackHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Alignment offsets
        const scrollStart = trackTop - 110;
        const scrollRange = trackHeight - windowHeight + 110;
        
        let progress = (window.scrollY - scrollStart) / scrollRange;
        progress = Math.max(0, Math.min(1, progress));

        const activeLimit = progress * totalWords;

        wordItems.forEach((item, idx) => {
          if (idx <= activeLimit) {
            item.style.opacity = '1';
            
            const highlightBox = item.closest('.highlight-box');
            if (highlightBox) {
              item.style.color = ''; // Inherit color from highlight class (blue/orange/green)
              highlightBox.style.borderColor = highlightBox.classList.contains('box-blue') ? '#3b82f6' :
                                                highlightBox.classList.contains('box-orange') ? '#f97316' : '#22c55e';
            } else {
              item.style.color = 'var(--text-main)';
            }
          } else {
            item.style.opacity = '0.15';
            
            const highlightBox = item.closest('.highlight-box');
            if (highlightBox) {
              item.style.color = ''; // Inherit color from highlight class (blue/orange/green)
              const firstWord = highlightBox.querySelector('.reveal-word-item');
              if (firstWord && Array.from(wordItems).indexOf(firstWord) > activeLimit) {
                highlightBox.style.borderColor = 'transparent';
              }
            } else {
              item.style.color = 'var(--text-muted)';
            }
          }
        });

        // Fade in signature bottom actions row near the end of scroll range
        if (bottomRow) {
          if (progress > 0.85) {
            bottomRow.style.opacity = '1';
            bottomRow.style.transform = 'translateY(0)';
          } else {
            bottomRow.style.opacity = '0';
            bottomRow.style.transform = 'translateY(10px)';
          }
        }
      };


      window.addEventListener('scroll', updateScrollReveal);
      window.addEventListener('resize', updateScrollReveal);
      updateScrollReveal();
    }
  }

  /* ==========================================================================
     HoverSlider Character Splitter & Controller
     ========================================================================== */
  const sliderLinks = document.querySelectorAll('.slider-title-link');
  const imageItems = document.querySelectorAll('.hover-slider-image-item');
  
  // Character splitter for text stagger hover
  const staggerTexts = document.querySelectorAll('.stagger-hover-text');
  staggerTexts.forEach(trigger => {
    const text = trigger.textContent;
    trigger.innerHTML = '';
    
    // Split by character (including spaces)
    Array.from(text).forEach((char, idx) => {
      const wrapper = document.createElement('span');
      wrapper.className = 'char-wrap';
      
      const initial = document.createElement('span');
      initial.className = 'char-initial';
      initial.style.setProperty('--char-delay', `${idx * 0.025}s`);
      initial.innerText = char === ' ' ? '\u00A0' : char;
      
      const hover = document.createElement('span');
      hover.className = 'char-hover';
      hover.style.setProperty('--char-delay', `${idx * 0.025}s`);
      hover.innerText = char === ' ' ? '\u00A0' : char;
      
      wrapper.appendChild(initial);
      wrapper.appendChild(hover);
      trigger.appendChild(wrapper);
    });
  });

  // Slider hover trigger
  sliderLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const targetIndex = link.getAttribute('data-slide-index');
      
      // Update active link states
      sliderLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Update active image states
      imageItems.forEach(img => {
        if (img.getAttribute('data-image-index') === targetIndex) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });
    });
  });

  /* ==========================================================================
     Pinned Scroll-Driven Service Showcase Controller
     ========================================================================== */
  const servicesTrack = document.getElementById('services-scroll-track');
  
  if (servicesTrack && sliderLinks.length > 0 && imageItems.length > 0) {
    let lastActiveIndex = -1;

    const setActiveSlide = (index) => {
      if (index === lastActiveIndex) return;
      lastActiveIndex = index;

      sliderLinks.forEach((l, i) => {
        if (i === index) {
          l.classList.add('active');
        } else {
          l.classList.remove('active');
        }
      });

      imageItems.forEach((img, i) => {
        if (i === index) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });
    };

    const updateServicesScroll = () => {
      const rect = servicesTrack.getBoundingClientRect();
      const trackHeight = servicesTrack.offsetHeight;
      const viewportHeight = window.innerHeight;
      const totalScrollable = trackHeight - viewportHeight;

      if (totalScrollable <= 0) return;

      // Calculate how far we are into the pinned track
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(0.999, scrolled / totalScrollable));

      // Divide 0 to 1 progress across the 4 services:
      // Step 1: AI Consulting (0.00 - 0.25)
      // Step 2: IT Consulting (0.25 - 0.50)
      // Step 3: Back Office    (0.50 - 0.75)
      // Step 4: IT Auditing   (0.75 - 1.00)
      const targetIndex = Math.min(3, Math.floor(progress * 4));
      setActiveSlide(targetIndex);
    };

    // Click/Tap support for mobile and touch devices
    sliderLinks.forEach((link, idx) => {
      link.addEventListener('click', (e) => {
        // Prevent default navigation if user taps to inspect service slide
        if (window.innerWidth <= 768) {
          setActiveSlide(idx);
        }
      });
    });

    window.addEventListener('scroll', updateServicesScroll, { passive: true });
    window.addEventListener('resize', updateServicesScroll, { passive: true });
    updateServicesScroll();
  }

});



