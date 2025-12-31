import axios from 'axios';
import { fetchMovies, fetchPopularMovies, fetchNowPlayingMovies, fetchUpcomingMovies, fetchTopRatedMovies, searchMovies } from '../api/tmdb';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TMDB API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchMovies', () => {
    it('should fetch movies successfully', async () => {
      const mockData = { results: [{ id: 1, title: 'Test Movie' }] };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await fetchMovies('/movie/popular', { page: 1 });

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.themoviedb.org/3/movie/popular', {
        params: { page: 1 },
        headers: {
          Authorization: expect.stringContaining('Bearer '),
          Accept: 'application/json',
        },
      });
      expect(result).toEqual(mockData);
    });

    it('should throw error on API failure', async () => {
      const errorMessage = 'API Error';
      mockedAxios.get.mockRejectedValueOnce({
        response: { data: { status_message: errorMessage } },
      });

      await expect(fetchMovies('/movie/popular')).rejects.toThrow(errorMessage);
    });

    it('should throw generic error on network failure', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

      await expect(fetchMovies('/movie/popular')).rejects.toThrow(
        'Failed to fetch data from TMDB. Please try again later.'
      );
    });
  });

  describe('fetchPopularMovies', () => {
    it('should call fetchMovies with correct endpoint and params', async () => {
      const mockData = { results: [] };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await fetchPopularMovies(2, { language: 'en' });

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.themoviedb.org/3/movie/popular', {
        params: { page: 2, language: 'en' },
        headers: expect.any(Object),
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('fetchNowPlayingMovies', () => {
    it('should call fetchMovies with correct endpoint', async () => {
      const mockData = { results: [] };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      await fetchNowPlayingMovies();

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.themoviedb.org/3/movie/now_playing', {
        params: { page: 1 },
        headers: expect.any(Object),
      });
    });
  });

  describe('fetchUpcomingMovies', () => {
    it('should call fetchMovies with correct endpoint', async () => {
      const mockData = { results: [] };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      await fetchUpcomingMovies();

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.themoviedb.org/3/movie/upcoming', {
        params: { page: 1 },
        headers: expect.any(Object),
      });
    });
  });

  describe('fetchTopRatedMovies', () => {
    it('should call fetchMovies with correct endpoint', async () => {
      const mockData = { results: [] };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      await fetchTopRatedMovies();

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.themoviedb.org/3/movie/top_rated', {
        params: { page: 1 },
        headers: expect.any(Object),
      });
    });
  });

  describe('searchMovies', () => {
    it('should call fetchMovies with search endpoint and query', async () => {
      const mockData = { results: [] };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await searchMovies('test query', 1);

      expect(mockedAxios.get).toHaveBeenCalledWith('https://api.themoviedb.org/3/search/movie', {
        params: { query: 'test query', page: 1 },
        headers: expect.any(Object),
      });
      expect(result).toEqual(mockData);
    });
  });
});