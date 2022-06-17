import GestureDemo from './src/module1/pages/gesture-demo';
import Homepage from './src/module1/pages/homepage';

type routeItem = {
    name: string;
    component: any;
    options: any;
}

export const module1: routeItem[] = [
  {name: 'Homepage', component: Homepage, options: {}},
  {name: 'GestureDemo', component: GestureDemo, options: {}},
];
