function resizeAndMoveWelcomeSection() {
  const wrapper = document.getElementById('home-page-wrapper');
  const welcomeSectionContainer = document.getElementById(
    'welcome-section-container',
  );
  const welcomeText = document.getElementById('welcome-section-text-container');

  if (!welcomeSectionContainer || !welcomeText) return;

  if (window.innerWidth <= 805) {
    // Move welcomeText inside welcomeSectionContainer if not already there
    if (!welcomeSectionContainer.contains(welcomeText)) {
      welcomeSectionContainer.appendChild(welcomeText);
    }
  } else {
    // Move welcomeText after welcomeSectionContainer in the DOM, only if not already there
    const parent = welcomeSectionContainer.parentNode;
    if (parent && parent !== welcomeText.parentNode) {
      if (welcomeSectionContainer.nextSibling) {
        parent.insertBefore(welcomeText, welcomeSectionContainer.nextSibling);
      } else {
        parent.appendChild(welcomeText);
      }
    }
  }
}

window.addEventListener('resize', resizeAndMoveWelcomeSection);
window.addEventListener('load', () => {
  resizeAndMoveWelcomeSection();
});
