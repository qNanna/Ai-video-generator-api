import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest()

    return next
      .handle()
      .pipe(
        tap(() => {
          console.log('\x1b[33m%s\x1b[0m', `Request end: UID${req.user?.id || 'unknown'} X-${req.method} "${req.url}" ${Date.now() - now}ms`);
        }),
        // map((data) => ({ data, duration: `${context.getHandler().name}" ${Date.now() - now}ms` })),
      );
  }
}