import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificatesComponent } from './certificates.component';

describe('CertificatesComponent', () => {
  let component: CertificatesComponent;
  let fixture: ComponentFixture<CertificatesComponent>;

  beforeAll(() => {
    const mockRequire: any = require;

    const mockContext = (request: string): string => {
      if (request === './20240101-AVANADE-A3449FF1.pdf') {
        return 'assets/20240101-AVANADE-A3449FF1.pdf';
      }

      return 'assets/mock.pdf';
    };

    mockContext.keys = () => ['./20240101-AVANADE-A3449FF1.pdf', './cmr/20191203-conclusao-CMR.pdf'];
    mockRequire.context = jest.fn(() => mockContext);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.certificates.length).toBeGreaterThan(0);
  });
});
