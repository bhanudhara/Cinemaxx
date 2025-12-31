import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MovieSearch } from '../components/MovieSearch';
import { fetchMovies } from '../api/tmdb';

// Mock the TMDB API
jest.mock('../api/tmdb');
const mockedFetchMovies = fetchMovies as jest.MockedFunction<typeof fetchMovies>;

const mockMovie = {
  id: 1,
  title: 'Test Movie',
  poster_path: '/test.jpg',
  release_date: '2023-01-01',
  vote_average: 8.5,
};

const mockOnSelect = jest.fn();

describe('MovieSearch Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input and button', () => {
    render(<MovieSearch onSelect={mockOnSelect} />);

    expect(screen.getByPlaceholderText('Search movies...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('updates query on input change', () => {
    render(<MovieSearch onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText('Search movies...');
    fireEvent.change(input, { target: { value: 'test query' } });

    expect(input).toHaveValue('test query');
  });

  it('calls fetchMovies on form submit with query', async () => {
    mockedFetchMovies.mockResolvedValueOnce({ results: [mockMovie] });

    render(<MovieSearch onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText('Search movies...');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'test movie' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedFetchMovies).toHaveBeenCalledWith('/search/movie', { query: 'test movie' });
    });
  });

  it('does not search on empty query', () => {
    render(<MovieSearch onSelect={mockOnSelect} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockedFetchMovies).not.toHaveBeenCalled();
  });

  it('shows loading state during search', async () => {
    mockedFetchMovies.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ results: [] }), 100)));

    render(<MovieSearch onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText('Search movies...');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);

    expect(screen.getByText('Searching...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
    });
  });

  it('displays search results', async () => {
    mockedFetchMovies.mockResolvedValueOnce({ results: [mockMovie] });

    render(<MovieSearch onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText('Search movies...');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
      expect(screen.getByText('2023-01-01')).toBeInTheDocument();
      expect(screen.getByText('⭐ 8.5')).toBeInTheDocument();
    });
  });

  it('calls onSelect when movie is clicked', async () => {
    mockedFetchMovies.mockResolvedValueOnce({ results: [mockMovie] });

    render(<MovieSearch onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText('Search movies...');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);

    await waitFor(() => {
      const movieElement = screen.getByText('Test Movie');
      fireEvent.click(movieElement);
      expect(mockOnSelect).toHaveBeenCalledWith(mockMovie);
    });
  });

  it('handles API errors gracefully', async () => {
    mockedFetchMovies.mockRejectedValueOnce(new Error('API Error'));

    // Mock console.error to avoid test output pollution
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<MovieSearch onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText('Search movies...');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});