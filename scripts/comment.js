/* 
 * NAME: color-svg.js
 * DESCRIPTION: This script is included in every svg that uses the page color set.
 * Graphics loaded in via the <object> tag cannot reference CSS variables. Instead, we use
 * this short script to detect what the current color set is, and name those colors.
*/

// Build the initial utterances script based on theme This approach was heavily drawn from the 
// answer listed here: https://github.com/utterance/utterances/issues/549#issuecomment-913070158
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