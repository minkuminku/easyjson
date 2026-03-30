import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'EasyJSON | Home',
  },
  {
    path: 'about',
    component: About,
    title: 'EasyJSON | About',
  },
  {
    path: 'contact',
    component: Contact,
    title: 'EasyJSON | Contact',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
