import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import * as classTransformer from 'class-transformer';
import { map, Observable } from 'rxjs';

export function TransformDTO<T>(
  classDTO: classTransformer.ClassConstructor<T>,
) {
  return UseInterceptors(new TransformDTOInterceptor(classDTO));
}

@Injectable()
export class TransformDTOInterceptor<T> implements NestInterceptor {
  constructor(
    private readonly classDTO: classTransformer.ClassConstructor<T>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && Object.prototype.hasOwnProperty.call(data, 'hasNextPage')) {
          const { items, hasNextPage, pageNumber } = data;
          return {
            message: 'success',
            data: classTransformer.plainToInstance(this.classDTO, items, {
              excludeExtraneousValues: true,
              enableImplicitConversion: true,
            }),
            hasNextPage,
            pageNumber,
          };
        }

        const transformed = classTransformer.instanceToInstance(data);

        return {
          message: 'success',
          data: classTransformer.plainToInstance(this.classDTO, transformed, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          }),
        };
      }),
    );
  }
}
