import { mount } from "cypress/vue2";
import { router } from "@/main";
import "./commands";

Cypress.Commands.add("mount", (component, options = {}) => {
	return mount(component, {
		global: {
			plugins: [router],
			mocks: {
				$root: { $data: { isLoggedIn: true } },
				...options.global?.mocks,
			},
			...options.global,
		},
		...options,
	});
});
