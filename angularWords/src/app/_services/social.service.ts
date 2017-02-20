import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { UrlService } from './url.service';
import { AuthenticationService } from './authentication.service';

import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';

@Injectable()
export class SocialService {
  private socket;
  private currentUser;
  constructor(private urlService : UrlService,private authService: AuthenticationService){
      this.currentUser = this.authService.getCurrentUser();
  }
  
  friendConnected() {
    let observable = new Observable(observer => {
      this.socket = io(this.urlService.api());
      this.socket.emit('online',this.currentUser.name);

      this.socket.on('friendConnected', (data) => {
        console.log("Somenone connected... reloading friends")
        observer.next(data);    
      });
      this.socket.on('friendDisconnected', (data) => {
        console.log("Somenone disconnected... reloading friends")
        observer.next(data);    
      });
      return () => {
        this.socket.emit('offline',this.currentUser.name); 
        this.socket.disconnect();
      };  
    })     
    return observable;
  }

  requestSended(sender, reciever){
      this.socket.emit('requestSended',{sender: sender, reciever: reciever});
  }

  requestAccepted(accepter, accepted){
      this.socket.emit('requestAccepted',{accepter: accepter, accepted: accepted});
  }   
}