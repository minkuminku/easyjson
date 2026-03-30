import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contact',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {}
