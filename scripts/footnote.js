/* 
 * NAME: footnote.js
 * DESCRIPTION: This script adds functionality to the footnote component.
*/

const tooltip = document.getElementById('footnote-tooltip');
const footnotes = document.querySelectorAll('.footnote');

// Track which footnote is currently active for mobile
let activeFootnote = null;

footnotes.forEach(fn => {
  fn.addEventListener('mouseenter', (e) => {
    tooltip.textContent = fn.getAttribute('data-content');
    tooltip.style.display = 'block';
  });

  fn.addEventListener('mousemove', (e) => {
    tooltip.style.left = `${e.pageX + 15}px`;
    tooltip.style.top = `${e.pageY + 15}px`;
  });

  fn.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });

  // Add click functionality
  fn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const content = fn.getAttribute('data-content');
    
    // If this footnote is already active, hide the tooltip
    if (activeFootnote === fn) {
      tooltip.style.display = 'none';
      activeFootnote = null;
      return;
    }
    
    // Show this footnote's tooltip
    tooltip.textContent = content;
    tooltip.style.display = 'block';
    
    // Position tooltip consistently with hover behavior
    tooltip.style.left = `${e.pageX + 15}px`;
    tooltip.style.top = `${e.pageY + 15}px`;
    
    activeFootnote = fn;
  });
});

// Hide tooltip when clicking outside of footnotes
document.addEventListener('click', (e) => {
  if (!e.target.classList.contains('footnote')) {
    tooltip.style.display = 'none';
    activeFootnote = null;
  }
}); 