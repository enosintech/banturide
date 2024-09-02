const autoClearNotificationsMiddleware = store => next => action => {
  const result = next(action);

  // Automatically clear notifications every minute
  if (action.type === 'notifications/addNotification') {
    // Check and clear notifications older than 2 minutes
    const state = store.getState();
    const notificationsArray = state.notifications.notificationsArray;

    const twoMinutes = 2 * 60 * 1000; // 2 minutes in milliseconds
    const now = Date.now();

    // Filter out notifications older than 2 minutes
    const freshNotifications = notificationsArray.filter(notification => now - notification.createdAt <= twoMinutes);

    // Dispatch clear and re-add fresh notifications
    store.dispatch({ type: 'notifications/clearNotifications' });
    freshNotifications.forEach(notification => {
      store.dispatch({
        type: 'notifications/addNotification',
        payload: notification,
      });
    });
  }

  return result;
};

// Set up an interval to trigger the middleware functionality every minute
setInterval(() => {
  // Dispatch an action to trigger the clearing process
  store.dispatch({ type: 'notifications/clearNotifications' });
}, 60 * 1000); // Every 60 seconds

export default autoClearNotificationsMiddleware;