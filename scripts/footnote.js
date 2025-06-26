/* 
 * NAME: footnote.js
 * DESCRIPTION: This script adds functionality to the footnote component.
*/

const tooltip = document.getElementById('footnote-tooltip');
const footnotes = document.querySelectorAll('.footnote');

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
}); 