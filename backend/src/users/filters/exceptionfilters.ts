/*
https://docs.nestjs.com/exception-filters#built-in-http-exceptions
Auto generated with :  npx nest generate filter exception_filter 

*/
import { HttpException, ArgumentsHost, Catch, ExceptionFilter, ExecutionContext } from '@nestjs/common';
/*
BadRequestException: Bad Request Exception
  response: {
    message: [
      'text should not be empty',
      'text must be longer than or equal to 1 characters'
    ],
    error: 'Bad Request',
    statusCode: 400
  },
  status: 400,
  options: {}
}
*/
@Catch()//if user sent wrong data in postman in chat (filter ValidationPipe() in chat)
export class ExceptionFilter_ws {
    catch(exception: HttpException, host: ExecutionContext) {
        try {
            const context_type = host.getType();
            if (context_type == "ws") {
                const ctx = host.switchToWs();
                const client = ctx.getClient();
                const res = exception.getResponse()
                client.emit('error_message', res);
                return;
            }
        }
        catch
        {
            return "atabiti-backend: error in host"
        }
    }
}