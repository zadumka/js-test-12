import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { fetchImages } from './js/pixabay-api';

import {
  clearGallery,
  hideLoader,
  renderGallery,
  showLoader,
} from './js/render-functions';

iziToast.settings({
  position: 'topRight',
});

const searchForm = document.querySelector('.form');

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const query = e.target.elements.query.value.trim().toLowerCase();

  if (!query) {
    iziToast.warning({ message: 'Enter the query' });
    e.target.reset();
    return;
  }

  clearGallery();
  showLoader();

  fetchImages(query)
    .then(({ hits: images }) => {
      if (!images.length) {
        iziToast.error({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
        return;
      }
      renderGallery(images);
    })
    .catch(e => {
      iziToast.error({ message: e.message });
    })
    .finally(() => {
      hideLoader();
    });
});
