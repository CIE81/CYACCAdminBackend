import userRoutes from './users/routes.mjs';
import prayerRequestRoutes from './prayer-requests/routes.mjs';
import memberRoutes from './members/routes.mjs';
import eventRoutes from './events/routes.mjs';
import dashboardRoutes from './dashboard/routes.mjs';

const modules = [userRoutes, prayerRequestRoutes, memberRoutes, eventRoutes, dashboardRoutes];

export const registerModules = server => {
  modules.forEach(routeFactory => {
    const routes = routeFactory();
    server.route(routes);
  });
};
