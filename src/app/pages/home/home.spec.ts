import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
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
