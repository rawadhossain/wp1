import { mount } from "cypress/vue2";
import Vue from "vue";
import VueRouter from "vue-router";
import router from "@/router";
import "./commands";

Vue.use(VueRouter);

Cypress.Commands.add("mount", (component, options = {}) => {
	return mount(component, {
		router,
		mocks: {
			$root: {
				$data: {
					isLoggedIn: true,
				},
			},
			...(options.mocks || {}),
		},
		...options,
	});
});
