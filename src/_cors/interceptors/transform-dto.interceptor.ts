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
        const transformed = classTransformer.instanceToInstance(data);

        const dto = classTransformer.plainToInstance(
          this.classDTO,
          transformed,
          {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          },
        );

        return {
          message: 'success',
          data: dto,
        };
      }),
    );
  }
}
