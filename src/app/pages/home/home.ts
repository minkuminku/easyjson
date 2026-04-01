import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { JsonEndpointCatalogService } from '../../services/json-endpoint-catalog.service';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatCardModule, MatChipsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly jsonEndpointCatalog = inject(JsonEndpointCatalogService);

  protected readonly staticJsonLinks = this.jsonEndpointCatalog.getStaticCards();
  protected readonly apiLinks = this.jsonEndpointCatalog.getApiCards();
}
