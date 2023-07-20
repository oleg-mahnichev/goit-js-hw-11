import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
const perPage = 40;
let currentSearchQuery = '';

const pixabayApiKey = 'YOUR_PIXABAY_API_KEY';

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
        const data = await fetchData(searchQuery, page);
        if (data.hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            return;
        }
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        data.hits.forEach(renderImageCard);
        page += 1;
        loadMoreBtn.style.display = 'block';
        lightbox.refresh();
    } catch (error) {
        Notiflix.Notify.failure('Oops! Something went wrong. Please try again later.');
    }
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
    loadMoreBtn.style.display = 'none';
});

loadMoreBtn.addEventListener('click', () => {
    performSearch(currentSearchQuery);
});

const lightbox = new SimpleLightbox('.gallery__item');
