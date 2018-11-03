import { Component, ViewChild } from '@angular/core';
import { Tabs } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  @ViewChild('myTabs') tabRef: Tabs;

  tabOne: any = HomePage;
  // tabTwo: any = OrderListPage
  // tabThr: any = GoodsPage

  constructor() { }

  //ionViewDidLoad() { this.tabRef.select(2); }

}
