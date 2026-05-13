/**
 * Old Money Portfolio - Main JavaScript
 * Real-time Clock, Smooth Animations, Flexible Layout
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    const navbar = document.getElementById('navbar');
    
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    
    // ========================================
    // MOBILE MENU TOGGLE
    // ========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // ========================================
    // REAL-TIME CLOCK WITH TIMEZONE
    // ========================================
    let currentTimezone = 'WIB'; // Default timezone
    
    const timeZoneMap = {
        'WIB': 'Asia/Jakarta',
        'WITA': 'Asia/Makassar',
        'WIT': 'Asia/Jayapura'
    };
    
    function updateClock() {
        const now = new Date();
        const timeZone = timeZoneMap[currentTimezone] || 'Asia/Jakarta';
        
        const clockTime = document.getElementById('clockTime');
        const clockSeconds = document.getElementById('clockSeconds');
        const clockDate = document.getElementById('clockDate');
        
        if (clockTime || clockSeconds) {
            const timeFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timeZone,
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            const parts = timeFormatter.formatToParts(now);
            let hours = '00', minutes = '00', seconds = '00';
            
            for (const part of parts) {
                if (part.type === 'hour') hours = part.value;
                if (part.type === 'minute') minutes = part.value;
                if (part.type === 'second') seconds = part.value;
            }
            
            if (hours === '24') hours = '00';
            
            if (clockTime) clockTime.textContent = `${hours}:${minutes}`;
            if (clockSeconds) clockSeconds.textContent = `:${seconds}`;
        }
        
        if (clockDate) {
            const dateFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timeZone,
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            clockDate.textContent = dateFormatter.format(now);
        }
    }
    
    // Update clock every second
    setInterval(updateClock, 1000);
    updateClock(); // Initial call
    
    // Timezone selector
    const timezoneBtns = document.querySelectorAll('.timezone-btn');
    timezoneBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            timezoneBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTimezone = this.dataset.timezone;
            updateClock();
        });
    });
    
    // ========================================
    // SCROLL REVEAL ANIMATION - FAST & SMOOTH
    // ========================================
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    
    // Use Intersection Observer for better performance
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add stagger delay based on element index
                const index = Array.from(scrollRevealElements).indexOf(entry.target);
                const delay = Math.min(index * 35, 180); // Max 180ms delay
                
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                    entry.target.classList.remove('scroll-up');
                    
                    // Animate skill bars if inside this element
                    animateSkillBars(entry.target);
                    
                    // Animate language circles if inside this element
                    animateLanguageCircles(entry.target);
                }, delay);
            } else {
                entry.target.classList.remove('revealed');
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    });
    
    // Observe all scroll-reveal elements
    scrollRevealElements.forEach(el => {
        revealObserver.observe(el);
    });
    
    // ========================================
    // SKILL BARS ANIMATION
    // ========================================
    function animateSkillBars(container) {
        const skillBars = container.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            if (width && !bar.classList.contains('animated')) {
                bar.classList.add('animated');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 100 + (index * 80));
            }
        });
    }
    
    // ========================================
    // LANGUAGE CIRCLES ANIMATION
    // ========================================
    function animateLanguageCircles(container) {
        const circles = container.querySelectorAll('.language-circle');
        
        circles.forEach((circle, index) => {
            if (!circle.classList.contains('animated')) {
                circle.classList.add('animated');
                const percent = circle.getAttribute('data-percent');
                const progressCircle = circle.querySelector('.circle-progress');
                
                if (progressCircle && percent) {
                    const circumference = 2 * Math.PI * 45; // r = 45
                    const offset = circumference - (percent / 100) * circumference;
                    
                    setTimeout(() => {
                        progressCircle.style.strokeDashoffset = offset;
                    }, 150 + (index * 100));
                }
            }
        });
    }
    
    // ========================================
    // CALENDAR FUNCTIONALITY
    // ========================================
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthEl = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Event dates - EASY TO EDIT: Add your event dates here
    // Format: { day: number, month: number (0-11), event: string }
    const events = [
        { day: 15, month: 3, event: 'Research Presentation' },
        { day: 18, month: 3, event: 'MUN Meeting' },
        { day: 22, month: 3, event: 'Diplomatic Seminar' },
        { day: 25, month: 3, event: 'Career Counseling' }
    ];
    
    function generateCalendar(month, year) {
        if (!calendarDays) return;
        
        calendarDays.innerHTML = '';
        
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        currentMonthEl.textContent = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day other-month';
            dayDiv.textContent = daysInPrevMonth - i;
            calendarDays.appendChild(dayDiv);
        }
        
        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            dayDiv.textContent = day;
            
            // Check if today
            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayDiv.classList.add('today');
            }
            
            // Check if has event
            const hasEvent = events.some(e => e.day === day && e.month === month);
            if (hasEvent) {
                dayDiv.classList.add('has-event');
            }
            
            calendarDays.appendChild(dayDiv);
        }
        
        // Next month days
        const remainingCells = 42 - (firstDay + daysInMonth);
        for (let day = 1; day <= remainingCells; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day other-month';
            dayDiv.textContent = day;
            calendarDays.appendChild(dayDiv);
        }
    }
    
    // Initialize calendar
    generateCalendar(currentMonth, currentYear);
    
    // Calendar navigation
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateCalendar(currentMonth, currentYear);
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            generateCalendar(currentMonth, currentYear);
        });
    }
    
    // ========================================
    // CONTACT FORM HANDLING - SEND EMAIL
    // ========================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // EDIT THIS: Your email address
            const yourEmail = 'prajaalim2605@email.com';
            
            // Create email body
            const emailBody = `Hello Praja,%0D%0A%0D%0A` +
                `You have received a new message from your portfolio website:%0D%0A%0D%0A` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%0D%0A` +
                `FROM: ${name}%0D%0A` +
                `EMAIL: ${email}%0D%0A` +
                `SUBJECT: ${subject}%0D%0A` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%0D%0A%0D%0A` +
                `MESSAGE:%0D%0A` +
                `${message}%0D%0A%0D%0A` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━%0D%0A%0D%0A` +
                `Best regards,%0D%0A` +
                `${name}`;
            
            // Create mailto link
            const mailtoLink = `mailto:${yourEmail}?subject=${encodeURIComponent('Portfolio Contact: ' + subject)}&body=${emailBody}`;
            
            // Open default email client
            window.location.href = mailtoLink;
            
            // Show notification
            showNotification('Opening your email client... Please send the email to complete.', 'success');
            
            // Reset form
            setTimeout(() => {
                contactForm.reset();
            }, 1000);
        });
    }
    
    // ========================================
    // NOTIFICATION SYSTEM
    // ========================================
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 25px;
            background: #111821;
            color: #C9A962;
            padding: 18px 25px;
            border: 1px solid rgba(201, 169, 98, 0.35);
            z-index: 9999;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.85rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            transform: translateX(150%);
            transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
            max-width: 350px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => {
                notification.remove();
            }, 350);
        }, 4000);
    }
    
    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========================================
    // LOADING ANIMATION
    // ========================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Trigger hero animations
        setTimeout(() => {
            document.querySelectorAll('.hero .scroll-reveal').forEach((el, i) => {
                setTimeout(() => {
                    el.classList.add('revealed');
                }, i * 80);
            });
        }, 200);
    });
    
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= -offset &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ========================================
// FLEXIBLE LAYOUT HELPERS
// ========================================

/**
 * Add new experience item dynamically
 * Usage: addExperience('2025', 'Title', 'Company', 'Description')
 */
