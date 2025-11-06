import { apiClient, API_ENDPOINTS } from '@/shared/config/api.config';
import { SearchResult, SearchSuggestion } from '@/shared/types/api.types';

export interface SearchParams {
  q: string;
  page?: number;
  limit?: number;
}

export interface SearchSuggestionsParams {
  q: string;
  limit?: number;
}

export class SearchAPI {
  
  static async globalSearch(params: SearchParams): Promise<SearchResult> {
    const response = await apiClient.get<SearchResult>(
      API_ENDPOINTS.search.global,
      { params }
    );
    return response.data;
  }

  static async getSearchSuggestions(params: SearchSuggestionsParams): Promise<{ suggestions: SearchSuggestion[] }> {
    const response = await apiClient.get<{ suggestions: SearchSuggestion[] }>(
      API_ENDPOINTS.search.suggestions,
      { params }
    );
    return response.data;
  }
}
