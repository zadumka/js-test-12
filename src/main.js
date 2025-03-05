import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { fetchImages, PER_PAGE } from './js/pixabay-api';

import {
  clearGallery,
  hideLoader,
  renderGallery,
  showLoader,
  refs,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

iziToast.settings({
  position: 'topRight',
});

let query = '';
let page = 1;
let totalImages = 0;

const searchForm = document.querySelector('.form');

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  scroll();
  query = e.target.elements.query.value.trim().toLowerCase();

  if (!query) {
    iziToast.warning({ message: 'Enter the query' });
    e.target.reset();
    return;
  }

  page = 1;
  hideLoadMoreButton();
  clearGallery();
  showLoader();

  try {
    const { hits: images, totalHits } = await fetchImages(query, page);
    totalImages = totalHits;

    if (!totalImages) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }
    renderGallery(images);

    if (totalImages <= PER_PAGE * page) {
      hideLoadMoreButton();
      return;
    }
    showLoadMoreButton();
  } catch (error) {
    iziToast.error({ message: e.message });
  } finally {
    hideLoader();
  }
});

refs.loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();
  hideLoadMoreButton();
  try {
    const { hits: images } = await fetchImages(query, page);
    renderGallery(images);
    scroll();

    if (totalImages <= PER_PAGE * page) {
      iziToast.success({
        message: 'We`re sorry, but you`ve reached the end of search results.',
      });
      hideLoadMoreButton();
      return;
    }

    showLoadMoreButton();
  } catch (e) {
    iziToast.error({ message: e.message });
  } finally {
    hideLoader();
  }
});

export const scroll = () => {
  const imageRef = refs.galleryContainer.firstChild;
  if (!imageRef) return;

  const { height } = imageRef.getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
};
