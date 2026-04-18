fetch(`/partials/header.html`)
  .then((response) => response.text())
  .then((html) => {
    const headerPlaceholder = document.getElementById('header-placeholder');


    if (headerPlaceholder.classList.contains('home-page')) {
      document.getElementById('header-placeholder').innerHTML = html;
      const header = document.getElementById('header');
      header.classList.add('home-page');
    } else {
      document.getElementById('header-placeholder').innerHTML = html;
      const header = document.getElementById('header');
      header.classList.add('not-home-page');
    }

    // Force layout recalculation after header is loaded and class is set
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);

    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = navbar.querySelectorAll(':scope > a:not(.dropbtn)');
    const icon = menuToggle.querySelector('i');
    const overlay = document.getElementById('mobile-submenu-overlay');
    const backArrow = document.getElementById('mobile-back-arrow');
    const aboutBtn = navbar.querySelector('.dropbtn');

    const closeOverlay = () => {
      overlay.classList.remove('active');
      menuToggle.classList.remove('overlay-active');
    };

    const closeNavbar = () => {
      navbar.classList.remove('active');
      menuToggle.classList.remove('navbar-active');
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    };

    menuToggle.addEventListener('click', () => {
      navbar.classList.toggle('active');
      menuToggle.classList.toggle('navbar-active');
      if (navbar.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    navbar.addEventListener('click', (e) => {
      if (e.target === navbar) {
        closeNavbar();
        closeOverlay();
      }
    });

    aboutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.innerWidth <= 804) {
        overlay.classList.add('active');
        menuToggle.classList.add('overlay-active');
      }
    });

    overlay.addEventListener('click', closeOverlay);

    backArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      closeOverlay();
    });

    overlay.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
        closeOverlay();
        closeNavbar();
      });
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeNavbar();
        closeOverlay();
      });
    });
  })
  .catch((error) => console.error('Error loading header.html:', error));

fetch(`/partials/footer.html`)
  .then((response) => response.text())
  .then((html) => {
    document.getElementById('footer-container').innerHTML = html;
  })
  .catch((error) => console.error('Error loading footer.html:', error));
