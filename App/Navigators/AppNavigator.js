import React from 'react';
import {Image, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaView} from 'react-native-safe-area-context';
import navigationModule from '../Modules/navigationModule';
import HomeScreen from '../Views/Root/Home/HomeScreen';
import LeadDetailsScreen from '../Views/Root/LeadDetails/LeadDetailsScreen';
import BrowseScreen from '../Views/Root/Browse/BrowseScreen';
import MyLeadsScreen from '../Views/Root/MyLeads/MyLeadsScreen';
import AlertsScreen from '../Views/Root/Alerts/AlertsScreen';
import ProfileScreen from '../Views/Root/Profile/ProfileScreen';
import ProfileInformationScreen from '../Views/Root/Profile/ProfileInformationScreen';
import NotificationSettingsScreen from '../Views/Root/Profile/NotificationSettingsScreen';
import UserLimitsScreen from '../Views/Root/Profile/UserLimitsScreen';
import PasswordScreen from '../Views/Root/Profile/PasswordScreen';
import styles from '../Styles/styles'

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer
      ref={navigatorRef => {
        navigationModule.setNavigators(navigatorRef, 'main');
      }}>
      <Stack.Navigator>
        <Stack.Screen
          name="/main"
          component={HomeScreenTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="/leadDetails"
          component={LeadDetailsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="/profileinformation"
          component={ProfileInformationScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="/notificationSettings"
          component={NotificationSettingsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="/userLimitsSettings"
          component={UserLimitsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="/passwordSettings"
          component={PasswordScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Tab = createBottomTabNavigator();

function HomeScreenTabs() {
  return (
    <Tab.Navigator shifting={true} screenOptions={{header: () => null}}>
      {bottomTabs.map(tab => (
        <Tab.Screen key={tab.name} {...tab} />
      ))}
    </Tab.Navigator>
  );
}

const bottomTabs = [
  {
    name: '/main/home',
    options: {
      title: 'Home',
      tabBarIcon: props => 
        props.focused ? 
          <Image style={styles.tabIcon} source={require('../Assets/img/tabs/homeactive.png')} /> : 
          <Image style={styles.tabIcon} source={require('../Assets/img/tabs/home.png')} />,
      tabBarActiveTintColor: '#50B741',
      tabBarInactiveTintColor: '#829AA7',
    },
    component: HomeScreen,
  },
  {
    name: '/main/browse',
    options: {
      title: 'Browse',
      tabBarIcon: props => 
        props.focused ? 
          <Image style={styles.tabIcon} source={require('../Assets/img/tabs/browseactive.png')} /> : 
          <Image style={styles.tabIcon} source={require('../Assets/img/tabs/browse.png')} />,
      tabBarActiveTintColor: '#50B741',
      tabBarInactiveTintColor: '#829AA7',
    },
    component: BrowseScreen,
  },
  {
    name: '/main/myleads',
    options: {
      title: 'My Leads',
      tabBarIcon: props => 
        props.focused ? 
          <Image style={styles.tabIcon} source={require('../Assets/img/tabs/leadsactive.png')} /> : 
          <Image style={styles.tabIcon} source={require('../Assets/img/tabs/leads.png')} />,
      tabBarActiveTintColor: '#50B741',
      tabBarInactiveTintColor: '#829AA7',
    },
    component: MyLeadsScreen,
  },
  {
    name: '/main/alerts',
    options: {
      title: 'Alerts',
      tabBarIcon: props => 
        props.focused ? 
          <Image style={styles.tabIcon} source={require('../Assets/img/tabs/alertsactive.png')} /> : 
          <Image style={styles.tabIcon} source={require('../Assets/img/tabs/alerts.png')} />,
      tabBarActiveTintColor: '#50B741',
      tabBarInactiveTintColor: '#829AA7',
    },
    component: AlertsScreen,
  },
  {
    name: '/main/profile',
    options: {
      title: 'Profile',
      tabBarIcon: props => 
        props.focused ? 
          <Image style={styles.tabIcon} source={require('../Assets/img/tabs/profileactive.png')} /> : 
          <Image style={styles.tabIcon} source={require('../Assets/img/tabs/profile.png')} />,
      tabBarActiveTintColor: '#50B741',
      tabBarInactiveTintColor: '#829AA7',
    },
    component: ProfileScreen,
  },
];

export default AppNavigator;
