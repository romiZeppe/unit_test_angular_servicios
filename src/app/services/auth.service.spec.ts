import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { ProductsService } from './product.service';
import { TokenService } from './token.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { Auth } from '../models/auth.model';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;
  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
            ProductsService,
            TokenService,
            {
                provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
            },

        ]
    });
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
});
afterEach(() => {
    httpController.verify();
})

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    describe('Login', ()=> {
        it('should be return a token', (doneFn) => {
            const mockData: Auth = {
                access_token: '56565656'
            };
            const email = 'romisolbarros@gmail.com';
            const pass = 'PASS1234'
            service.login(email, pass).subscribe( res => {
                expect(res).toEqual(mockData);
                doneFn();
            })
            const url = `${environment.API_URL}/api/v1/auth/login`;
            const request = httpController.expectOne(url);
            request.flush(mockData);
        });
        it('should be save a token', (doneFn) => {
            const mockData: Auth = {
                access_token: '56565656'
            };
            const email = 'romisolbarros@gmail.com';
            const pass = 'PASS1234';
            spyOn(tokenService, 'saveToken').and.callThrough();
            service.login(email, pass).subscribe( res => {
                expect(res).toEqual(mockData);
                expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
                expect(tokenService.saveToken).toHaveBeenCalledOnceWith('56565656');
                doneFn();
            })
            const url = `${environment.API_URL}/api/v1/auth/login`;
            const request = httpController.expectOne(url);
            request.flush(mockData);
        });
    })
}); 