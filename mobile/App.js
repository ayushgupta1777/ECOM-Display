// ============================================
// mobile/App.js
// ============================================
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import { requestUserPermission, notificationListener } from './src/utils/notifications';



const App = () => {
  useEffect(() => {
    // Request notification permission
    requestUserPermission();
    
    // Listen for notifications
    notificationListener();
  }, []);
        
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;