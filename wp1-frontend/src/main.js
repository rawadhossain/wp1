import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "jquery";
import "datatables.net";
import "datatables.net-dt/css/jquery.dataTables.min.css";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

new Vue({
	data: {
		isLoggedIn: false,
	},
	el: "#app",
	render: (h) => h(App),
	router,
	template: "<App/>",
	components: { App },
});
