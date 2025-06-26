// Initialize all functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  initializeGallery()
  initializeContactForm()
  initializeScrollEffects()
  initializeAnimations()
  initializeCounters()
  initializeLazyLoading()
})

// Navigation functionality
function initializeNavigation() {
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.getElementById("nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")
  const footerLinks = document.querySelectorAll(".footer-link")
  const pages = document.querySelectorAll(".page")

  // Hamburger menu toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      const isClickInsideNav = navMenu.contains(event.target)
      const isClickOnHamburger = hamburger.contains(event.target)

      if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains("active")) {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      }
    })
  }

  // Page navigation
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

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })

    // Trigger animations for the new page
    setTimeout(() => {
      triggerAnimations()
      if (pageId === "home") {
        animateCounters()
      }
    }, 50)
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

  // Add click listeners to buttons with data-page attribute
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

// Gallery functionality - FIXED
function initializeGallery() {
  const gallerySlider = document.getElementById("gallerySlider")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const dotsContainer = document.getElementById("galleryDots")

  if (!gallerySlider) return

  const galleryItems = gallerySlider.querySelectorAll(".gallery-item")
  let currentSlide = 0
  let isTransitioning = false

  console.log(`Found ${galleryItems.length} gallery items`) // Debug log

  // Test all image sources
  galleryItems.forEach((item, index) => {
    const img = item.querySelector("img")
    if (img) {
      img.addEventListener("error", function () {
        console.error(`Failed to load image ${index + 1}:`, this.src)
        // Set a fallback image with different colors for each
        const colors = ["059669", "2563eb", "7c3aed"]
        this.src = `https://via.placeholder.com/800x400/${colors[index]}/ffffff?text=Gallery+Image+${index + 1}`
      })

      img.addEventListener("load", function () {
        console.log(`Successfully loaded image ${index + 1}:`, this.src)
      })
    }
  })

  // Create dots
  if (dotsContainer) {
    dotsContainer.innerHTML = "" // Clear existing dots
    galleryItems.forEach((_, index) => {
      const dot = document.createElement("div")
      dot.classList.add("dot")
      if (index === 0) dot.classList.add("active")
      dot.addEventListener("click", () => goToSlide(index))
      dotsContainer.appendChild(dot)
    })
  }

  function updateSlider() {
    if (isTransitioning || galleryItems.length === 0) return

    isTransitioning = true

    // Calculate the transform value - each slide is 33.333% width
    const translateX = -currentSlide * 33.333
    gallerySlider.style.transform = `translateX(${translateX}%)`

    console.log(`Moving to slide ${currentSlide}, translateX: ${translateX}%`) // Debug log

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
    if (slideIndex >= 0 && slideIndex < galleryItems.length && slideIndex !== currentSlide) {
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

  // Button event listeners
  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault()
      nextSlide()
    })
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault()
      prevSlide()
    })
  }

  // Auto-play functionality
  let autoPlayInterval = setInterval(nextSlide, 4000)

  gallerySlider.addEventListener("mouseenter", () => {
    clearInterval(autoPlayInterval)
  })

  gallerySlider.addEventListener("mouseleave", () => {
    autoPlayInterval = setInterval(nextSlide, 4000)
  })

  // Touch/swipe functionality
  let startX = 0
  let endX = 0

  gallerySlider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX
    clearInterval(autoPlayInterval)
  })

  gallerySlider.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX
    handleSwipe()
    autoPlayInterval = setInterval(nextSlide, 4000)
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
    if (document.getElementById("gallery")?.classList.contains("active")) {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        prevSlide()
      }
      if (e.key === "ArrowRight") {
        e.preventDefault()
        nextSlide()
      }
    }
  })

  // Initialize first slide
  updateSlider()
}

// Contact form functionality
function initializeContactForm() {
  const contactForm = document.getElementById("contactForm")

  if (!contactForm) return

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData(contactForm)
    const data = Object.fromEntries(formData)

    if (!validateForm(data)) {
      return
    }

    submitForm(data)
  })

  function validateForm(data) {
    const requiredFields = ["firstName", "lastName", "email", "subject", "message"]
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === "") {
        showNotification(`Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()} field.`, "error")
        return false
      }
    }

    if (!emailRegex.test(data.email)) {
      showNotification("Please enter a valid email address.", "error")
      return false
    }

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
    const originalText = submitButton?.textContent

    if (submitButton) {
      submitButton.textContent = "Sending..."
      submitButton.disabled = true
      submitButton.classList.add("loading")
    }

    // Simulate form submission
    setTimeout(() => {
      showNotification("Thank you for your message! We will get back to you soon.", "success")
      contactForm.reset()

      if (submitButton && originalText) {
        submitButton.textContent = originalText
        submitButton.disabled = false
        submitButton.classList.remove("loading")
      }
    }, 2000)
  }
}

// Scroll effects
function initializeScrollEffects() {
  const scrollToTopBtn = document.getElementById("scrollToTop")

  // Show/hide scroll to top button
  window.addEventListener("scroll", () => {
    if (scrollToTopBtn) {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = "block"
      } else {
        scrollToTopBtn.style.display = "none"
      }
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

  // Parallax effect for hero banner
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const heroSection = document.querySelector(".hero-banner")

    if (heroSection) {
      const rate = scrolled * -0.5
      heroSection.style.transform = `translateY(${rate}px)`
    }
  })
}

// Animation functionality
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
    element.style.transitionDelay = `${index * 0.05}s`
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
    }, index * 50)
  })
}

// Counter animation functionality
function initializeCounters() {
  const counters = document.querySelectorAll(".stat-number")

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target
          const target = Number.parseInt(element.getAttribute("data-target") || "0")

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
    const target = Number.parseInt(counter.getAttribute("data-target") || "0")
    if (target && !counter.dataset.animated) {
      counter.dataset.animated = "true"
      animateCounter(counter, target)
    }
  })
}

function animateCounter(element, target, duration = 1000) {
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

// Lazy loading functionality
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

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

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

  const colors = {
    success: "#059669",
    error: "#dc2626",
    warning: "#d97706",
    info: "#2563eb",
  }
  notification.style.backgroundColor = colors[type] || colors.info

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 4000)
}

// Utility functions
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

// Performance optimization
const debouncedScrollHandler = debounce(() => {
  // Handle scroll events here if needed
}, 16)

window.addEventListener("scroll", debouncedScrollHandler)

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error)
})

// Accessibility improvements
document.addEventListener("keydown", (e) => {
  // Handle keyboard navigation
  if (e.key === "Tab") {
    document.body.classList.add("keyboard-navigation")
  }
})

document.addEventListener("mousedown", () => {
  document.body.classList.remove("keyboard-navigation")
})
