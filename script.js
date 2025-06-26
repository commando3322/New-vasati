// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

// Initialize Application
function initializeApp() {
  initializeNavigation()
  initializeGallery()
  initializeContactForm()
  initializeScrollEffects()
  initializeAnimations()
  initializeCounters()
  initializeLazyLoading()
}

// Navigation System
function initializeNavigation() {
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.getElementById("nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")
  const footerLinks = document.querySelectorAll(".footer-link")
  const pages = document.querySelectorAll(".page")

  // Mobile menu toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })

    // Close mobile menu when clicking outside
    document.addEventListener("click", (event) => {
      const isClickInsideNav = navMenu.contains(event.target)
      const isClickOnHamburger = hamburger.contains(event.target)

      if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains("active")) {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      }
    })
  }

  // Page navigation function
  function showPage(pageId) {
    // Hide all pages
    pages.forEach((page) => {
      page.classList.remove("active")
    })

    // Show target page
    const targetPage = document.getElementById(pageId)
    if (targetPage) {
      targetPage.classList.add("active")
    }

    // Update active nav link
    navLinks.forEach((link) => {
      link.classList.remove("active")
    })

    const activeLink = document.querySelector(`[data-page="${pageId}"]`)
    if (activeLink) {
      activeLink.classList.add("active")
    }

    // Close mobile menu
    if (hamburger && navMenu) {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    }

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })

    // Trigger animations for the new page
    setTimeout(() => {
      triggerAnimations()
      if (pageId === "home") {
        animateCounters()
      }
    }, 100)
  }
  // Add click listeners to navigation links
  ;[...navLinks, ...footerLinks].forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const pageId = this.getAttribute("data-page")
      if (pageId) {
        showPage(pageId)
      }
    })
  })

  // Add click listeners to CTA buttons
  document.querySelectorAll("[data-page]").forEach((button) => {
    if (!button.classList.contains("nav-link") && !button.classList.contains("footer-link")) {
      button.addEventListener("click", function (e) {
        e.preventDefault()
        const pageId = this.getAttribute("data-page")
        if (pageId) {
          showPage(pageId)
        }
      })
    }
  })
}

// Gallery Functionality
function initializeGallery() {
  const gallerySlider = document.getElementById("gallerySlider")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const dotsContainer = document.getElementById("galleryDots")

  if (!gallerySlider) return

  const galleryItems = gallerySlider.querySelectorAll(".gallery-item")
  let currentSlide = 0
  let isTransitioning = false

  // Create dots
  if (dotsContainer) {
    galleryItems.forEach((_, index) => {
      const dot = document.createElement("div")
      dot.classList.add("dot")
      if (index === 0) dot.classList.add("active")
      dot.addEventListener("click", () => goToSlide(index))
      dotsContainer.appendChild(dot)
    })
  }

  function updateSlider() {
    if (isTransitioning) return

    isTransitioning = true
    const translateX = -currentSlide * 100
    gallerySlider.style.transform = `translateX(${translateX}%)`

    // Update dots
    const dots = dotsContainer?.querySelectorAll(".dot")
    if (dots) {
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentSlide)
      })
    }

    setTimeout(() => {
      isTransitioning = false
    }, 500)
  }

  function goToSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < galleryItems.length) {
      currentSlide = slideIndex
      updateSlider()
    }
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % galleryItems.length
    updateSlider()
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + galleryItems.length) % galleryItems.length
    updateSlider()
  }

  // Event listeners
  if (nextBtn) nextBtn.addEventListener("click", nextSlide)
  if (prevBtn) prevBtn.addEventListener("click", prevSlide)

  // Auto-play functionality
  let autoPlayInterval = setInterval(nextSlide, 5000)

  // Pause auto-play on hover
  gallerySlider.addEventListener("mouseenter", () => {
    clearInterval(autoPlayInterval)
  })

  gallerySlider.addEventListener("mouseleave", () => {
    autoPlayInterval = setInterval(nextSlide, 5000)
  })

  // Touch/swipe support
  let startX = 0
  let endX = 0

  gallerySlider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX
  })

  gallerySlider.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX
    handleSwipe()
  })

  function handleSwipe() {
    const swipeThreshold = 50
    const diff = startX - endX

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (document.getElementById("gallery").classList.contains("active")) {
      if (e.key === "ArrowLeft") prevSlide()
      if (e.key === "ArrowRight") nextSlide()
    }
  })
}

