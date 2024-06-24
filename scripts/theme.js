// Get theme or default to `light` if NULL
let theme = localStorage.getItem('theme') || 'dark';

function applyTheme() {
    // Toggle Moon
    document.getElementById("moon").classList.toggle('night', theme === 'dark');
    document.body.classList.toggle("dark-theme", theme === 'dark');

    // Toggle Code Blocks
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

    // Toggle Comments
    // Reference: https://github.com/utterance/utterances/issues/549#issuecomment-907606127
    let appearance = theme === 'dark' ? 'photon-dark' : 'github-light';
    if (document.querySelector('.utterances-frame')) {
        let message = {
        type: 'set-theme',
        theme: appearance
        };
        const iframe = document.querySelector('.utterances-frame');
        iframe.contentWindow.postMessage(message, 'https://utteranc.es');
    }
}
applyTheme();
localStorage.setItem('theme', theme);

// Toggle Light/Dark upon click
function toggleDark() {
    theme = theme === 'light' ? 'dark' : 'light';
    applyTheme();
    localStorage.setItem('theme', theme);
}

// Check for changes in the theme when the storage event occurs
window.addEventListener('storage', function(event) {
    if (event.key === 'theme') {
        theme = event.newValue || 'dark';
        applyTheme();
        localStorage.setItem('theme', theme);
    }
});
