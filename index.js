import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { PixabayApiImages } from './src/JS/APIPixabay.js';
import { createMarkupImg } from './src/JS/galleryCard.js';
import { refs } from './src/JS/refs.js';


refs.form.addEventListener('submit', onSubmitForm);

const pixabay = new PixabayApiImages();
const lightboxGallery = new SimpleLightbox('.gallery a');

async function onSubmitForm(e) {
  e.preventDefault();

  observer.observe(refs.infitity);
  clearGallery();
  pixabay.resetPage();

  pixabay.searchQuery = e.currentTarget.searchQuery.value.trim();

  if (pixabay.searchQuery === '') {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    return;
  }

  try {
    const { hits, totalHits } = await pixabay.getImages();
    pixabay.setTotal(totalHits);

    if (hits.length === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    Notify.success(`Hooray! We found ${totalHits} images.`);



    const markup = createMarkupImg(hits);
    updateMarkup(markup);

  } catch (error) {
    console.log(error);
    clearGallery();
  }
}

function updateMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightboxGallery.refresh();

}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

async function onEntry(entries) {

  entries.forEach(async entry => {
    try {
      if (
        entry.isIntersecting &&
        pixabay.query !== '' &&
        refs.gallery.childElementCount !== 0
      ) {
        pixabay.incrementPage();

        const { hits } = await pixabay.getImages();
        const markup = createMarkupImg(hits);
        updateMarkup(markup);

        if (pixabay.hasMoreImages()) {
          Notify.info(
            "We're sorry, but you've reached the end of search results."
          );

          observer.unobserve(refs.infitity);
        }
      }

    } catch (error) {
      console.error(error);
    }
  });
}

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '100px',
});

