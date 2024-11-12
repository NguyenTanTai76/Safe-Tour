const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/**
 * Hàm tải template
 */
function load(selector, path) {
  const cached = localStorage.getItem(path);
  const element = $(selector);
  if (cached) {
    element.innerHTML = cached;
  }

  fetch(path)
    .then((res) => res.text())
    .then((html) => {
      if (html !== cached) {
        element.innerHTML = html;
        localStorage.setItem(path, html);
      }
    })
    .finally(() => {
      window.dispatchEvent(new Event('template-loaded'));
    });
}

/**
 * Hàm kiểm tra một phần tử có bị ẩn bởi display: none không
 */
function isHidden(element) {
  if (!element) return true;

  if (window.getComputedStyle(element).display === 'none') {
    return true;
  }

  let parent = element.parentElement;
  while (parent) {
    if (window.getComputedStyle(parent).display === 'none') {
      return true;
    }
    parent = parent.parentElement;
  }

  return false;
}

/**
 * Hàm buộc một hành động phải đợi sau một khoảng thời gian mới được thực thi
 */
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

/**
 * Hàm tính toán vị trí arrow cho dropdown
 */
const calArrowPos = debounce(() => {
  if (isHidden($('.js-dropdown-list'))) return;

  $$('.js-dropdown-list > li').forEach((item) => {
    const arrowPos = item.offsetLeft + item.offsetWidth / 2;
    item.style.setProperty('--arrow-left-pos', `${arrowPos}px`);
  });
});

// Recalculate arrow position on resize or after template load
['resize', 'template-loaded'].forEach((event) =>
  window.addEventListener(event, calArrowPos)
);

/**
 * Giữ active menu khi hover
 */
function handleActiveMenu() {
  const activeClass = 'menu-column__item--active';

  const removeActive = (menu) => {
    menu.querySelector(`.${activeClass}`)?.classList.remove(activeClass);
  };

  const initMenu = (menu) => {
    const items = menu.children;
    if (items.length) {
      removeActive(menu);
      items[0].classList.add(activeClass);

      Array.from(items).forEach((item) => {
        item.onmouseenter = () => {
          if (window.innerWidth <= 991) return;
          removeActive(menu);
          item.classList.add(activeClass);
        };
      });
    }
  };

  $$('.js-menu-list').forEach(initMenu);

  $$('.js-dropdown').forEach((dropdown) => {
    dropdown.onmouseleave = () => $$('.js-menu-list').forEach(initMenu);
  });
}

window.addEventListener('template-loaded', handleActiveMenu);

/**
 * JS toggle
 */
function initJsToggle() {
  $$('.js-toggle').forEach((button) => {
    const target = button.getAttribute('toggle-target');
    if (!target)
      return console.warn(`Cần thêm toggle-target cho: ${button.outerHTML}`);

    button.onclick = () => {
      const targetElem = $(target);
      if (!targetElem) {
        return console.warn(`Không tìm thấy phần tử "${target}"`);
      }

      const isHidden = targetElem.classList.contains('hide');
      requestAnimationFrame(() => {
        targetElem.classList.toggle('hide', !isHidden);
        targetElem.classList.toggle('show', isHidden);
      });
    };
  });
}

window.addEventListener('template-loaded', initJsToggle);

// Hero Section
document.addEventListener('DOMContentLoaded', () => {
  const heroSection = $('.hero');
  setTimeout(() => {
    heroSection.classList.add('visible');
  }, 300);
});

// Modal Popup Section
document.addEventListener('DOMContentLoaded', () => {
  const contactModal = $('#contactModal');
  const contactBtn = $('#contactBtn');
  const closeModal = $('#closeModal');
  const btnContinue = $('.modal-continue__btn'); // Nút Continue
  const loginForm = $('#modal-loginForm');
  const createAccountForm = $('#createAccountForm');

  // Mở modal khi bấm nút "Get Started"
  contactBtn.onclick = () => contactModal.classList.add('show');

  // Đóng modal khi bấm nút đóng (x)
  closeModal.onclick = () => contactModal.classList.remove('show');

  // Đóng modal và chuyển form khi bấm nút "Continue"
  btnContinue.onclick = () => {
    loginForm.style.display = 'none';
    createAccountForm.style.display = 'block';
    contactModal.classList.remove('show');
  };

  // Đóng modal khi click ra bên ngoài modal
  window.onclick = (event) => {
    if (event.target === contactModal) {
      contactModal.classList.remove('show');
    }
  };
});
