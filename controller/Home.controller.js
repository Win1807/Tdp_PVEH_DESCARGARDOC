jQuery.sap.require("sap.ui.descargardoc.util.Formatter");
jQuery.sap.require("sap/m/MessageToast");
jQuery.sap.require("sap/m/Table");
// jQuery.sap.require("sap/m/semantic");

sap.ui.define([
   "sap/ui/descargardoc/controller/BaseController",
   "sap/m/MessageBox",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/ui/core/Fragment",
   "sap/ui/core/mvc/Controller",
   "sap/ui/model/Filter",
   "sap/ui/model/Sorter"

], function (BaseController, MessageBox, JSONModel, MessageToast, Fragment, Controller, Filter, Sorter) {
    "use strict";
    // var urlGlobal = sessionStorage.urlGlobal;
    var usuarioName = sessionStorage.usuarioName;
    var Concesionario;
    var opt="0";

    var urlGlobal = "/DEV_TO_ODVIATICOS/odata/SAP/ZSCP_VEHICULOS_SRV";
    var oModel;
    return BaseController.extend("sap.ui.descargardoc.controller.Home", {
    	onInit : function () {
    		oModel = new sap.ui.model.odata.v2.ODataModel(urlGlobal, true);
			this.getRUC();
		},

		getRUC: function(){

            sap.ui.core.BusyIndicator.show(0); // mostrando la barra de Busy
            var url = urlGlobal + "&ID=03";
            url = url + "&PI_UNAME=" + usuarioName;  ////// Comentar esto en el SCP
            
            var thes = this;

// {+@WVF001
			var filter;
			var	filters = [];
	filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, "03");
	filters.push(filter);
	 // Obteniendo los datos de la Barra cabecera
		oModel.read("/PRC_VEHICULOSSet",{
				method: "GET",
				filters: filters,
				urlParameters: {
					"search" : "GET"
				},
				success: function (result, status, xhr){
					var data = result;
					var	val  = data.results[0].Json;
					val = val.substring(1,val.length - 1);
					Concesionario =val;
					
					 sap.ui.core.BusyIndicator.hide();
				},
				error: function(error){
					console.log(error);
					sap.ui.core.BusyIndicator.hide();
				}
			});
// }+@WVF001		


// {-@WVF001
            // Obteniendo los datos de la Barra cabecera
            // $.ajax({
            //     url: url, 
            //     cache: false,
            //     type: "GET",
            //     success: function(result,status,xhr){
            //         Concesionario = result;
            //     },
            //     error: function(xhr,status,error){
            //     	console.log(error);
            //         //sap.m.MessageBox.error("Error de Conexión");
            //     },
            //     complete: function (data) {
            //         sap.ui.core.BusyIndicator.hide();
            //     }
            // });
            
// }-@WVF001
        },

		//Función para retroceder de vista.
	    onNavBack: function(){
	     	window.history.back();
	    },


	    seleccionarOption: function(evt){
	     	opt = evt.getSource().data("data");
	    },

	    descargar: function(evt){
	     		var thes=this;
            
	     		var fechaini = this.getView().byId("fechainicio").getValue();
	     		var fechafin = this.getView().byId("fechafinal").getValue();
	     		var version = this.getView().byId("version").getSelected();
	     	if(opt != "" && fechaini != "" & fechafin != ""){
	     		sap.ui.core.BusyIndicator.show(0); // mostrando la barra de Busy

	     		if(version == true){
	     			var verTmp = "X";
	     		}
	     		else{
	     			var verTmp = "";
	     		}
// {+@WVF001 Migracion a odata
			var filter;
			var	filters = [];
				var oParametros = {
					'fecini':fechaini,
					'fecfin':fechafin,
					'conces':Concesionario,
					'tipdoc':opt,
					'chkvrs':verTmp
				};
				filter = new sap.ui.model.Filter("Id", sap.ui.model.FilterOperator.EQ, "05");
				filters.push(filter);
				filter = new sap.ui.model.Filter("Parametros", sap.ui.model.FilterOperator.EQ, JSON.stringify(oParametros));
				filters.push(filter);
				
			oModel.read("/PRC_VEHICULOSSet",{
					method: "GET",
					filters: filters,
					urlParameters: {
						"search" : "GET"
					},
					success: function (result, status, xhr){
						var data = result;
						var	val  = data.results[0].Json;
						val = val.substring(1,val.length - 1);
						if(val != ""){
	                		var data = thes.hexToBase64(val);
	                		
		                    thes.download(data);
		                    thes.limpiar();
	                	}
	                	else{
	                		 sap.m.MessageBox.error("No se encontraron resultados para los datos ingresados.");
	                	}
						 sap.ui.core.BusyIndicator.hide();
					},
					error: function(error){
						console.log(error);
						sap.ui.core.BusyIndicator.hide();
					}
				});
// }+@WVF001

// {-@WVF001 Debido a la migracion a ODATA

	     		// var url = urlGlobal + "&ID=05&PI_RUC="+Concesionario+"&PI_TIPODOC="+opt+"&PI_FECINI="+fechaini+"&PI_FECFIN="+fechafin+"&PI_CHECK="+verTmp;

	     		// // Obteniendo los datos de la Barra cabecera
	       //     $.ajax({
	       //         url: url, 
	       //         cache: false,
	       //         type: "GET",
	       //         success: function(result,status,xhr){
	       //         	if(result != ""){
	       //         		var data = thes.hexToBase64(result);
		      //              thes.download(data);
		      //              thes.limpiar();
	       //         	}
	       //         	else{
	       //         		 sap.m.MessageBox.error("No se encontraron resultados para los datos ingresados.");
	       //         	}
	       //         },
	       //         error: function(xhr,status,error){
	       //             console.log(error);
	       //             //sap.m.MessageBox.error("Error de Conexión");
	       //         },
	       //         complete: function (data) {
	       //             sap.ui.core.BusyIndicator.hide();
	       //         }
	       //     });
 // }-@WVF001
	            
	     	}
	     	else{
	     		sap.m.MessageBox.error("Debe seleccionar un tipo de documento y fechas de consulta.");
	     	}
	    },

	    hexToBase64: function(hexstring) {
		   return btoa(hexstring.match(/\w{2}/g).map(function(a) {
		       return String.fromCharCode(parseInt(a, 16));
		   }).join(""));
		},

	    download: function(base64PDF) {
	    	var element = document.createElement('a');
			element.setAttribute('href', 'data:text/plain;base64,' + base64PDF);
			element.setAttribute('download', "Reporte.txt");
			element.style.display = 'none';

			document.body.appendChild(element);

			element.click();

			document.body.removeChild(element);
        },

        limpiar: function() {
          	this.getView().byId("fechainicio").setValue();
          	this.getView().byId("fechafinal").setValue();
          	this.getView().byId("version").setSelected(false);
          	this.getView().byId("RB1-"+opt).setSelected(false);
            this.getView().byId("RB1-0").setSelected(true);//@WVF001 Inicializamos la selecion de la opcion por defecto 
          	opt = "0";//@WVF001 Inicializamos la opcion seleccionad por defecto
        
        }
        
    });
});