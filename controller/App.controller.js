sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast"
], function (Controller, MessageToast) {
   "use strict";
   return Controller.extend("sap.ui.descargardoc.controller.App", {
      	onInit: function () {
            sessionStorage.urlGlobal = "/SRV_RESTVEHICULOS?";
            // Servicio en Logal
            // sessionStorage.urlGlobal = "http://tdperpdev.toyotaperu.com.pe:8001/sap/bc/zvehiculo/zdp_vehiculoloc?sap-client=200";
            sessionStorage.usuarioName = "C_T77";

            // Servicio en SCP QAS
            //sessionStorage.urlGlobal = "http://tdperpdev.toyotaperu.com.pe:8001/sap/bc/zvehiculo/zdp_vehiculo?";
		}
   });
});