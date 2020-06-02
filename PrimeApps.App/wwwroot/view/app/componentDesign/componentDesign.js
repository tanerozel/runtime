"use strict";angular.module("primeapps").controller("ComponentdesignController",["$rootScope","$scope","$mdDialog","$mdSidenav","$mdToast","$window","$localStorage","$cookies",function(t,e,a,o,n,i,s){function l(t,e){t.cancel=function(){e.cancel()}}var r=s.read("access_token"),d={module:"egitim_siniflari",logic_type:"and, or",two_way:"bool",many_to_many:"string",filter_logic:"string",fields:["sinif_adi","egitim_adi.egitim_katalogu.egitim_adi.primary","egitim_turu","egitim_firmasi","baslangic_tarihi","bitis_tarihi"]};e.mainGridOptions2={dataSource:{page:1,pageSize:5,serverPaging:!0,serverFiltering:!0,serverSorting:!0,transport:{read:function(e){$.ajax({url:"/api/record/find_custom",contentType:"application/json",dataType:"json",type:"POST",data:JSON.stringify(Object.assign(d,e.data)),success:function(t){e.success(t)},beforeSend:function(e){e.setRequestHeader("Authorization","Bearer "+r),e.setRequestHeader("X-Tenant-Id",t.user.tenant_id)}})}},schema:{data:"items",total:"count"}},filterable:{mode:"row"},sortable:!0,noRecords:!0,groupable:!0,pageable:!0,columns:[{field:"egitim_firmasi",title:"Eğitim Firması"},{field:"egitim_turu",title:"Eğitim Türü"}]},e.sideModalLeft=function(){t.buildToggler("sideModal","view/app/componentDesign/dialog2-sidenav.html")},e.filterModalOpen=function(){t.buildToggler("sideModal","view/app/componentDesign/add-view.html")},$(".ripple-effect").click(function(t){var e=$(this);0==e.find(".ink").length&&e.append("<span class='ink'></span>");var a=e.find(".ink");if(a.removeClass("animate"),!a.height()&&!a.width()){var o=Math.max(e.outerWidth(),e.outerHeight());a.css({height:o,width:o})}var n=t.pageX-e.offset().left-a.width()/2,i=t.pageY-e.offset().top-a.height()/2;a.css({top:i+"px",left:n+"px"}).addClass("animate")}),e.showAlert=function(t){a.show(a.alert().parent(angular.element(document.body)).clickOutsideToClose(!0).title("This is an alert title").textContent("You can specify some description text in here.").ariaLabel("Alert Dialog Demo").ok("Got it!").targetEvent(t))},e.showAdvanced=function(t){a.show({controller:l,templateUrl:"view/app/componentDesign/dialog1.html",parent:angular.element(document.body),targetEvent:t,clickOutsideToClose:!0,fullscreen:!1})},e.showAdvanced2=function(t){a.show({controller:l,templateUrl:"view/app/componentDesign/modal-with-step.html",parent:angular.element(document.body),targetEvent:t,clickOutsideToClose:!0,fullscreen:!1})},e.kendoToastOptions={animation:{open:{effects:"slideIn:left"},close:{effects:"slideIn:left",reverse:!0}}},e.kendoToastinfo=function(){e.kendoToast.show("Are you the 6 fingered man?","info")},e.kendoToastwarning=function(){e.kendoToast.show("My name is Inigo Montoya. You killed my father, prepare to die!","warning")},e.kendoToastsuccess=function(){e.kendoToast.show("Have fun storming the castle!","success")},e.kendoToasterror=function(){e.kendoToast.show("I do not think that word means what you think it means.","error")},e.dialogOptions={appendTo:"section#contentAll",modal:!0,animation:{open:{effects:"fade:in"},close:{effects:"fade:out"}},actions:[{text:"Skip this version"},{text:"Remind me later"},{text:"Install update",primary:!0}]},$("#module-views").kendoToolBar({items:[{type:"button",text:"<span>Another Action</span>",overflow:"auto",attributes:{"class":"btn active"}},{type:"button",text:"<span>Another Action</span>",overflow:"auto",attributes:{"class":"btn"}},{type:"button",text:"<span>Another Action</span>",overflow:"auto",attributes:{"class":"btn"}},{type:"button",text:"<span>Another Action</span>",overflow:"auto",attributes:{"class":"btn"}},{type:"button",text:"<span>Another Action</span>",overflow:"auto",attributes:{"class":"btn"}},{type:"button",text:"<span>Another Action</span>",overflow:"auto",attributes:{"class":"btn"}},{type:"button",text:"<span>Another Action</span>",overflow:"auto",attributes:{"class":"btn"}},{type:"button",text:"<span>Another Action</span>",overflow:"auto",attributes:{"class":"btn"}},{type:"button",text:"<span>Another Action</span>",overflow:"auto",attributes:{"class":"btn"}},{type:"button",text:"<span>Another Action</span>",overflow:"auto",attributes:{"class":"btn"}},{type:"button",text:"<span>Another Action</span>",overflow:"auto",attributes:{"class":"btn"}},{type:"button",text:"<span><i class='fas fa-plus'></i></span>",overflow:"never",attributes:{"class":"btn"}}]}),$("#percentage").kendoNumericTextBox({format:"p0",min:0,max:.1,step:.01}),$("#datetimepicker").kendoDateTimePicker({value:new Date,dateInput:!0}),$("#optionallist").kendoListBox({connectWith:"selectedlist",toolbar:{tools:["transferTo","transferFrom","transferAllTo","transferAllFrom"]}}),$("#selectedlist").kendoListBox(),$("#optionallist2").kendoListBox({draggable:!0,connectWith:"selectedlist2",dropSources:["selectedlist2"]}),$("#selectedlist2").kendoListBox({draggable:!0,connectWith:"optionallist2",dropSources:["optionallist2"]}),e.selectOptions1={draggable:!0,dataTextField:"name",dataValueField:"id",dropSources:["sag"],connectWith:"sag",dataSource:[{name:"Galip ÇEVRİK",id:1},{name:"Galip ÇEVRİK",id:2},{name:"Galip ÇEVRİK",id:3},{name:"Galip ÇEVRİK",id:4}]},e.selectOptions2={draggable:!0,dataTextField:"name",dataValueField:"id",dropSources:["sol"],connectWith:"sol"},$(".sortable-list").kendoSortable({hint:function(t){return t.clone().addClass("sortable-list-hint")},placeholder:function(t){return t.clone().addClass("sortable-list-placeholder").text("Drop Here")},cursorOffset:{top:-10,left:20}}),$("#multipleselect").kendoMultiSelect({autoClose:!1}).data("kendoMultiSelect"),$("#datepicker").kendoDatePicker(),$("#dropdowntree").kendoDropDownTree(),$("#phone_number").kendoMaskedTextBox({mask:"(999) 000-0000"}),$("#timepicker").kendoTimePicker({dateInput:!0}),$("#daterangepicker").kendoDateRangePicker(),$("#primaryTextButton").kendoButton(),$("#textButton").kendoButton(),$("#primaryDisabledButton").kendoButton({enable:!1}),$("#disabledButton").kendoButton({enable:!1}),$("#iconTextButton").kendoButton({icon:"filter"}),$("#kendoIconTextButton").kendoButton({icon:"filter-clear"}),$("#iconButton").kendoButton({icon:"refresh"}),$("#select-period").kendoButtonGroup(),$("#tabstrip").kendoTabStrip({animation:{open:{effects:"fadeIn"}}}),$("#toolbar").kendoToolBar({items:[{type:"button",text:"Button"},{type:"button",text:"Toggle Button",togglable:!0},{type:"splitButton",text:"Insert",menuButtons:[{text:"Insert above",icon:"insert-up"},{text:"Insert between",icon:"insert-middle"},{text:"Insert below",icon:"insert-down"}]},{type:"separator"},{template:"<label for='dropdown'>Format:</label>"},{template:"<input id='dropdown' style='width: 150px;' />",overflow:"never"},{type:"separator"},{type:"buttonGroup",buttons:[{icon:"align-left",text:"Left",togglable:!0,group:"text-align"},{icon:"align-center",text:"Center",togglable:!0,group:"text-align"},{icon:"align-right",text:"Right",togglable:!0,group:"text-align"}]},{type:"buttonGroup",buttons:[{icon:"bold",text:"Bold",togglable:!0},{icon:"italic",text:"Italic",togglable:!0},{icon:"underline",text:"Underline",togglable:!0}]},{type:"button",text:"Action",overflow:"always"},{type:"button",text:"Another Action",overflow:"always"},{type:"button",text:"Something else here",overflow:"always"}]}),$("#calendar").kendoCalendar(),e.mainGridOptions={dataSource:{type:"odata-v4",page:1,pageSize:5,serverPaging:!0,serverFiltering:!0,serverSorting:!0,transport:{read:{url:"/api/user/find",type:"GET",dataType:"json",beforeSend:t.beforeSend()}},schema:{data:"items",total:"count"}},filterable:{mode:"row"},sortable:!0,noRecords:!0,groupable:!0,pageable:!0,columns:[{field:"email",title:"Email"},{field:"culture",title:"Culture"}]},$("#dateinput").kendoDateInput(),$("#slider").kendoSlider({increaseButtonTitle:"Right",decreaseButtonTitle:"Left",min:-10,max:10,smallStep:2,largeStep:1}),$("#notifications-switch").kendoSwitch(),$("#mail-switch").kendoSwitch({messages:{checked:"YES",unchecked:"NO"}}),$("#visible-switch").kendoSwitch({checked:!0}),$("#name-switch").kendoSwitch();var c=["Albania","Andorra","Armenia","Austria","Azerbaijan","Belarus","Belgium","Bosnia & Herzegovina","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark","Estonia","Finland","France","Georgia","Germany","Greece","Hungary","Iceland","Ireland","Italy","Kosovo","Latvia","Liechtenstein","Lithuania","Luxembourg","Macedonia","Malta","Moldova","Monaco","Montenegro","Netherlands","Norway","Poland","Portugal","Romania","Russia","San Marino","Serbia","Slovakia","Slovenia","Spain","Sweden","Switzerland","Turkey","Ukraine","United Kingdom","Vatican City"];$("#countries").kendoAutoComplete({dataSource:c,filter:"startswith",separator:", "}),$("#ticketsForm").kendoValidator().data("kendoValidator"),$("#scheduler").kendoScheduler({date:new Date("2013/6/13"),startTime:new Date("2013/6/13 07:00 AM"),height:400,views:["day",{type:"workWeek",selected:!0},"week","month","agenda",{type:"timeline",eventHeight:50}],timezone:"Etc/UTC"}),setTimeout(function(){e.toolbarOptions={items:[{template:"<md-button class='btn btn-secondary' aria-label='Send E-mail' > <i class='fas fa-envelope'></i> <span>Send E-mail</span></md-button>",overflowTemplate:"<md-button class='action-dropdown-item'><i class='fas fa-home'></i><span>Test</span></md-button>",overflow:"auto"},{template:"<md-button class='btn btn-secondary' aria-label='Send E-mail' > <i class='fas fa-envelope'></i> <span>Send E-mail</span></md-button>",overflowTemplate:"<md-button class='action-dropdown-item'><i class='fas fa-home'></i><span>Test</span></md-button>",overflow:"auto"},{template:"<md-button class='btn btn-secondary' aria-label='Send E-mail' > <i class='fas fa-envelope'></i> <span>Send E-mail</span></md-button>",overflowTemplate:"<md-button class='action-dropdown-item'><i class='fas fa-home'></i><span>Test</span></md-button>",overflow:"auto"},{template:"<md-button class='btn btn-secondary' aria-label='Send E-mail' > <i class='fas fa-envelope'></i> <span>Send E-mail</span></md-button>",overflowTemplate:"<md-button class='action-dropdown-item'><i class='fas fa-home'></i><span>Test</span></md-button>",overflow:"auto"},{template:"<md-button class='btn btn-secondary' aria-label='Send E-mail' > <i class='fas fa-envelope'></i> <span>Send E-mail</span></md-button>",overflowTemplate:"<md-button class='action-dropdown-item'><i class='fas fa-home'></i><span>Test</span></md-button>",overflow:"auto"},{template:"<md-button class='btn btn-secondary' aria-label='Send E-mail' > <i class='fas fa-envelope'></i> <span>Send E-mail</span></md-button>",overflowTemplate:"<md-button class='action-dropdown-item'><i class='fas fa-home'></i><span>Test</span></md-button>",overflow:"auto"},{template:"<md-button class='btn btn-secondary' aria-label='Send E-mail' > <i class='fas fa-envelope'></i> <span>Send E-mail</span></md-button>",overflowTemplate:"<md-button class='action-dropdown-item'><i class='fas fa-home'></i><span>Test</span></md-button>",overflow:"auto"},{template:"<md-button class='btn btn-secondary' aria-label='Send E-mail' > <i class='fas fa-envelope'></i> <span>Send E-mail</span></md-button>",overflowTemplate:"<md-button class='action-dropdown-item'><i class='fas fa-home'></i><span>Test</span></md-button>",overflow:"auto"}]}},100),angular.element(i).bind("resize",function(){}),e.materialToast=function(t){n.show(n.simple().textContent("Marked as read").action("UNDO").position("bottom right").actionKey("z").theme(t).hideDelay(0))}}]);