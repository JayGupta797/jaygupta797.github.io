/* 
 * NAME: theme.js
 * DESCRIPTION: This script maintains the theme state of the site. If the user refreshes, navigates
 * between pages, or toggles the button on the upper right, the background and assets are updated.
*/

// Setup Constants and Defaults
const PRISM_HREF = {
    dark: 'https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-atom-dark.min.css',
    light: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.9.0/themes/prism.min.css'
};
let iframeLoaded = false;
let theme = localStorage.getItem('theme') || 'dark';

// Set Theme
localStorage.setItem('theme', theme);

/*
 * toggleSVGColors()
 * ---------------
 * This function iterates through all svg objects (conveniently flagged under the svgObject class)
 * and updates the content accordingly. This approach was heavily drawn from the SE answer listed
 * here: https://stackoverflow.com/a/69860310
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
    let prismElement = document.getElementById("prism-theme");
    if (prismElement) {
        prismElement.setAttribute('href', PRISM_HREF[theme]);
    }

    // Toggle Comment Block
    // Reference: https://github.com/utterance/utterances/issues/549#issuecomment-907606127
    // Reference: https://github.com/utterance/utterances/issues/657
    const appearance = theme === 'dark' ? 'photon-dark' : 'github-light';
    const iframe = document.querySelector('.utterances-frame');
    const message = { type: 'set-theme', theme: appearance };

    if (iframe) {
        // Use setInterval to poll until Utterances is loaded (non-empty height)
        let pollInterval = setInterval(() => {
            const utterances = document.querySelector('.utterances');
            if (utterances && utterances.style.height && utterances.style.height !== "") {
                clearInterval(pollInterval);
                if (iframe.contentWindow) {
                    iframe.contentWindow.postMessage(message, 'https://utteranc.es');
                }
            }
        }, 50);
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