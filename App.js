import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NotesListScreen from './src/screens/NotesListScreen';
import NoteDetailScreen from './src/screens/NoteDetailScreen';
import AddEditNoteScreen from './src/screens/AddEditNoteScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="NotesList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="NotesList" 
          component={NotesListScreen} 
          options={{ title: 'Moje Notatki' }}
        />
        <Stack.Screen 
          name="NoteDetail" 
          component={NoteDetailScreen} 
          options={{ title: 'Szczegóły' }}
        />
        <Stack.Screen 
          name="AddEditNote" 
          component={AddEditNoteScreen} 
          options={{ title: 'Dodaj Notatkę' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Ustawienia' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
