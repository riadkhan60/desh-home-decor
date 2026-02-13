'use client';

import { useState } from 'react';
import {
  updateShippingCharges,
  type SettingsData,
} from '@/lib/actions/settings';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface SettingsFormProps {
  initialSettings: SettingsData;
}

const formFields: {
  key: keyof SettingsData;
  label: string;
  placeholder: string;
  hint: string;
}[] = [
  {
    key: 'insideDhakaShipping',
    label: 'Inside Dhaka (৳)',
    placeholder: '70',
    hint: 'Base delivery charge for orders inside Dhaka',
  },
  {
    key: 'outsideDhakaShipping',
    label: 'Outside Dhaka (৳)',
    placeholder: '180',
    hint: 'Base delivery charge for orders outside Dhaka',
  },
  {
    key: 'minimumShippingCostInsideDhaka',
    label: 'Minimum Shipping Inside Dhaka (৳)',
    placeholder: '70',
    hint: 'Minimum delivery charge inside Dhaka',
  },
  {
    key: 'minimumShippingCostOutsideDhaka',
    label: 'Minimum Shipping Outside Dhaka (৳)',
    placeholder: '180',
    hint: 'Minimum delivery charge outside Dhaka',
  },
  {
    key: 'maximuxShippingCostInsideDhaka',
    label: 'Maximum Shipping Inside Dhaka (৳)',
    placeholder: '300',
    hint: 'Maximum delivery charge inside Dhaka',
  },
  {
    key: 'maximuxShippingCostOusideDhaka',
    label: 'Maximum Shipping Outside Dhaka (৳)',
    placeholder: '400',
    hint: 'Maximum delivery charge outside Dhaka',
  },
];

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState<Record<keyof SettingsData, string>>(
    Object.fromEntries(
      formFields.map((f) => [f.key, initialSettings[f.key].toString()])
    ) as Record<keyof SettingsData, string>
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    const payload: SettingsData = {
      insideDhakaShipping: parseFloat(formData.insideDhakaShipping) || 0,
      outsideDhakaShipping: parseFloat(formData.outsideDhakaShipping) || 0,
      minimumShippingCostInsideDhaka:
        parseFloat(formData.minimumShippingCostInsideDhaka) || 0,
      minimumShippingCostOutsideDhaka:
        parseFloat(formData.minimumShippingCostOutsideDhaka) || 0,
      maximuxShippingCostInsideDhaka:
        parseFloat(formData.maximuxShippingCostInsideDhaka) || 0,
      maximuxShippingCostOusideDhaka:
        parseFloat(formData.maximuxShippingCostOusideDhaka) || 0,
    };

    for (const [key, val] of Object.entries(payload)) {
      if (val < 0 || Number.isNaN(val)) {
        setMessage({
          type: 'error',
          text: `${key.replace(/([A-Z])/g, ' $1').trim()} must be a non-negative number`,
        });
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const result = await updateShippingCharges(payload);

      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Shipping charges updated successfully!',
        });
        router.refresh();
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to update settings',
        });
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-6 text-lg font-semibold">Delivery Charges</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {formFields.map(({ key, label, placeholder, hint }) => (
            <div key={key} className="space-y-2">
              <label htmlFor={key} className="text-sm font-medium">
                {label}
              </label>
              <input
                id={key}
                name={key}
                type="text"
                required
                value={formData[key]}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder={placeholder}
              />
              <p className="text-xs text-muted-foreground">{hint}</p>
            </div>
          ))}
        </div>
      </div>

      {message && (
        <div
          className={`rounded-lg p-4 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-destructive/10 text-destructive'
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-6 py-2.5 text-sm font-medium text-background transition hover:bg-foreground/90 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </button>
    </form>
  );
}
