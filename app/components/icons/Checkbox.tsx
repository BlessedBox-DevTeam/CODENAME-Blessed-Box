import React from 'react';
import { Pressable, Text, View } from 'react-native';
import colors from '../../baseStyles/colors';

type CheckboxProps = {
  checked: boolean;
  label?: string;
  onChange: (checked: boolean) => void;
};

const Checkbox = ({ checked, label = 'Keep me signed in', onChange }: CheckboxProps) => {
  const toggleCheckbox = () => onChange(!checked);

  return (
    <Pressable
      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}
      onPress={toggleCheckbox}>
      <View
        style={{
          width: 22,
          height: 22,
          borderWidth: 2,
          borderColor: colors.checkboxBlue,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
        }}>
        {checked && (
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: colors.checkboxBlue,
            }}
          />
        )}
      </View>
      <Text style={{ marginLeft: 8, fontSize: 16 }}>{label}</Text>
    </Pressable>
  );
};

export default Checkbox;
