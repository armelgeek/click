import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { forwardRef, useImperativeHandle } from 'react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { useAddressesMutations } from '@/app/user/hooks/use-addresses';
import { Address } from '@/shared/types/api.types';
import { useSession } from '@/shared/config/auth.config';

const addressSchema = z.object({
  label: z.string().min(1, 'Le libellé est requis'),
  streetAddress: z.string().min(1, 'L\'adresse est requise'),
  city: z.string().min(1, 'La ville est requise'),
  state: z.string().min(1, 'La région est requise'),
  postalCode: z.string().min(1, 'Le code postal est requis'),
  country: z.string().min(1, 'Le pays est requis'),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  address?: Address | null;
  onSuccess: () => void;
  onCancel?: () => void;
  hideButtons?: boolean;
}

export interface AddressFormHandle {
  submit: () => Promise<void>;
  isValid: () => Promise<boolean>;
}

export const AddressForm = forwardRef<AddressFormHandle, AddressFormProps>(
  ({ address, onSuccess, onCancel, hideButtons = false }, ref) => {
    const { data: session } = useSession();
    const { createAddress, updateAddress } = useAddressesMutations();

    const {
      control,
      handleSubmit,
      trigger,
      formState: { errors },
    } = useForm<AddressFormValues>({
      resolver: zodResolver(addressSchema),
      defaultValues: {
        label: address?.label || '',
        streetAddress: address?.streetAddress || '',
        city: address?.city || '',
        state: address?.state || '',
        postalCode: address?.postalCode || '',
        country: address?.country || 'France',
      },
    });

    const onSubmit = async (data: AddressFormValues) => {
      try {
        if (address) {
          await updateAddress.mutateAsync({
            addressId: address.id,
            payload: {
              ...data,
              userId: session?.user?.id,
            },
          });
        } else {
          await createAddress.mutateAsync({ ...data, userId: session?.user?.id });
        }
        onSuccess();
      } catch (error) {
        console.error('Error saving address:', error);
      }
    };

    const isPending = createAddress.isPending || updateAddress.isPending;

    // Expose submit function to parent via ref
    useImperativeHandle(ref, () => ({
      submit: async () => {
        await handleSubmit(onSubmit)();
      },
      isValid: async () => {
        return await trigger();
      },
    }));

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="label"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Libellé de l'adresse
              </label>
              <Input
                {...field}
                placeholder="Domicile, Bureau, etc."
                className="border border-gray-300"
              />
              {errors.label && (
                <span className="text-red-500 text-xs mt-1">{errors.label.message}</span>
              )}
            </div>
          )}
        />

        <Controller
          name="streetAddress"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <Input
                {...field}
                placeholder="123 Rue de la République"
                className="border border-gray-300"
              />
              {errors.streetAddress && (
                <span className="text-red-500 text-xs mt-1">{errors.streetAddress.message}</span>
              )}
            </div>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="postalCode"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                <Input
                  {...field}
                  placeholder="75001"
                  className="border border-gray-300"
                />
                {errors.postalCode && (
                  <span className="text-red-500 text-xs mt-1">{errors.postalCode.message}</span>
                )}
              </div>
            )}
          />

          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <Input
                  {...field}
                  placeholder="Paris"
                  className="border border-gray-300"
                />
                {errors.city && (
                  <span className="text-red-500 text-xs mt-1">{errors.city.message}</span>
                )}
              </div>
            )}
          />
        </div>

        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Région
              </label>
              <Input
                {...field}
                placeholder="Île-de-France"
                className="border border-gray-300"
              />
              {errors.state && (
                <span className="text-red-500 text-xs mt-1">{errors.state.message}</span>
              )}
            </div>
          )}
        />

        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <Input
                {...field}
                placeholder="France"
                className="border border-gray-300"
              />
              {errors.country && (
                <span className="text-red-500 text-xs mt-1">{errors.country.message}</span>
              )}
            </div>
          )}
        />

        {!hideButtons && (
          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="vapo"
              className="flex-1"
              disabled={isPending}
            >
              {isPending ? 'Enregistrement...' : address ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        )}
      </form>
    );
  });
