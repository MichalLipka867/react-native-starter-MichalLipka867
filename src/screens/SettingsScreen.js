import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const handleClearData = () => {
    Alert.alert(
      'Wyczyść dane',
      'Czy na pewno chcesz usunąć wszystkie notatki? Tej operacji nie można cofnąć.',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Wyczyść',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@field_notes:notes');
              Alert.alert('Sukces', 'Wszystkie notatki zostały usunięte');
            } catch (error) {
              Alert.alert('Błąd', 'Nie udało się wyczyścić danych');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O aplikacji</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nazwa:</Text>
            <Text style={styles.infoValue}>Field Notes</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Wersja:</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Opis:</Text>
            <Text style={styles.infoValue}>
              Aplikacja do tworzenia notatek terenowych z lokalizacją i zdjęciami
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Funkcje</Text>
          <Text style={styles.featureText}>📷 Aparat - dodawanie zdjęć do notatek</Text>
          <Text style={styles.featureText}>📍 GPS - zapisywanie lokalizacji</Text>
          <Text style={styles.featureText}>💾 Lokalne przechowywanie danych</Text>
          <Text style={styles.featureText}>🌐 Integracja z API (JSONPlaceholder)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dostępność</Text>
          <Text style={styles.accessibilityText}>
            Aplikacja została zaprojektowana z uwzględnieniem dostępności:
          </Text>
          <Text style={styles.featureText}>✓ Etykiety dostępności dla wszystkich elementów interaktywnych</Text>
          <Text style={styles.featureText}>✓ Minimalna wysokość przycisków: 48px</Text>
          <Text style={styles.featureText}>✓ Kontrast kolorów zgodny z WCAG</Text>
          <Text style={styles.featureText}>✓ Obsługa czytników ekranu</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dane</Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearData}
            accessibilityRole="button"
            accessibilityLabel="Wyczyść wszystkie dane"
            accessibilityHint="Usuwa wszystkie zapisane notatki"
          >
            <Text style={styles.dangerButtonText}>Wyczyść wszystkie notatki</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 8,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  accessibilityText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 24,
  },
  dangerButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d32f2f',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  dangerButtonText: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
