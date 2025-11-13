import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { usePaymentMethodsMutations } from '@/app/user/hooks/use-payment-methods';

const paymentMethodSchema = z.object({
  type: z.enum(['card', 'paypal', 'other']),
  provider: z.string().min(1, 'Le fournisseur est requis'),
  token: z.string().min(1, 'Le token est requis'),
  last4: z.string().optional(),
  cardBrand: z.string().optional(),
  expiryMonth: z.number().min(1).max(12).optional(),
  expiryYear: z.number().min(2024).optional(),
});

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

interface PaymentMethodFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentMethodForm({ onSuccess, onCancel }: PaymentMethodFormProps) {
  const { createPaymentMethod } = usePaymentMethodsMutations();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: 'card',
      provider: '',
      token: '',
      last4: '',
      cardBrand: '',
    },
  });

  const paymentType = watch('type');

  const onSubmit = async (data: PaymentMethodFormValues) => {
    try {
      await createPaymentMethod.mutateAsync(data);
      onSuccess();
    } catch (error) {
      console.error('Error saving payment method:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de paiement
            </label>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="border border-gray-300">
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Carte bancaire</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <span className="text-red-500 text-xs mt-1">{errors.type.message}</span>
            )}
          </div>
        )}
      />

      <Controller
        name="provider"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fournisseur
            </label>
            <Input
              {...field}
              placeholder={paymentType === 'card' ? 'Visa, Mastercard, etc.' : 'PayPal, etc.'}
              className="border border-gray-300"
            />
            {errors.provider && (
              <span className="text-red-500 text-xs mt-1">{errors.provider.message}</span>
            )}
          </div>
        )}
      />

      <Controller
        name="token"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Token de paiement
            </label>
            <Input
              {...field}
              placeholder="tok_..."
              className="border border-gray-300"
              type="password"
            />
            {errors.token && (
              <span className="text-red-500 text-xs mt-1">{errors.token.message}</span>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Le token sera généré par le processeur de paiement
            </p>
          </div>
        )}
      />

      {paymentType === 'card' && (
        <>
          <Controller
            name="last4"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  4 derniers chiffres (optionnel)
                </label>
                <Input
                  {...field}
                  placeholder="1234"
                  maxLength={4}
                  className="border border-gray-300"
                />
                {errors.last4 && (
                  <span className="text-red-500 text-xs mt-1">{errors.last4.message}</span>
                )}
              </div>
            )}
          />

          <Controller
            name="cardBrand"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marque de la carte (optionnel)
                </label>
                <Input
                  {...field}
                  placeholder="visa, mastercard, etc."
                  className="border border-gray-300"
                />
                {errors.cardBrand && (
                  <span className="text-red-500 text-xs mt-1">{errors.cardBrand.message}</span>
                )}
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="expiryMonth"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mois d'expiration
                  </label>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    max="12"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="MM"
                    className="border border-gray-300"
                  />
                  {errors.expiryMonth && (
                    <span className="text-red-500 text-xs mt-1">{errors.expiryMonth.message}</span>
                  )}
                </div>
              )}
            />

            <Controller
              name="expiryYear"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Année d'expiration
                  </label>
                  <Input
                    {...field}
                    type="number"
                    min="2024"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="YYYY"
                    className="border border-gray-300"
                  />
                  {errors.expiryYear && (
                    <span className="text-red-500 text-xs mt-1">{errors.expiryYear.message}</span>
                  )}
                </div>
              )}
            />
          </div>
        </>
      )}

      <div className="flex gap-4 mt-6">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={createPaymentMethod.isPending}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          variant="vapo"
          className="flex-1"
          disabled={createPaymentMethod.isPending}
        >
          {createPaymentMethod.isPending ? 'Enregistrement...' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
}
