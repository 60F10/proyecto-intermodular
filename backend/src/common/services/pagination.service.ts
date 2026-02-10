import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { PaginatedResponse } from '../dto/paginated-response.interface';

@Injectable()
export class PaginationService {
  async paginate<T extends { id: string }>(
    query: SelectQueryBuilder<any>,
    paginationDto: PaginationQueryDto,
  ): Promise<PaginatedResponse<T>> {
    const page = paginationDto.page || 1;
    const limit = Math.min(paginationDto.limit || 10, 100); // Max 100
    const skip = (page - 1) * limit;

    // Aplicar orden
    if (paginationDto.sortBy) {
      query.orderBy(
        `${query.alias}.${paginationDto.sortBy}`,
        paginationDto.sortOrder || 'DESC',
      );
    }

    // Obtener total y datos
    const [data, total] = await query
      .take(limit)
      .skip(skip)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async paginateRepository<T extends { id: string }>(
    repository: Repository<any>,
    paginationDto: PaginationQueryDto,
    where?: any,
  ): Promise<PaginatedResponse<T>> {
    const page = paginationDto.page || 1;
    const limit = Math.min(paginationDto.limit || 10, 100);
    const skip = (page - 1) * limit;

    const [data, total] = await repository.findAndCount({
      where,
      skip,
      take: limit,
      order: {
        [paginationDto.sortBy || 'createdAt']: paginationDto.sortOrder || 'DESC',
      } as any,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }
}
