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
        const skillPercents = container.querySelectorAll('.skill-percent');
        
        skillBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            if (width && !bar.classList.contains('animated')) {
                bar.classList.add('animated');
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 100 + (index * 80));
            }
        });
        
        skillPercents.forEach((percentEl, index) => {
            if (!percentEl.classList.contains('animated')) {
                percentEl.classList.add('animated');
                const target = parseInt(percentEl.textContent);
                if (!isNaN(target)) {
                    percentEl.textContent = '0%';
                    let current = 0;
                    const duration = 800; // 0.8s animation matches CSS width transition
                    const stepTime = Math.max(10, Math.floor(duration / target));
                    
                    setTimeout(() => {
                        const timer = setInterval(() => {
                            current += 1;
                            percentEl.textContent = current + '%';
                            if (current >= target) {
                                clearInterval(timer);
                                percentEl.textContent = target + '%';
                            }
                        }, stepTime);
                    }, 100 + (index * 80));
                }
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
        
        // ========================================
        // CUSTOM CURSOR & MAGIC TRAIL EFFECT
        // ========================================
        const cursorDot = document.querySelector('.cursor-dot');
        const magicTrail = document.getElementById('magicTrail');
        const ctx = magicTrail ? magicTrail.getContext('2d') : null;
        
        let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        
        // Physics points for smooth ribbon
        const numPoints = 35;
        let points = [];
        for (let i = 0; i < numPoints; i++) {
            points.push({ x: pointer.x, y: pointer.y, vx: 0, vy: 0 });
        }
        
        let particles = [];
        let isHovering = false;
        let smoothedSpeed = 0;

        if (magicTrail && ctx) {
            const resizeCanvas = () => {
                magicTrail.width = window.innerWidth;
                magicTrail.height = window.innerHeight;
            };
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            function animateTrail() {
                ctx.clearRect(0, 0, magicTrail.width, magicTrail.height);
                
                // Track mouse speed for particle generation and wave intensity
                const dx = pointer.x - points[0].x;
                const dy = pointer.y - points[0].y;
                const speed = Math.sqrt(dx*dx + dy*dy);
                
                // Speed smoothing
                smoothedSpeed = smoothedSpeed * 0.8 + speed * 0.2;
                
                // Opacity fades out completely when stationary to keep the screen perfectly clean
                const fadeOpacity = Math.min(smoothedSpeed / 2, 1);
                
                // Update head
                points[0].x = pointer.x;
                points[0].y = pointer.y;
                
                // Magic wave time
                const time = performance.now() * 0.002;

                // Physics update for the trail
                for (let i = 1; i < numPoints; i++) {
                    const p = points[i];
                    const prev = points[i - 1];
                    
                    // Very strong spring to snap the tail quickly
                    p.vx += (prev.x - p.x) * 0.55;
                    p.vy += (prev.y - p.y) * 0.55;
                    
                    // High friction to stop wobbling instantly
                    p.vx *= 0.4;
                    p.vy *= 0.4;
                    
                    // Wavy magic force - only applied when moving!
                    if (fadeOpacity > 0.05) {
                        const waveAmplitude = (isHovering ? 2 : 1) * fadeOpacity;
                        p.vx += Math.sin(time + i * 0.1) * waveAmplitude;
                        p.vy += Math.cos(time + i * 0.1) * waveAmplitude;
                    }
                    
                    p.x += p.vx;
                    p.y += p.vy;
                }

                // Spawn particles
                if (speed > 1 && Math.random() > 0.4) {
                    particles.push({
                        x: pointer.x + (Math.random() - 0.5) * 5,
                        y: pointer.y + (Math.random() - 0.5) * 5,
                        vx: (Math.random() - 0.5) * 1.0,
                        vy: (Math.random() - 0.5) * 1.0 - 0.5,
                        life: 1,
                        size: Math.random() * 2 + 0.5
                    });
                }
                
                // Render the glowing ribbon ONLY if it's moving or just stopped
                if (fadeOpacity > 0.01) {
                    ctx.lineJoin = 'round';
                    ctx.lineCap = 'round';
                    ctx.shadowBlur = isHovering ? 20 : 12;
                    ctx.shadowColor = isHovering ? '#fff' : '#C9A962';

                    // First segment
                    ctx.beginPath();
                    ctx.moveTo(points[0].x, points[0].y);
                    const midX0 = (points[0].x + points[1].x) / 2;
                    const midY0 = (points[0].y + points[1].y) / 2;
                    ctx.lineTo(midX0, midY0);
                    ctx.lineWidth = isHovering ? 6 : 4;
                    ctx.strokeStyle = isHovering ? `rgba(255, 255, 255, ${fadeOpacity})` : `rgba(201, 169, 98, ${fadeOpacity * 0.8})`;
                    ctx.stroke();

                    // Spline segments
                    for (let i = 1; i < numPoints - 1; i++) {
                        ctx.beginPath();
                        const prevMidX = (points[i-1].x + points[i].x) / 2;
                        const prevMidY = (points[i-1].y + points[i].y) / 2;
                        const midX = (points[i].x + points[i+1].x) / 2;
                        const midY = (points[i].y + points[i+1].y) / 2;
                        
                        ctx.moveTo(prevMidX, prevMidY);
                        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
                        
                        const progress = 1 - (i / numPoints);
                        const alpha = progress * fadeOpacity;
                        
                        ctx.lineWidth = progress * (isHovering ? 6 : 4);
                        ctx.strokeStyle = isHovering 
                            ? `rgba(255, 255, 255, ${alpha})` 
                            : `rgba(201, 169, 98, ${alpha * 0.8})`;
                        ctx.stroke();
                    }
                }
                
                // Update and render particles
                for (let i = particles.length - 1; i >= 0; i--) {
                    const p = particles[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    p.life -= 0.04; // fade fast
                    
                    if (p.life <= 0) {
                        particles.splice(i, 1);
                        continue;
                    }
                    
                    // Particles also fade out with the main opacity so they don't linger
                    const particleAlpha = Math.max(0, Math.min(p.life, fadeOpacity));
                    if (particleAlpha > 0.01) {
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(255, 255, 255, ${particleAlpha})`;
                        ctx.shadowBlur = 8;
                        ctx.shadowColor = isHovering ? '#fff' : '#C9A962';
                        ctx.fill();
                    }
                }
                
                requestAnimationFrame(animateTrail);
            }
            animateTrail();
        }

        if (cursorDot && window.matchMedia("(pointer: fine)").matches) {
            window.addEventListener('mousemove', (e) => {
                pointer.x = e.clientX;
                pointer.y = e.clientY;
                
                cursorDot.style.left = `${pointer.x}px`;
                cursorDot.style.top = `${pointer.y}px`;
            });

            const interactables = document.querySelectorAll('a, button, input, textarea, .nav-toggle, .calendar-day, .timezone-btn, .certificate-card');
            interactables.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorDot.classList.add('hover');
                    isHovering = true;
                });
                el.addEventListener('mouseleave', () => {
                    cursorDot.classList.remove('hover');
                    isHovering = false;
                });
            });
        }

        // Magnetic elements
        const magneticElements = document.querySelectorAll('.btn, .social-link, .nav-logo');
        if (window.matchMedia("(pointer: fine)").matches) {
            magneticElements.forEach(el => {
                el.classList.add('magnetic');
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
                });
                el.addEventListener('mouseleave', () => {
                    el.style.transform = `translate(0px, 0px)`;
                    setTimeout(() => {
                        el.style.transform = '';
                    }, 300);
                });
            });
        }

        // ========================================
        // TEXT SPLIT ANIMATION
        // ========================================
        const splitTexts = document.querySelectorAll('[data-split="char"]');
        splitTexts.forEach(text => {
            const content = text.textContent;
            text.textContent = '';
            for (let i = 0; i < content.length; i++) {
                const char = document.createElement('span');
                char.className = 'char';
                char.style.transitionDelay = `${i * 0.05}s`;
                char.innerHTML = content[i] === ' ' ? '&nbsp;' : content[i];
                text.appendChild(char);
            }
        });

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