function addExperience(year, title, company, description) {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    
    const item = document.createElement('div');
    item.className = 'timeline-item scroll-reveal';
    item.innerHTML = `
        <div class="timeline-marker"></div>
        <div class="timeline-content">
            <span class="timeline-date">${year}</span>
            <h3 class="timeline-title">${title}</h3>
            <p class="timeline-company">${company}</p>
            <p class="timeline-description">${description}</p>
        </div>
    `;
    
    timeline.appendChild(item);
    
    // Re-observe new element
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(item);
}

/**
 * Add new certificate dynamically
 * Usage: addCertificate('2025', 'Title', 'Issuer', 'Description', 'pdf-filename.pdf')
 */
function addCertificate(year, title, issuer, description, pdfFile) {
    const grid = document.querySelector('.certificates-grid');
    if (!grid) return;
    
    const card = document.createElement('a');
    card.href = `certificates/${pdfFile}`;
    card.target = '_blank';
    card.className = 'certificate-card scroll-reveal';
    card.innerHTML = `
        <div class="certificate-icon">
            <i class="fas fa-certificate"></i>
        </div>
        <div class="certificate-content">
            <span class="certificate-year">${year}</span>
            <h3 class="certificate-title">${title}</h3>
            <p class="certificate-issuer">${issuer}</p>
            <p class="certificate-desc">${description}</p>
            <span class="certificate-view">View Certificate <i class="fas fa-external-link-alt"></i></span>
        </div>
    `;
    
    grid.appendChild(card);
}

/**
 * Add new skill dynamically
 * Usage: addSkill('Skill Name', 85)
 */
function addSkill(name, percent) {
    const list = document.querySelector('.skills-list');
    if (!list) return;
    
    const item = document.createElement('div');
    item.className = 'skill-item';
    item.innerHTML = `
        <div class="skill-info">
            <span class="skill-name">${name}</span>
            <span class="skill-percent">${percent}%</span>
        </div>
        <div class="skill-bar">
            <div class="skill-progress" data-width="${percent}"></div>
        </div>
    `;
    
    list.appendChild(item);
    
    // Animate the new skill bar
    setTimeout(() => {
        const bar = item.querySelector('.skill-progress');
        bar.style.width = percent + '%';
    }, 100);
}

/**
 * Add new event dynamically
 * Usage: addEvent(15, 3, 'Event Name', '10:00 AM', 'Location')
 */
function addEvent(day, month, name, time, location) {
    const eventsList = document.querySelector('.events-list');
    if (!eventsList) return;
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const item = document.createElement('div');
    item.className = 'event-item';
    item.innerHTML = `
        <div class="event-date">
            <span class="event-day">${day}</span>
            <span class="event-month">${monthNames[month]}</span>
        </div>
        <div class="event-details">
            <h4 class="event-name">${name}</h4>
            <p class="event-time"><i class="fas fa-clock"></i> ${time}</p>
            <p class="event-location"><i class="fas fa-map-marker-alt"></i> ${location}</p>
        </div>
    `;
    
    eventsList.appendChild(item);
}
