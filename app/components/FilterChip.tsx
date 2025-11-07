import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../baseStyles/colors';

export default function FilterChip({ label, selected, onPress }) {
  return (
    <TouchableOpacity style={[styles.chip, selected ? styles.selectedChip : styles.unselectedChip]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.text, selected ? styles.selectedText : styles.unselectedText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    minWidth: 60,
    maxWidth: 120,
    marginHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedChip: {
    backgroundColor: colors.dark_blue,
    borderColor: colors.dark_blue,
  },
  unselectedChip: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'OpenSans-SemiBold',
  },
  selectedText: {
    color: colors.white,
  },
  unselectedText: {
    color: colors.dark_blue,
  },
});
