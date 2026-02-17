import { mount } from '@cypress/vue2';
import Vue from 'vue';
import VueRouter from 'vue-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Install VueRouter globally (only once)
if (!Vue._vueRouterInstalled) {
  Vue.use(VueRouter);
  Vue._vueRouterInstalled = true;
}

// Custom mount command with common options
Cypress.Commands.add('mount', (component, options = {}) => {
  const routes = options.routes || [];

  // Create root data with isLoggedIn
  const rootData = options.rootData || { isLoggedIn: true };

  // Create router with hash mode
  const router = new VueRouter({
    routes,
    mode: 'hash',
  });

  // Helper function to perform the mount
  const doMount = () => {
    // Add a mixin to handle root data for all components
    const rootDataMixin = {
      beforeCreate() {
        // Ensure $root.$data exists and has the required properties
        if (this.$root) {
          if (!this.$root.$data) {
            this.$root.$data = {};
          }
          Object.assign(this.$root.$data, rootData);
        }
      },
    };

    // Merge extensions properly
    const existingPlugins = options.extensions?.plugins || [];

    // Merge mixin if one was provided
    const mergedMixin = options.extensions?.mixin
      ? {
          ...rootDataMixin,
          ...options.extensions.mixin,
          beforeCreate() {
            rootDataMixin.beforeCreate.call(this);
            if (options.extensions?.mixin?.beforeCreate) {
              options.extensions.mixin.beforeCreate.call(this);
            }
          },
        }
      : rootDataMixin;

    return mount(component, {
      ...options,
      router, // Pass router directly - this is the Vue Test Utils way
      extensions: {
        ...options.extensions,
        plugins: [...existingPlugins],
        mixin: mergedMixin,
      },
    });
  };

  // Navigate to the route and then mount
  // This ensures the route is resolved before the component renders
  if (options.route) {
    return cy.wrap(router.push(options.route).catch(() => {})).then(() => {
      return doMount();
    });
  }

  return doMount();
});
