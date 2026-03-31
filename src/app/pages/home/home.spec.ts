import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    httpTestingController.expectOne('/api/request-stats').flush({
      'mock-users': 0,
      'sample-orders': 0,
      'json-datatypes-demo': 0,
      'nested-store-catalogs': 0,
    });
    await fixture.whenStable();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the nested store catalogs example', () => {
    expect(
      component['jsonLinks'].some((item) => item.path === '/data/nested-store-catalogs.json'),
    ).toBe(true);
  });

  it('should render the quick usage guidance', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Open an endpoint and inspect the raw JSON instantly.');
    expect(compiled.textContent).toContain('GET /sample-orders?limit=2');
  });
});
