import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
let page = 1;
const perPage = 30;


const pixabayApiKey = '38375403-409fa10b1f66841faf3e919b8';

const fetchData = async (query, pageNum) => {
    try {
        const response = await axios.get('https://pixabay.com/api/', {
            params: {
                key: pixabayApiKey,
                q: query,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: pageNum,
                per_page: perPage,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const renderImageCard = (image) => {
    const card = document.createElement('div');
    card.classList.add('photo-card');
    card.innerHTML = `
    <a href="${image.largeImageURL}" class="gallery__item">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item"><b>Likes:</b> ${image.likes}</p>
      <p class="info-item"><b>Views:</b> ${image.views}</p>
      <p class="info-item"><b>Comments:</b> ${image.comments}</p>
      <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
    </div>
  `;
    gallery.appendChild(card);
};

const clearGallery = () => {
    gallery.innerHTML = '';
};

const performSearch = async (searchQuery) => {
    try {
        isLoading = true;
        const data = await fetchData(searchQuery, page);
        if (data.hits.length === 0) {
            if (page === 1) {
                Notiflix.Notify.failure('Sorry, we could not find any images matching your search query.');
            }
            return;
        }
        totalImages = data.total;
        totalPages = Math.ceil(totalImages / perPage);
        data.hits.forEach(renderImageCard);
        page += 1;
        lightbox.refresh();
        isLoading = false;

        if (page === 2) {
            showSearchResultsMessage();
        }
    } catch (error) {
        Notiflix.Notify.failure('Oops! Something went wrong. Please try again later.');
        isLoading = false;
    }
};

const showSearchResultsMessage = () => {
    const message = `Found ${totalImages} images.`;
    Notiflix.Notify.success(message);
};

form.addEventListener('submit', (event) => {
    event.preventDefault();
    currentSearchQuery = event.target.elements.searchQuery.value.trim();
    if (!currentSearchQuery) {
        return;
    }
    clearGallery();
    page = 1;
    performSearch(currentSearchQuery);
});

const lightbox = new SimpleLightbox('.gallery__item');

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading && page <= totalPages) {
        performSearch(currentSearchQuery);
    }
});
