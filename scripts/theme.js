
/* Java Script to perform main page toggle functionality */
let data = localStorage.getItem('theme');

if (data == null) {
  localStorage.setItem('theme', 'light');

  // Adjust prism-theme
  element = document.getElementById("prism-theme")
  if (element) {
    element.setAttribute('integrity', 'sha512-/mZ1FHPkg6EKcxo0fKXF51ak6Cr2ocgDi5ytaTBjsQZIH/RNs6GF6+oId/vPe3eJB836T36nXwVh/WBl/cWT4w==');
    element.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism.min.css');
  }
}

if (data == 'light') {
  document.getElementById("moon").classList.remove('night');
  document.body.classList.remove("dark-theme");

  // Adjust prism-theme
  element = document.getElementById("prism-theme")
  if (element) {
    element.setAttribute('integrity', 'sha512-/mZ1FHPkg6EKcxo0fKXF51ak6Cr2ocgDi5ytaTBjsQZIH/RNs6GF6+oId/vPe3eJB836T36nXwVh/WBl/cWT4w==');
    element.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism.min.css');
  }
}

else if (data == 'dark') {
  document.getElementById("moon").classList.add('night');
  document.body.classList.add("dark-theme");

  // Adjust prism-theme
  element = document.getElementById("prism-theme")

  if (element) {
    element.setAttribute('integrity', 'sha512-5HvW0a7ihK3ro2KhwEksDHXgIezsTeZybZDIn8d8Y015Ny+t7QWSIjnlCTjFzlK7Klb604HLGjsNqU/i5mJLjQ==');
    element.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism-okaidia.min.css');
  }
}

function toggleDark() {

  moon = document.getElementById("moon");
  moon.classList.toggle('night');

  body = document.body;
  body.classList.toggle("dark-theme");

  if (body.classList.contains("dark-theme")) {
    localStorage.setItem('theme', 'dark');

    element = document.getElementById("prism-theme");
    if (element) {
      element.setAttribute('integrity', 'sha512-5HvW0a7ihK3ro2KhwEksDHXgIezsTeZybZDIn8d8Y015Ny+t7QWSIjnlCTjFzlK7Klb604HLGjsNqU/i5mJLjQ==');
      element.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism-okaidia.min.css');
    }
  }

  else {
    localStorage.setItem('theme', 'light');
    element = document.getElementById("prism-theme");
    if (element) {
      element.setAttribute('integrity', 'sha512-/mZ1FHPkg6EKcxo0fKXF51ak6Cr2ocgDi5ytaTBjsQZIH/RNs6GF6+oId/vPe3eJB836T36nXwVh/WBl/cWT4w==');
      element.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism.min.css');
    }
  }
}