import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { environment } from "src/environments/environment";
import { CreateProductDTO, Product, UpdateProductDTO } from "../models/product.model";
import { generateManyProducts, generateOneProduct } from "../models/product.mock";
import { ProductsService } from "./product.service";
import { HttpStatusCode, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "../interceptors/token.interceptor";
import { TokenService } from "./token.service";

describe('ProductsService', ()=> {
    let productService: ProductsService;
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
        productService = TestBed.inject(ProductsService);
        httpController = TestBed.inject(HttpTestingController);
        tokenService = TestBed.inject(TokenService);
    });
    afterEach(() => {
        httpController.verify();
    })
    it('should be created', () => {
        expect(productService).toBeTruthy();
    });

    describe('test for getAllSimple', () => {
        it('should return a products list', (doneFn) => {
            //Arrange -- que data necesitamos? hacer mock de la data
            const mockData: Product[] = generateManyProducts(2);
            //act
            productService.getAllSimple().subscribe((data) => {
                //assert
                expect(data.length).toEqual(mockData.length);
                expect(data).toEqual(mockData);
                doneFn();
            });

            //http config
            const url = `${environment.API_URL}/api/v1/products`;
            const request = httpController.expectOne(url);
            request.flush(mockData);
            httpController.verify();
        });
    });
    describe('test for getAll', () => {
        it('should return a products list', (doneFn) => {
            //Arrange -- que data necesitamos? hacer mock de la data
            const mockData: Product[] = generateManyProducts(2);
            spyOn(tokenService, 'getToken').and.returnValue(`123`);
            //act
            productService.getAll().subscribe((data) => {
                //assert
                expect(data.length).toEqual(mockData.length);
                //expect(data).toEqual(mockData);
                doneFn();
            });
            //http config
            const url = `${environment.API_URL}/api/v1/products`;
            const request = httpController.expectOne(url);
            const header = request.request.headers;
            expect(header.get('Authorization')).toEqual('Bearer 123');
            request.flush(mockData);
        });
        it('should return a products list with taxes', (doneFn) => {
            //Arrange -- que data necesitamos? hacer mock de la data
            const mockData: Product[] = [
                {
                    ...generateOneProduct(),
                    price: 100
                },
                {
                    ...generateOneProduct(),
                    price: 200
                },
                {
                    ...generateOneProduct(),
                    price: 0
                },
                {
                    ...generateOneProduct(),
                    price: -100
                }
            ];
            //act
            productService.getAll().subscribe((data) => {
                //assert
                expect(data[0].taxes).toEqual(19);
                expect(data[1].taxes).toEqual(38);
                expect(data[2].taxes).toEqual(0);
                expect(data[3].taxes).toEqual(0);
                doneFn();
            });
            //http config
            const url = `${environment.API_URL}/api/v1/products`;
            const request = httpController.expectOne(url);
            request.flush(mockData);
        }); 
        it('should send query params limit 10 and offsetr 3', (doneFn) => {
            const mockData : Product[] = generateManyProducts(3);
            const limit = 10;
            const offset = 3;
            productService.getAll(limit,offset).subscribe((data) => {
                //assert
                expect(data.length).toEqual(mockData.length);
                //expect(data).toEqual(mockData);
                doneFn();
            });
            //http config
            const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
            const req = httpController.expectOne(url);
            req.flush(mockData);
            const params = req.request.params;
            expect(params.get('limit')).toEqual(`${limit}`)
            expect(params.get('offset')).toEqual(`${offset}`)
            
        });
    });
    describe('test for create' ,() => {
        it('should be create a product', (doneFn) => {
            const mockData = generateOneProduct();
            const dto: CreateProductDTO = {
                title: 'new title',
                price: 100,
                images: ['img'],
                description: 'descripcion',
                categoryId: 12
            }
            productService.create({...dto}).subscribe( data => {
                expect(data).toEqual(mockData);
                doneFn();
            });
            //http config
            const url = `${environment.API_URL}/api/v1/products`;
            const request = httpController.expectOne(url);
            request.flush(mockData);
            expect(request.request.body).toEqual(dto);
            expect(request.request.method).toEqual('POST');
        });
    });
    describe('test for put' ,() => {
        it('should be modified a product', (doneFn) => {
            const mockData = generateOneProduct();
            const id = '20';
            const dto: UpdateProductDTO = {
                title: 'new title',
                price: 98,
            }
            productService.update(id,{...dto}).subscribe( data => {
                expect(data).toEqual(mockData);
                doneFn();
            });
            //http config
            const url = `${environment.API_URL}/api/v1/products/${id}`;
            const request = httpController.expectOne(url);
            request.flush(mockData);
            expect(request.request.body).toEqual(dto);
            expect(request.request.method).toEqual('PUT');
        });
    });
    describe('test for delete' ,() => {
        it('should be delete a product', (doneFn) => {
            const id = '20';
            const mockData = true;
            productService.delete(id).subscribe( data => {
                expect(data).toEqual(mockData);
                doneFn();
            });
            //http config
            const url = `${environment.API_URL}/api/v1/products/${id}`;
            const request = httpController.expectOne(url);
            expect(request.request.method).toEqual('DELETE');
            request.flush(mockData);
        });
    });
    describe('test getOne', () => {
        it('should be return product', (doneFn) => {
            const id = '20';
            const mockData = generateOneProduct();
            productService.getOne(id).subscribe( data => {
                expect(data).toEqual(mockData);
                doneFn();
            });
            //http config
            const url = `${environment.API_URL}/api/v1/products/${id}`;
            const request = httpController.expectOne(url);
            expect(request.request.method).toEqual('GET');
            request.flush(mockData);
        });
        it('should be return not found', (doneFn) => {
            const id = '20';
            const mockmsg = `404 meesage`;
            const mockError = {
                status: HttpStatusCode.NotFound, //404
                statusText: mockmsg
            }
            productService.getOne(id).subscribe({
                error: (error) => {
                    expect(error).toEqual('El producto no existe');
                    doneFn();   
                }
            });
            //http config
            const url = `${environment.API_URL}/api/v1/products/${id}`;
            const request = httpController.expectOne(url);
            expect(request.request.method).toEqual('GET');
            request.flush(mockmsg, mockError);
        });
        it('should be return conflict', (doneFn) => {
            const id = '20';
            const mockmsg = `409 meesage`;
            const mockError = {
                status: HttpStatusCode.Conflict, //409
                statusText: mockmsg
            }
            productService.getOne(id).subscribe({
                error: (error) => {
                    expect(error).toEqual('Algo esta fallando en el server');
                    doneFn();   
                }
            });
            //http config
            const url = `${environment.API_URL}/api/v1/products/${id}`;
            const request = httpController.expectOne(url);
            expect(request.request.method).toEqual('GET');
            request.flush(mockmsg, mockError);
        });
        it('should be return unauthorized', (doneFn) => {
            const id = '20';
            const mockmsg = `401 meesage`;
            const mockError = {
                status: HttpStatusCode.Unauthorized, //401
                statusText: mockmsg
            }
            productService.getOne(id).subscribe({
                error: (error) => {
                    expect(error).toEqual('No estas permitido');
                    doneFn();   
                }
            });
            //http config
            const url = `${environment.API_URL}/api/v1/products/${id}`;
            const request = httpController.expectOne(url);
            expect(request.request.method).toEqual('GET');
            request.flush(mockmsg, mockError);
        });
    });

});