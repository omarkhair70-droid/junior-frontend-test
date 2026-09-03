import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export default function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search by name"
        placeholderTextColor="#9CA3AF"
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        accessibilityLabel="Search users by name"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  input: {
    height: 48,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    color: '#111827',
    fontSize: 15,
  },
});
