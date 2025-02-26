import axios from 'axios';
const API_KEY = '47404996-12b53dec464063fd6255bb496';

export const fetchImages = query => {
  return axios
    .get(
      `https://pixabay.com/api/?q=${query}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12&safesearch=true`
    )
    .then(({ data }) => data)
    .catch(error => {
      console.log(error.message);
      throw error;
    });
};
