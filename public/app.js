document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (menuButton && navigation) {
  menuButton.hidden = false;
  const setOpen = (open) => {
    menuButton.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
    menuButton.firstChild.textContent = open ? menuButton.dataset.close : menuButton.dataset.open;
  };
  menuButton.addEventListener('click', () => setOpen(menuButton.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      menuButton.focus();
    }
  });
  matchMedia('(min-width: 851px)').addEventListener('change', () => setOpen(false));
}
