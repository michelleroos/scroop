const howItWorks = document.querySelector('#how-scroople-works');
const modalBg = document.querySelector('.modal-background');
// const times = document.querySelector('.fa-times');
const modalX = document.getElementById('modal-x');

export const modalClick = howItWorks.addEventListener('click', function () {
  modalBg.classList.add('modal-active');
})

export const closeModal = modalX.addEventListener('click', function () {
  modalBg.classList.remove('modal-active');
})

export const clickOutside = window.addEventListener('click', function (e) {
  if (e.target == modalBg) {
    modalBg.classList.remove('modal-active');
  }
})