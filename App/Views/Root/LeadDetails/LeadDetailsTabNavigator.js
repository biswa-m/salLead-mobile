import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AboutTab from './AboutTab';
import DetailsTab from './DetailsTab';
import {Text, Animated, View, TouchableOpacity} from 'react-native';
import { reduce } from 'lodash';
import styles from '../../../Styles/styles';


function MyTabBar({ state, descriptors, navigation, position }) {
  return (
    <View style={styles.detailTabsWrapper}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_, i) => i);
        const animValue = position.interpolate({
          inputRange,
          outputRange: inputRange.map(i => (i === index ? 1 : 0)),
        });

        return (
          <TouchableOpacity
          key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              {
                flex: 1,
                backgroundColor: '#e8e8e8',
                marginTop: 0,
                borderRadius: 10,
                overflow: 'hidden',
                padding: 4,
                alignItems:'center',
                justifyContent:'center',
              },
              isFocused ? {backgroundColor: '#FFFFFF'} : {},
            ]}>
            <Text
              style={[
                {fontSize: 12, textTransform: 'capitalize', fontSize: 10},
                isFocused ? {color: '#000000',fontWeight:'500',} : {},
              ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}



const Tab = createMaterialTopTabNavigator();

function LeadDetailsTabNavigator(state) {

  return (

    <Tab.Navigator
      // screenOptions={{
      //   tabBarLabelStyle: { fontSize: 12, textTransform:'capitalize',fontSize:10, },
      //   tabBarItemStyle: { width: 100 },
      //   tabBarStyle: { backgroundColor: '#e8e8e8',margin:20,marginTop:0,borderRadius:10,overflow:'hidden', padding:4, },
      //   indicatorStyle: { backgroundColor: 'red' },
      //   tabBarActiveTintColor: 'blue',
      //   tabBarInactiveTintColor: 'green'
      // }}

      tabBar={props => <MyTabBar {...props} />}>

      <Tab.Screen
        name="about"
        options={{title: 'About'}}
        component={AboutTab}
      />
      <Tab.Screen
        name="details"
        options={{title: 'Details'}}
        component={DetailsTab}
      />
      
    </Tab.Navigator>

  );
}

export default LeadDetailsTabNavigator;