// Contact Form
function initializeContactForm() {
  const contactForm = document.getElementById("contactForm")

  if (!contactForm) return

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData(contactForm)
    const data = Object.fromEntries(formData)

    // Validation
    if (!validateForm(data)) {
      return
    }

    // Submit form
    submitForm(data)
  })

  function validateForm(data) {
    const requiredFields = ["firstName", "lastName", "email", "subject", "message"]
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Check required fields
    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === "") {
        showNotification(`Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()} field.`, "error")
        return false
      }
    }

    // Validate email
    if (!emailRegex.test(data.email)) {
      showNotification("Please enter a valid email address.", "error")
      return false
    }

    // Validate phone if provided
    if (data.phone && data.phone.trim() !== "") {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(data.phone.replace(/\s/g, ""))) {
        showNotification("Please enter a valid phone number.", "error")
        return false
      }
    }

    return true
  }

  function submitForm(data) {
    const submitButton = contactForm.querySelector('button[type="submit"]')
    const originalText = submitButton.textContent

    // Show loading state
    submitButton.textContent = "Sending..."
    submitButton.disabled = true
    submitButton.classList.add("loading")

    // Simulate form submission
    setTimeout(() => {
      showNotification("Thank you for your message! We will get back to you soon.", "success")
      contactForm.reset()

      // Reset button
      submitButton.textContent = originalText
      submitButton.disabled = false
      submitButton.classList.remove("loading")
    }, 2000)
  }
}

// Scroll Effects
function initializeScrollEffects() {
  const scrollToTopBtn = document.getElementById("scrollToTop")

  // Show/hide scroll to top button
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.style.display = "block"
    } else {
      scrollToTopBtn.style.display = "none"
    }
  })

  // Scroll to top functionality
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Parallax effect for hero section
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const heroSection = document.querySelector(".hero-banner")

    if (heroSection) {
      const rate = scrolled * -0.5
      heroSection.style.transform = `translateY(${rate}px)`
    }
  })
}

// Animation System
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(".card, .stat-card, .team-card, .partner-card, .gallery-item")

  animatedElements.forEach((element, index) => {
    element.classList.add("fade-in")
    element.style.transitionDelay = `${index * 0.1}s`
    observer.observe(element)
  })
}

function triggerAnimations() {
  const currentPage = document.querySelector(".page.active")
  if (!currentPage) return

  const elements = currentPage.querySelectorAll(".fade-in:not(.visible)")
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add("visible")
    }, index * 100)
  })
}

// Counter Animation
function initializeCounters() {
  const counters = document.querySelectorAll(".stat-number")

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target
          const target = Number.parseInt(element.getAttribute("data-target"))

          if (target && !element.dataset.animated) {
            element.dataset.animated = "true"
            animateCounter(element, target)
          }
        }
      })
    },
    { threshold: 0.5 },
  )

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })
}

function animateCounters() {
  const counters = document.querySelectorAll(".stat-number")
  counters.forEach((counter) => {
    const target = Number.parseInt(counter.getAttribute("data-target"))
    if (target && !counter.dataset.animated) {
      counter.dataset.animated = "true"
      animateCounter(counter, target)
    }
  })
}

function animateCounter(element, target, duration = 2000) {
  let start = 0
  const increment = target / (duration / 16)

  const timer = setInterval(() => {
    start += increment
    if (start >= target) {
      element.textContent = formatNumber(target)
      clearInterval(timer)
    } else {
      element.textContent = formatNumber(Math.floor(start))
    }
  }, 16)
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Lazy Loading
function initializeLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]')

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.classList.remove("loading")
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach((img) => {
      img.classList.add("loading")
      imageObserver.observe(img)
    })
  }
}

// Utility Functions
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  // Style the notification
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "1rem 1.5rem",
    borderRadius: "8px",
    color: "white",
    fontWeight: "500",
    zIndex: "10000",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease",
    maxWidth: "400px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  })

  // Set background color based on type
  const colors = {
    success: "#059669",
    error: "#dc2626",
    warning: "#d97706",
    info: "#2563eb",
  }
  notification.style.backgroundColor = colors[type] || colors.info

  // Add to DOM
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remove after delay
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 4000)
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Performance optimizations
const debouncedResize = debounce(() => {
  // Handle resize events
  triggerAnimations()
}, 250)

const throttledScroll = throttle(() => {
  // Handle scroll events efficiently
}, 16)

window.addEventListener("resize", debouncedResize)
window.addEventListener("scroll", throttledScroll)

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error)
  showNotification("An error occurred. Please refresh the page.", "error")
})

// Service Worker registration (for future PWA capabilities)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Service worker can be registered here for offline capabilities
  })
}

// Export functions for testing (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    formatNumber,
    animateCounter,
    showNotification,
    debounce,
    throttle,
  }
}
