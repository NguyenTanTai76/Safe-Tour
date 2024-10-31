function load(selector, path) {
  const cached = localStorage.getItem(path);
  if (cached) {
    document.querySelector(selector).innerHTML = cached;
  }

  fetch(path)
    .then((res) => res.text())
    .then((html) => {
      if (html !== cached) {
        document.querySelector(selector).innerHTML = html;
        localStorage.setItem(path, html);
      }
    });
}

/**
 * JS toggle
 *
 * Cách dùng:
 * <button class="js-toggle" toggle-target="#box">Click</button>
 * <div id="box">Content show/hide</div>
 */
window.addEventListener('template-loaded', initJsToggle);

function initJsToggle() {
  const buttons = document.querySelectorAll('.js-toggle');
  buttons.forEach((button) => {
    const target = button.getAttribute('toggle-target');
    if (!target) {
      console.error(`Cần thêm toggle-target cho: ${button.outerHTML}`);
      return;
    }
    button.onclick = () => {
      const navbar = document.querySelector(target);
      if (!navbar) {
        return console.error(`Không tìm thấy phần tử "${target}"`);
      }
      const isHidden = navbar.classList.contains('hide');

      requestAnimationFrame(() => {
        navbar.classList.toggle('hide', !isHidden);
        navbar.classList.toggle('show', isHidden);
        console.log(`Navbar ${isHidden ? 'hiện' : 'ẩn'} ra`);
      });
    };
  });
}
