"use strict";angular.module("primeapps").factory("ReportsService",["$rootScope","$http","$filter","config","$q","ModuleService",function(e,t,r,a,o,i){var n={getAllReports:function(){return t.get(a.apiUrl+"report/get_all")},getAllCategory:function(){return t.get(a.apiUrl+"report/get_categories")},getReportData:function(t,r){var a={displayFileds:[],module:{}};return e.modules.forEach(function(e){t===e.id&&(a.module=e,e.fields.forEach(function(e){r.forEach(function(t){if(t.field==e.name){var r=e;r.colorder=t.order,a.displayFileds.push(r)}if("lookup"===e.data_type){var o=t.field.split(".");if(o.length>1&&e.name==o[0]){var r=e;r.colorder=t.order,a.displayFileds.push(r)}}})}))}),a},getAggregationsFields:function(e,t,a,o){return e.forEach(function(e){var u={fields:[e.aggregation_type+"("+e.field+")"],limit:1,offset:0,filters:o};i.findRecords(t,u).then(function(t){var o={name:e.field,type:e.aggregation_type,value:t.data[0][e.aggregation_type],label:r("translate")("Report."+e.aggregation_type)};a.forEach(function(e){o.name==e.name&&(n.formatFieldValue(e,o.value),e.aggregation=o)})})}),a},formatFieldValue:function(t,a){if(t.valueFormatted="",void 0!==a&&null!==a)switch(t.data_type){case"number_decimal":t.valueFormatted=r("number")(a,t.decimal_places||2);break;case"number_auto":var o=a.toString();t.auto_number_prefix&&(o=t.auto_number_prefix+o),t.auto_number_suffix&&(o+=t.auto_number_suffix),t.valueFormatted=o;break;case"currency":t.valueFormatted=r("currency")(a,t.currency_symbol||e.currencySymbol,t.decimal_places||2);break;default:t.valueFormatted=a}},getChart:function(e){return t.get(a.apiUrl+"report/get_chart/"+e)},getWidget:function(e){return t.get(a.apiUrl+"report/get_widget/"+e)},getFilters:function(e,t){var r=[];return e.forEach(function(e){r.push({field:e.field,id:e.id,operator:e.operator,value:"[me]"===e.value?t.id:e.value})}),r},createCategory:function(e){return t.post(a.apiUrl+"report/create_category",e)},updateCategory:function(e){return t.put(a.apiUrl+"report/update_category/"+e.id,e)},categoryDelete:function(e){return t["delete"](a.apiUrl+"report/delete_category/"+e)},createReport:function(e){return t.post(a.apiUrl+"report/create",e)},deleteReport:function(e){return t["delete"](a.apiUrl+"/report/delete/"+e)},getReport:function(e){return t.get(a.apiUrl+"report/get_report/"+e)},updateReport:function(e){return t.put(a.apiUrl+"report/update/"+e.id,e)},saveReport:function(e,r){return"edit"===e?t.put(a.apiUrl+"report/update/"+r.id,r):t.post(a.apiUrl+"report/create",r)}};return n}]);