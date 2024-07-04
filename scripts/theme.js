/* 
 * NAME: theme.js
 * DESCRIPTION: This script maintains the theme state of the site. If the user refreshes, navigates
 * between pages, or toggles the button on the upper right, the background and assets are updated.
*/

// get theme or default to `dark` mode if NULL
let theme = localStorage.getItem('theme') || 'dark';
localStorage.setItem('theme', theme);

/*
 * loadSVGColors()
 * ---------------
 * This function iterates through all svg objects (conveniently flagged under the svgObject class)
 * and updates the content accordingly. This approach was heavily drawn from the SE answer listed
 * here: https://stackoverflow.com/a/69860310
 * 
*/
function toggleSVGColors() {
    // collect colors
    const isLightTheme = theme === 'light';
    const primaryColor = isLightTheme ? '#fff' : '#252a34';
    const secondaryColor = isLightTheme ? '#252a34' : '#fff';

    // collect svgs
    colors = getColors();
    const svgs = document.querySelectorAll('.svgObject');

    // iterate through each svg
    svgs.forEach(svg => {
        const updateColors = () => {
            // get the actual SVG that is loaded into the object element
            const element = svg.contentDocument;

            // if there is content, color the elements
            if (element) {
                const primaryFillElements = element.querySelectorAll('.svg__primary-fill');
                const primaryStrokeElements = element.querySelectorAll('.svg__primary-stroke');
                const secondaryFillElements = element.querySelectorAll('.svg__secondary-fill');
                const secondaryStrokeElements = element.querySelectorAll('.svg__secondary-stroke');

                primaryFillElements.forEach(e => {
                    e.style.fill = primaryColor;
                });
                primaryStrokeElements.forEach(e => {
                    e.style.stroke = primaryColor;
                });
                secondaryFillElements.forEach(e => {
                    e.style.fill = secondaryColor;
                });
                secondaryStrokeElements.forEach(e => {
                    e.style.stroke = secondaryColor;
                });
            }
        };

        // add an event listener to wait for the svg to load
        // reference: https://community.adobe.com/t5/captivate-discussions/access-svg-object-with-javascript/td-p/10853135
        svg.addEventListener("load", updateColors);

        // if the SVG is already loaded, trigger the load event manually
        if (svg.contentDocument) {
            updateColors();
        }
    });
}

/*
 * applyTheme()
 * ------------
 * This function applies the current theme to the page by toggling all relevant assets.
*/
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

    // Toggle Comment Block
    // Reference: https://github.com/utterance/utterances/issues/549#issuecomment-907606127
    const appearance = theme === 'dark' ? 'photon-dark' : 'github-light';
    if (document.querySelector('.utterances-frame')) {
        let message = {
        type: 'set-theme',
        theme: appearance
        };
        const iframe = document.querySelector('.utterances-frame');
        iframe.contentWindow.postMessage(message, 'https://utteranc.es');
    }

    // TODO: check if this approach is preferable
    // toggleSVGColors();
}

// Apply the default theme
applyTheme();

// Toggle theme upon click
function toggleDark() {
    theme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    applyTheme();
}

// Check for changes in the theme when the storage event occurs
window.addEventListener('storage', function(event) {
    if (event.key === 'theme') {
        theme = event.newValue || 'dark';
        localStorage.setItem('theme', theme);
        applyTheme();
    }
});