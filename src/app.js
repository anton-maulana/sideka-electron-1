import os from 'os'; // native node.js module
import $ from 'jquery';
import { remote } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import env from './env';
import dataapi from './dataapi/dataapi';
import datapost from './helpers/datapost';
import { initializeOnlineStatusImg } from './helpers/misc'; 
import request from 'request';
import moment from 'moment';

console.log('Loaded environment variables:', env);

var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());
var auth = dataapi.getActiveAuth();
var displayAuth = function() {
    if(auth == null){
        $("title").html("Sideka");
        $("#login-form").removeClass("hidden")
        $("#app-menu").addClass("hidden")
    } else {
        $("title").html("Sideka - " + auth.desa_name);
        $("#login-form").addClass("hidden")
        $("#app-menu").removeClass("hidden")
        $("#desa-name").html(auth["desa_name"]);
    }
}

var showPost = function(data,desas){
    var $xml = $(data);
    var items = [];
    $xml.find("item").each(function(i) {
        if (i === 30) return false;
        var $this = $(this);

        items.push({
            title: $this.find("title").text(), 
            link:$this.find("link").text(),
            description: $this.find("description").text(),
            pubDate: $this.find("pubDate").text()
        });                
    });
    var searchDiv = document.createElement("div");
    moment.locale("id");
    $.each(items, function(i, item){
        var item = items[i];
        var date = moment(new Date(item.pubDate));
        var dateString = date.fromNow();
        if(date.isBefore(moment().startOf("day").subtract(3, "day"))){
            dateString = date.format("LL");
        }
        var feedPost = $("#feed-post-template").clone().removeClass("hidden");
        $("a", feedPost).attr("href", item.link);
        $("h4", feedPost).html(item.title);
        $("p", feedPost).html(item.description);
        $("span.feed-date", feedPost).html(dateString);
        $(".panel-container").append(feedPost);
        datapost.getDetail(searchDiv, item.link, function(image, title){
            if(image){
                var style = 'background-image: url(\':image:\'); display: block; opacity: 1;'.replace(":image:", image);
                $(".entry-image", feedPost).attr("style", style);
            }
            var itemDomain = extractDomain(item.link);
            var desa = desas.filter(d => d.domain == itemDomain)[0];
            if(desa)
                $(".desa-name", feedPost).html(desa.desa);
        })
    });
}

function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}

document.addEventListener('DOMContentLoaded', function () {
    displayAuth();
    $.getJSON("http://api.sideka.id/desa", function(desas){
        $.get({
            url: "http://kabar.sideka.id/feed",
            dataType: "xml",
            success: function(data) {
                showPost(data,desas);          
                datapost.saveContent("post",(new XMLSerializer()).serializeToString(data));            
            }
        });
    }).fail(function(){
         $.get({
            url: datapost.getDir("post"),
            dataType: "xml",
            success: function(data) {
                showPost(data,"");              
            }
        })
    });

    $("#login-form form").submit(function(){
        var user = $("#login-form input[name='user']").val();
        var password = $("#login-form input[name='password']").val();
        $("#login-form .error-message").addClass("hidden");
        dataapi.login(user, password, function(err, response, body){
            console.log(err, response, body);
            if(!err && body.success){
                auth = body;
                dataapi.saveActiveAuth(auth);
                displayAuth();
            } else {
                var message = "Terjadi kesalahan";
                if(!body.success)
                    message = "User atau password Anda salah";
                $("#login-form .error-message").removeClass("hidden").html(message);
            }
        });
        return false;
    });
    
    $("#logout-link").click(function(){
        auth = null;
        dataapi.saveActiveAuth(null);
        displayAuth();
        return false;
    });
    
    initializeOnlineStatusImg($("img.brand")[0]);

});
