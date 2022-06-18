import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import GestureDemo from './src/module1/pages/gesture-demo';
import Homepage from './src/module1/pages/homepage';
import RecyclerListviewDemo from './src/module1/pages/recycler-listview-demo1';
import RecyclerListviewDemo2 from './src/module1/pages/recycler-listview-demo2';
import RecyclerListviewDemo3 from './src/module1/pages/recycler-listview-demo3';

type routeItem = {
    name: string;
    component: any;
    options: NativeStackNavigationOptions;
    pageTitle: string;
}

export const module1: routeItem[] = [
  {name: 'Homepage', pageTitle: '主页', component: Homepage, options: {title: "主页"}},
  {name: 'GestureDemo', pageTitle: 'RN手势库、动画库示例', component: GestureDemo, options: {title: "拖拽、消息动画"}},
  {name: 'RecyclerListviewDemo', pageTitle: 'RecyclerListView 示例1', component: RecyclerListviewDemo, options: {}},
  {name: 'RecyclerListviewDemo2', pageTitle: 'RecyclerListView 示例2', component: RecyclerListviewDemo2, options: {}},
  {name: 'RecyclerListviewDemo3', pageTitle: 'RecyclerListView 示例3', component: RecyclerListviewDemo3, options: {}},
];
