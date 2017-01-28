import { Component } from '@angular/core';
import {AngularFire} from 'angularfire2'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service'

@Component({
  selector: 'login',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})
export class AuctionComponent {
  afRef: any;
  AuctionRef: any;
  userAuth;
  router;
  userService;
  auctionsList = [];
  myPostedAuctionsList = [];

  newAuctionObj = {
    title: "",
    minBid : "",
    url: "",
    qty: "",
    desc: "",
    lastMaxBid : "",
    postedBy: ""
  };

  constructor(private af: AngularFire, private _router: Router, private _userService: UserService) {
    this.afRef = af;
    this.router = _router;
    this.userService = _userService;
    this.userAuth = this.userService.getUserData();
    let authUserKey: String = this.userAuth.$key;
    this.AuctionRef = this.afRef.database.list("/auctions");
    this.AuctionRef.subscribe(auctions=>{
      this.auctionsList = auctions;
      this.auctionsList.forEach(auctionObj=>{
        if(auctionObj.postedBy == authUserKey){
          this.myPostedAuctionsList.push(auctionObj);
        }
      })

    });

  }

  postNewAuction(){
    if(this.newAuctionObj.title.trim()!="" && this.newAuctionObj.minBid.trim()!="" && this.newAuctionObj.qty.trim()!="" && this.newAuctionObj.desc.trim()!=""){
      console.log(this.newAuctionObj);
      this.newAuctionObj.lastMaxBid = "";
      this.newAuctionObj.postedBy =  this.userAuth.$key;
      this.AuctionRef.push(this.newAuctionObj)
        .then(data=>{
          this.newAuctionObj = {
            title: "",
            minBid : "",
            url: "",
            qty: "",
            desc: "",
            lastMaxBid : "",
            postedBy: "",
          };
          alert("Auction posted successfully");
        }, err=>{
          alert(err.message);
        })
    }
    else{
      alert("Please alert all required fields");
    }
  }

  applyBid(auctionObj){
    console.log(auctionObj);
  }

  logout() {
    this.userService.logoutUser();
  }
}
