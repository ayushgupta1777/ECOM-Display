import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

// Admin Screens
import OrdersDashboardScreen from '../screens/admin/OrdersDashboardScreen';
import AdminOrderDetailsScreen from '../screens/admin/AdminOrderDetailsScreen';
// import AdminProductManagementScreen from '../screens/admin/AdminProductManagementScreen';
import AdminProductManagementScreen from '../screens/admin/AdminProductManagementScreen';

import AddProductScreen from '../screens/admin/AdminAddProductScreen';
import CategoryManagementScreen from '../screens/admin/CategoryManagementScreen';
import BannerManagementScreen from '../screens/admin/BannerManagementScreen';
import ShiprocketSettingsScreen from '../screens/admin/ShiprocketSettingsScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Orders Stack
const OrdersStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OrdersDashboard" component={OrdersDashboardScreen} />
    <Stack.Screen name="AdminOrderDetails" component={AdminOrderDetailsScreen} />
  </Stack.Navigator>
);

// Products Stack
const ProductsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* <Stack.Screen name="ProductManagement" component={AdminProductManagementScreen} /> */}
    <Stack.Screen name="AddProduct" component={AddProductScreen} />
  </Stack.Navigator>
);

// Settings Stack
const SettingsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminProfile" component={AdminProfileScreen} />
    <Stack.Screen name="Product" component={AdminProductManagementScreen} />
    <Stack.Screen name="CategoryManagement" component={CategoryManagementScreen} />
    <Stack.Screen name="BannerManagement" component={BannerManagementScreen} />
    <Stack.Screen name="ShiprocketSettings" component={ShiprocketSettingsScreen} />
    <Stack.Screen name="OrdersDashboard" component={OrdersDashboardScreen} />

  </Stack.Navigator>
);

const AdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Orders') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8
        }
      })}
    >
      <Tab.Screen name="Orders" component={OrdersStack} />
      <Tab.Screen name="Products" component={ProductsStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;