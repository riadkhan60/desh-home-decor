'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type SettingsData = {
  insideDhakaShipping: number;
  outsideDhakaShipping: number;
  minimumShippingCostInsideDhaka: number;
  minimumShippingCostOutsideDhaka: number;
  maximuxShippingCostInsideDhaka: number;
  maximuxShippingCostOusideDhaka: number;
};

const DEFAULT_SETTINGS: SettingsData = {
  insideDhakaShipping: 70,
  outsideDhakaShipping: 180,
  minimumShippingCostInsideDhaka: 70,
  minimumShippingCostOutsideDhaka: 180,
  maximuxShippingCostInsideDhaka: 300,
  maximuxShippingCostOusideDhaka: 400,
};

// Get settings, create default if doesn't exist
export async function getSettings() {
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: DEFAULT_SETTINGS,
      });
    }

    return {
      success: true,
      data: {
        insideDhakaShipping: Number(settings.insideDhakaShipping),
        outsideDhakaShipping: Number(settings.outsideDhakaShipping),
        minimumShippingCostInsideDhaka: Number(
          settings.minimumShippingCostInsideDhaka
        ),
        minimumShippingCostOutsideDhaka: Number(
          settings.minimumShippingCostOutsideDhaka
        ),
        maximuxShippingCostInsideDhaka: Number(
          settings.maximuxShippingCostInsideDhaka
        ),
        maximuxShippingCostOusideDhaka: Number(
          settings.maximuxShippingCostOusideDhaka
        ),
      },
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      success: false,
      error: 'Failed to fetch settings',
      data: DEFAULT_SETTINGS,
    };
  }
}

// Admin: Update shipping charges
export async function updateShippingCharges(data: SettingsData) {
  try {
    const updateData = {
      insideDhakaShipping: String(data.insideDhakaShipping),
      outsideDhakaShipping: String(data.outsideDhakaShipping),
      minimumShippingCostInsideDhaka: String(data.minimumShippingCostInsideDhaka),
      minimumShippingCostOutsideDhaka: String(data.minimumShippingCostOutsideDhaka),
      maximuxShippingCostInsideDhaka: String(data.maximuxShippingCostInsideDhaka),
      maximuxShippingCostOusideDhaka: String(data.maximuxShippingCostOusideDhaka),
    };

    await prisma.settings.upsert({
      where: { id: 'default' },
      update: updateData,
      create: {
        id: 'default',
        ...updateData,
      },
    });

    revalidatePath('/admin/settings');
    revalidatePath('/checkout');
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to update shipping charges';
    console.error('Error updating shipping charges:', error);
    return { success: false, error: message };
  }
}
