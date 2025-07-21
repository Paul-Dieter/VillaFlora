// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once visible
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Mobile menu toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenu.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            mobileMenu.textContent = '☰';
        }
    });
});

// Gallery lightbox
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
document.body.appendChild(lightbox);

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        lightbox.innerHTML = `
            <img src="${img.src}" alt="${img.alt}">
            <span class="lightbox-close">✕</span>
        `;
        lightbox.style.display = 'flex';
    });
});

lightbox.addEventListener('click', e => {
    if (e.target.classList.contains('lightbox') || e.target.classList.contains('lightbox-close')) {
        lightbox.style.display = 'none';
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`; // Reduced intensity for better performance
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Feature cards hover effect
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Booking button pulse effect
const ctaButtons = document.querySelectorAll('.cta-button, .platform-button');
ctaButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.animation = 'pulse 0.6s ease-in-out';
    });
    button.addEventListener('mouseleave', () => {
        button.style.animation = 'none';
    });
});

// Add pulse animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Calendar functionality
let currentDate = new Date();
let selectedCheckIn = null;
let selectedCheckOut = null;
let selectingCheckOut = false;

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function generateCalendar() {
    const monthYear = document.getElementById('monthYear');
    const calendarGrid = document.getElementById('calendarGrid');
    
    monthYear.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    calendarGrid.innerHTML = '';
    
    // Add day headers
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const today = new Date();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        
        // Disable past dates
        if (dayDate < today.setHours(0,0,0,0)) {
            dayElement.classList.add('disabled');
        } else {
            dayElement.addEventListener('click', () => selectDate(dayDate));
            
            // Highlight selected dates
            if (selectedCheckIn && dayDate.getTime() === selectedCheckIn.getTime()) {
                dayElement.classList.add('selected');
            }
            if (selectedCheckOut && dayDate.getTime() === selectedCheckOut.getTime()) {
                dayElement.classList.add('selected');
            }
            // Highlight dates between check-in and check-out
            if (selectedCheckIn && selectedCheckOut && dayDate > selectedCheckIn && dayDate < selectedCheckOut) {
                dayElement.classList.add('selected-range');
            }
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

function selectDate(date) {
    if (!selectedCheckIn || selectingCheckOut) {
        if (!selectingCheckOut) {
            selectedCheckIn = date;
            selectedCheckOut = null;
            selectingCheckOut = true;
        } else {
            if (date > selectedCheckIn) {
                selectedCheckOut = date;
                selectingCheckOut = false;
            } else {
                selectedCheckIn = date;
                selectedCheckOut = null;
            }
        }
    } else {
        selectedCheckIn = date;
        selectedCheckOut = null;
        selectingCheckOut = true;
    }
    updateDateDisplays();
    generateCalendar();
}

function updateDateDisplays() {
    const checkInDisplay = document.getElementById('checkInDisplay');
    const checkOutDisplay = document.getElementById('checkOutDisplay');
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');

    if (selectedCheckIn) {
        checkInDisplay.textContent = selectedCheckIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        checkInInput.value = selectedCheckIn.toISOString().split('T')[0];
    } else {
        checkInDisplay.textContent = 'Not selected';
        checkInInput.value = '';
    }

    if (selectedCheckOut) {
        checkOutDisplay.textContent = selectedCheckOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        checkOutInput.value = selectedCheckOut.toISOString().split('T')[0];
    } else {
        checkOutDisplay.textContent = 'Not selected';
        checkOutInput.value = '';
    }
}

function changeMonth(direction) {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1);
    if (newDate >= new Date().setHours(0,0,0,0)) { // Prevent navigating to past months
        currentDate = newDate;
        generateCalendar();
    }
}

// Replace the existing handleSubmit function with this
function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    if (!selectedCheckIn || !selectedCheckOut) {
        alert('Please select both check-in and check-out dates.');
        return;
    }
    
    const formData = new FormData(form);
    const bookingData = Object.fromEntries(formData);
    const nights = Math.ceil((selectedCheckOut - selectedCheckIn) / (1000 * 60 * 60 * 24));
    bookingData.nights = nights;
    
    console.log('Booking Data:', bookingData);
    
    // Submit to Formspree via AJAX
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('submissionPopup').style.display = 'flex';
            form.reset();
            selectedCheckIn = null;
            selectedCheckOut = null;
            selectingCheckOut = false;
            updateDateDisplays();
            generateCalendar();
        } else {
            alert('There was an issue submitting your request. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please check your connection and try again.');
    });
}

// Add this new function to handle popup closing
function closePopup() {
    document.getElementById('submissionPopup').style.display = 'none';
}

// Keep the existing initialization code
document.addEventListener('DOMContentLoaded', () => {
    generateCalendar();
    // Ensure form has correct action
    document.getElementById('bookingForm').addEventListener('submit', handleSubmit);
});