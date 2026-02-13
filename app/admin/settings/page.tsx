import { getSettings } from '@/lib/actions/settings';
import { SettingsForm } from '@/components/admin/settings-form';

export const metadata = {
  title: 'Settings - Admin',
  description: 'Manage site settings',
};

export default async function SettingsPage() {
  const result = await getSettings();
  const settings = result.data || {
    insideDhakaShipping: 70,
    outsideDhakaShipping: 180,
    minimumShippingCostInsideDhaka: 70,
    minimumShippingCostOutsideDhaka: 180,
    maximuxShippingCostInsideDhaka: 300,
    maximuxShippingCostOusideDhaka: 400,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage site-wide configurations and preferences
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
