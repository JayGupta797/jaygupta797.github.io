
// Get the theme from localStorage, default to 'light' if not set
let theme = localStorage.getItem('theme') || 'light';

// Function to apply the current theme
function applyTheme() {
    // Update moon and body classes based on the theme
    document.getElementById("moon").classList.toggle('night', theme === 'dark');
    document.body.classList.toggle("dark-theme", theme === 'dark');

    // Adjust prism-theme based on the theme
    let prismHref = theme === 'dark' ?
        'https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism-okaidia.min.css' :
        'https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism.min.css';

    let prismElement = document.getElementById("prism-theme");
    if (prismElement) {
        prismElement.setAttribute('integrity', theme === 'dark' ?
            'sha512-5HvW0a7ihK3ro2KhwEksDHXgIezsTeZybZDIn8d8Y015Ny+t7QWSIjnlCTjFzlK7Klb604HLGjsNqU/i5mJLjQ==' :
            'sha512-/mZ1FHPkg6EKcxo0fKXF51ak6Cr2ocgDi5ytaTBjsQZIH/RNs6GF6+oId/vPe3eJB836T36nXwVh/WBl/cWT4w==');

        prismElement.setAttribute('href', prismHref);
    }
}

// Apply the theme when the page loads
applyTheme();

// Function to toggle between light and dark themes
function toggleDark() {
    // Toggle the theme between light and dark
    theme = theme === 'light' ? 'dark' : 'light';

    // Save the current theme to localStorage
    localStorage.setItem('theme', theme);

    // Apply the new theme
    applyTheme();
}

// window.addEventListener('DOMContentLoaded', (event) => {
window.addEventListener('storage', function(event) {
    // Check localStorage for stored theme
    let storedTheme = localStorage.getItem('theme');
    
    // Apply the stored theme
    if (storedTheme === 'dark') {
        applyDarkTheme();
    } else {
        applyLightTheme();
    }
});

function applyDarkTheme() {
    // Apply dark theme styles
    document.getElementById("moon").classList.add('night');
    document.body.classList.add("dark-theme");

    // Adjust prism-theme
    let element = document.getElementById("prism-theme");
    if (element) {
        element.setAttribute('integrity', 'sha512-5HvW0a7ihK3ro2KhwEksDHXgIezsTeZybZDIn8d8Y015Ny+t7QWSIjnlCTjFzlK7Klb604HLGjsNqU/i5mJLjQ==');
        element.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism-okaidia.min.css');
    }
}

function applyLightTheme() {
    // Apply light theme styles
    document.getElementById("moon").classList.remove('night');
    document.body.classList.remove("dark-theme");

    // Adjust prism-theme
    let element = document.getElementById("prism-theme");
    if (element) {
        element.setAttribute('integrity', 'sha512-/mZ1FHPkg6EKcxo0fKXF51ak6Cr2ocgDi5ytaTBjsQZIH/RNs6GF6+oId/vPe3eJB836T36nXwVh/WBl/cWT4w==');
        element.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism.min.css');
    }
}