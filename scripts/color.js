function changeColor(theme) {
  // Update CSS variable values based on the theme
  const root = document.documentElement;
  root.style.setProperty('--primary-color', theme === 'light' ? 'white' : '#252a34');
  root.style.setProperty('--secondary-color', theme === 'light' ? '#252a34' : '#eaeaea');
}

// Initially update color
let data = localStorage.getItem('theme') || 'dark';
changeColor(data);

// Check for changes in the theme when the storage event occurs
window.addEventListener('storage', function(event) {
  if (event.key === 'theme') {
    theme = event.newValue || 'dark';
    // localStorage.setItem('theme', theme);
    changeColor(event.newValue);
  }
});