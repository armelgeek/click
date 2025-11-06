import { useLocation, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import ProductCard from '@/components/molecules/product-card';
import StoreCard from '@/components/icons/store-card';
import Typography from '@/components/atoms/typography';

interface SearchResultsState {
  results: {
    products: Array<{
      id: string;
      name: string;
      price: number;
      image?: string;
    }>;
    stores: Array<{
      id: string;
      name: string;
      address?: string;
      image?: string;
    }>;
    query: string;
  };
  query: string;
}

export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as SearchResultsState;

  if (!state || !state.results) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Typography variant="subtitle" className="text-gray-500 mb-4">
          Aucun résultat de recherche
        </Typography>
        <Button onClick={() => navigate('/')} variant="outline">
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  const { results, query } = state;
  const { products, stores } = results;
  const totalResults = products.length + stores.length;

  return (
    <div className="min-h-screen flex flex-col p-4 gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <Typography variant="subtitle" className="text-lg font-semibold">
            Résultats pour "{query}"
          </Typography>
          <Typography variant="body" className="text-sm text-gray-500">
            {totalResults} résultat{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}
          </Typography>
        </div>
      </div>

      {/* Products Section */}
      {products.length > 0 && (
        <div className="space-y-3">
          <Typography variant="subtitle" className="text-base font-semibold text-vapo-purple-primary">
            Produits ({products.length})
          </Typography>
          <div className="grid grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="cursor-pointer"
              >
                <ProductCard
                  title={product.name}
                  subtitle={`${product.price.toFixed(2)} €`}
                  image={product.image || '/icons/product.png'}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stores Section */}
      {stores.length > 0 && (
        <div className="space-y-3">
          <Typography variant="subtitle" className="text-base font-semibold text-vapo-purple-primary">
            Magasins ({stores.length})
          </Typography>
          <div className="grid grid-cols-3 gap-4">
            {stores.map((store) => (
              <div
                key={store.id}
                onClick={() => navigate(`/shop/${store.id}`)}
                className="cursor-pointer"
              >
                <StoreCard
                  name={store.name}
                  image={store.image || '/icons/store.svg'}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {totalResults === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Typography variant="subtitle" className="text-gray-500 mb-2">
            Aucun résultat trouvé
          </Typography>
          <Typography variant="body" className="text-sm text-gray-400 mb-4">
            Essayez avec d'autres mots-clés
          </Typography>
          <Button onClick={() => navigate('/')} variant="outline">
            Retour à l'accueil
          </Button>
        </div>
      )}
    </div>
  );
}
