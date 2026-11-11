import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import commonStyles from '../baseStyles/baseStyles';
import colors from '../baseStyles/colors';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: (event: GestureResponderEvent) => void;
  chipStyle?: StyleProp<ViewStyle>;
}

export default function FilterChip({ label, selected, onPress, chipStyle }: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected ? styles.selectedChip : styles.unselectedChip, chipStyle]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text style={[styles.text, selected ? styles.selectedText : styles.unselectedText]}>
        {label}
      </Text>
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
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  unselectedChip: {
    backgroundColor: colors.surface.card,
    borderColor: colors.surface.neutral,
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: commonStyles.paragraph.fontFamily,
  },
  selectedText: {
    color: colors.text.inverse,
  },
  unselectedText: {
    color: colors.text.secondary,
  },
});
