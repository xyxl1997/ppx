import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { AppUpdate } from '@ionic-native/app-update';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoadingProvider } from '../providers/loading/loading';
import { SearchPage } from '../pages/search/search';
import { PlayPage } from '../pages/play/play';


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    SearchPage,
    PlayPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    SearchPage,
    PlayPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoadingProvider,
    AppUpdate,
  ]
})
export class AppModule { }
