"use strict";angular.module("primeapps").factory("UserCustomShareService",["$http","config",function(e,r){return{get:function(t){return e.get(r.apiUrl+"user_custom_shares/get/"+t)},getAll:function(){return e.get(r.apiUrl+"user_custom_shares/get_all")},create:function(t){return e.post(r.apiUrl+"user_custom_shares/create",t)},update:function(t,u){return e.put(r.apiUrl+"user_custom_shares/update/"+t,u)},"delete":function(t){return e["delete"](r.apiUrl+"user_custom_shares/delete/"+t)},getUserGroups:function(){return e.get(r.apiUrl+"user_group/get_all")}}}]);