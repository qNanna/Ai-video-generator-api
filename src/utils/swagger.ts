import { INestApplication, Injectable } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

@Injectable()
export class Swagger {
  public swaggerInit(app: INestApplication): any {
    try {
      const config = new DocumentBuilder()
        .setTitle('SOME NAME')
        // .setDescription('SOME NAME DESCRIPTION')
        .setVersion('1.0')
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Access token must be firebase idToken',
          },
          'access-token',
        )
        // .addServer('<URL>')
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('swagger', app, document, { customCss });
    } catch (error) {
      console.log('\x1b[31m%s\x1b[0m', `Swagger setup error! \n${error}`);
    }
  }
}

const customCss = `
* {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .buttons {
    margin: 10%;
    text-align: center;
  }
  .btn-hover, .swagger-ui .btn {
    width: 170px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    margin: 5px;
    height: 45px;
    text-align: center;
    border: none;
    background-size: 300% 100%;
    border-radius: 5px;
    moz-transition: all 0.4s ease-in-out;
    -o-transition: all 0.4s ease-in-out;
    -webkit-transition: all 0.4s ease-in-out;
    transition: all 0.4s ease-in-out;
  }
  .btn-hover:hover, .swagger-ui .btn:hover {
    background-position: 100% 0;
    moz-transition: all 0.4s ease-in-out;
    -o-transition: all 0.4s ease-in-out;
    -webkit-transition: all 0.4s ease-in-out;
    transition: all 0.4s ease-in-out;
  }
  .btn-hover:focus, .swagger-ui .btn:focus {
    outline: none;
  }
  .btn-hover.color, .swagger-ui .btn.color, .swagger-ui .btn, .swagger-ui .btn.btn-hover {
    background-image: linear-gradient(to right, #30dd8a, #2bb673, #25aae1, #40e495);
    box-shadow: 0 4px 15px 0 rgba(45, 54, 65, 0.75);
  }
  .empty, .swagger-ui .btn {
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .input-box {
    font-size: 16px;
    font-weight: 600;
    height: 55px;
    width: 250px;
  }
  .swagger-ui .scheme-container {
    background-image: linear-gradient(217deg, rgba(209, 41, 79, 0.8), rgba(255, 0, 0, 0) 70.71%), linear-gradient(127deg, rgba(19, 168, 217, 0.8), rgba(0, 255, 0, 0) 70.71%), linear-gradient(336deg, rgba(0, 0, 255, 0.8), rgba(0, 0, 255, 0) 70.71%);
  }
  .swagger-ui .wrapper {
    padding: 0 0px;
  }
  .swagger-ui .btn {
    border: 2px solid #49cc90;
  }
  .swagger-ui .btn.authorize {
    color: #ffffff;
  }
  .swagger-ui .btn.authorize svg {
    fill: #1addba;
  }
  .swagger-ui .auth-btn-wrapper .btn-done {
    background-image: linear-gradient(to right, #ed6ea0, #ec8c69, #f7186a, #FBB03B);
    border: 2px solid #ed7f81;
  }
  .swagger-ui .btn.cancel {
    background-image: linear-gradient(to right, #ed6ea0, #ec8c69, #f7186a, #FBB03B);
    border: 2px solid #ed7f81;
  }
  .swagger-ui .topbar {
    display: none;
  }
`;
