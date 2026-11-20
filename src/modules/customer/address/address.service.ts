import { BadRequestException, Injectable } from '@nestjs/common';
import { AddressCoreService } from 'src/core/address-core';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto';
import { AddressMessages } from 'src/shared/keys';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Injectable()
export class AddressService {
    constructor(private readonly addressCoreService: AddressCoreService) { }

    async getAllAddresses(param: {
        userId: string;
        baseQueryCoreDto: BaseQueryCoreDto;
        isDefault?: boolean;
    }) {
        const { userId, baseQueryCoreDto, isDefault } = param;

        const whereQuery = {
            userId,
            isDeleted: false,
            ...(isDefault !== undefined && { isDefault }),
        };

        const addresses = await this.addressCoreService.findPaginate(
            baseQueryCoreDto,
            whereQuery,
        );

        return addresses;
    }

    async getAddressById(id: string, userId: string) {
        const address = await this.addressCoreService.findFirst({
            where: {
                id,
                userId,
                isDeleted: false,
            },
        });

        if (!address) {
            throw new BadRequestException(AddressMessages.NOT_FOUND);
        }

        return address;
    }

    async createAddress(userId: string, createAddressDto: CreateAddressDto) {
        const existingCount = await this.addressCoreService.getCount({
            where: { userId, isDeleted: false },
        });

        const isFirstAddress = existingCount === 0;
        const isDefault = isFirstAddress ? true : !!createAddressDto.isDefault;

        if (isDefault) {
            await this.unsetCurrentDefault(userId);
        }

        const address = await this.addressCoreService.create({
            data: {
                ...createAddressDto,
                userId,
                isDefault,
            },
        });

        return address;
    }

    async updateAddress(
        id: string,
        userId: string,
        updateAddressDto: UpdateAddressDto,
    ) {
        await this.getAddressById(id, userId);

        if (updateAddressDto.isDefault) {
            await this.unsetCurrentDefault(userId);
        }

        const address = await this.addressCoreService.update({
            where: { id },
            data: { ...updateAddressDto },
        });

        return address;
    }

    async deleteAddress(id: string, userId: string) {
        const address = await this.getAddressById(id, userId);

        const addressCount = await this.addressCoreService.getCount({
            where: { userId, isDeleted: false },
        });

        if (addressCount <= 1) {
            throw new BadRequestException(
                AddressMessages.CANNOT_DELETE_LAST_ADDRESS,
            );
        }

        await this.addressCoreService.update({
            where: { id },
            data: { isDeleted: true, isDefault: false },
        });

        if (address.isDefault) {
            const nextAddress = await this.addressCoreService.findFirst({
                where: { userId, isDeleted: false, id: { not: id } },
                orderBy: { createdAt: 'desc' },
            });

            if (nextAddress) {
                await this.addressCoreService.update({
                    where: { id: nextAddress.id },
                    data: { isDefault: true },
                });
            }
        }

        return { message: AddressMessages.DELETED_SUCCESS };
    }

    async setDefaultAddress(id: string, userId: string) {
        const address = await this.getAddressById(id, userId);

        if (address.isDefault) {
            return {
                message: AddressMessages.ALREADY_DEFAULT,
                address,
            };
        }

        await this.unsetCurrentDefault(userId);

        const updatedAddress = await this.addressCoreService.update({
            where: { id },
            data: { isDefault: true },
        });

        return updatedAddress;
    }

    private async unsetCurrentDefault(userId: string) {
        await this.addressCoreService.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false },
        });
    }
}
