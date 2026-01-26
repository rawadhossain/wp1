import { mount } from '@cypress/vue2';
import Vue from 'vue';
import VueRouter from 'vue-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

Vue.use(VueRouter);

// Custom mount command with common options
Cypress.Commands.add('mount', (component, options = {}) => {
  const router = new VueRouter({
    routes: options.routes || [],
    mode: 'hash',
  });

  if (options.route) {
    router.push(options.route);
  }

  // Create root data with isLoggedIn
  const rootData = options.rootData || { isLoggedIn: true };

  return mount(component, {
    ...options,
    extensions: {
      plugins: [router],
      mixin: {
        beforeCreate() {
          this.$root.$data = rootData;
        },
      },
      ...options.extensions,
    },
  });
});
