// Utility for TMDB API requests
import axios from 'axios';

const API_KEY = 'AIzaSyCaVFV8THJVCzNbqe5v4ZF35hDvDAekxBM'; // Replace with your TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMovies = async (endpoint: string, params: Record<string, any> = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const response = await axios.get(url, {
    params: { api_key: API_KEY, ...params },
  });
  return response.data;
};
