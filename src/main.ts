/**
 * Created by aleksander on 05.09.2017.
 */
import $ = require("jquery");
import * as Promise from "any-promise";
interface IUser {
    name:string;
    email:string,
    phone:string,
    picture:string
}

class Main{
private static users: IUser[] = [];
private static year: number = 1975;
    init(){
        $("#load-btn").click(()=>Main.loadUser());
    }
   static loadUser(email:string = "")
    {
        let promise = new Promise((resolve, reject) => {
        let url = 'https://randomuser.me/api/';
        if(email.length)
        {
            url+= '?seed='+email;
        }
            $.ajax({
                url: url,
                dataType: 'json',
                success: function(data) {
                    resolve(data);
                }
            });

        });

        promise
            .then(
                result => {

                    if(result.results.length > 0 && result.results[0])
                    {
                        let userReq = result.results[0];
                        let dob = new Date(Date.parse(userReq.dob));
                        let user: IUser = {
                            name: userReq.name.first,
                            phone:userReq.phone,
                            email:userReq.email,
                            picture:userReq.picture.large
                        };
                        if(dob.getFullYear() < Main.year)
                        {
                            Main.setUser(user);
                        }else {

                            Main.users.push(user);
                            Main.loadUser(userReq.email);

                        }
                    }else {
                        alert("Not user data");
                    }
                }
            );

    }

    static setUser(user: IUser)
    {
        $('#user .img img').attr('src',user.picture);
        $("#user .name").text(user.name);
        $("#user .phone").text(user.phone);
        $("#user .email").text(user.email);
        let promis = [];
        if(Main.users.length > 0)
        {
            $("#user_list").html("");
            Main.users.forEach((value,index)=>{

                let p  = new Promise((resolve, reject) => {
                    $("<span/>",{text: value.name}).appendTo("#user_list")
                });

                promis.push(p);
            });

            Promise.all(promis).then(val=> Main.users = []);
        }

    }

}
var m = new Main();

m.init();