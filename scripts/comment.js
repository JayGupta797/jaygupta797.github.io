// Function to dynamically load the Utterances script based on theme
function loadUtterances(appearance) {
  const script = document.createElement('script');
  script.setAttribute('src', 'https://utteranc.es/client.js')
  script.setAttribute('repo', 'jaygupta797/jaygupta797.github.io');
  script.setAttribute('issue-term', 'pathname');
  script.setAttribute('theme', appearance);
  script.setAttribute('crossorigin', 'anonymous');
  
  // Find the container element where the script should be inserted
  const container = document.getElementById('utterances-container');
  
  // Insert the script element before the container element
  container.appendChild(script);
}

// Get the theme from localStorage
const appearance = localStorage.getItem('theme') === 'dark' ? 'photon-dark' : 'github-light';

// Load the Utterances script with the dynamic theme
loadUtterances(appearance);