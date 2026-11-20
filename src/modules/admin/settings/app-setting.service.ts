import { BadRequestException, Injectable } from '@nestjs/common';
import { AppSettingCoreService } from 'src/core/app-setting-core';
import { DeliverySlotCoreService } from 'src/core/delivery-slot-core';
import { AppSettingMessages } from 'src/shared/keys';
import { UpdateAppSettingsDto } from './dto/app-setting.dto';

const ALLOWED_SETTING_KEYS = new Set([
  'delivery_charge_express',
  'delivery_charge_eco',
  'min_order_value',
  'low_stock_threshold',
  'express_delivery_enabled',
]);

@Injectable()
export class AppSettingService {
  constructor(
    private appSettingCoreService: AppSettingCoreService,
    private deliverySlotCoreService: DeliverySlotCoreService,
  ) {}

  async getSettings() {
    const settings = await this.appSettingCoreService.findMany({
      orderBy: { key: 'asc' },
    });

    const deliverySlots = await this.deliverySlotCoreService.findMany({
      where: { isDeleted: false },
      orderBy: [{ isActive: 'desc' }, { createdAt: 'asc' }],
    });

    return { settings, deliverySlots };
  }

  async updateSettings(updateAppSettingsDto: UpdateAppSettingsDto) {
    const { deliverySlots, ...settingsDto } = updateAppSettingsDto;

    // ── App Settings ──────────────────────────────────────────
    const entries = Object.entries(settingsDto).filter(
      ([, value]) => typeof value !== 'undefined',
    );

    for (const [key] of entries) {
      if (!ALLOWED_SETTING_KEYS.has(key)) {
        throw new BadRequestException(AppSettingMessages.INVALID_KEY);
      }
    }

    const updatedSettings: any[] = [];

    for (const [key, value] of entries) {
      const item = await this.appSettingCoreService.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
      updatedSettings.push(item);
    }

    // ── Delivery Slots ────────────────────────────────────────
    const updatedSlots: any[] = [];

    if (deliverySlots?.length) {
      for (const slot of deliverySlots) {
        const { id, ...data } = slot;

        if (id) {
          const existing = await this.deliverySlotCoreService.findFirst({
            where: { id, isDeleted: false },
          });

          if (!existing) {
            throw new BadRequestException(
              `Delivery slot with id ${id} not found`,
            );
          }

          const updated = await this.deliverySlotCoreService.update({
            where: { id },
            data,
          } as any);

          updatedSlots.push(updated);
        } else {
          if (!slot.label || !slot.time) {
            throw new BadRequestException(
              'label and time are required to create a delivery slot',
            );
          }

          const created = await this.deliverySlotCoreService.create({
            data: {
              label: slot.label,
              time: slot.time,
              maxOrders: slot.maxOrders ?? 50,
              isActive: slot.isActive ?? true,
            },
          } as any);

          updatedSlots.push(created);
        }
      }
    }

    return {
      message: AppSettingMessages.UPDATED,
      settings: updatedSettings,
      deliverySlots: updatedSlots,
    };
  }

  // async deleteDeliverySlot(id: string) {
  //   const existing = await this.deliverySlotCoreService.findFirst({
  //     where: { id, isDeleted: false },
  //   });

  //   if (!existing) {
  //     throw new BadRequestException('Delivery slot not found');
  //   }

  //   await this.deliverySlotCoreService.update({
  //     where: { id },
  //     data: { isDeleted: true },
  //   } as any);

  //   return { message: AppSettingMessages.DELETED };
  // }
}