import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const Checkbox = ({ label = 'Keep me signed in', onChange }) => {
  const [checked, setChecked] = useState(false);

  const toggleCheckbox = () => {
    const newValue = !checked;
    setChecked(newValue);
    if (onChange) onChange(newValue); // opcional callback al padre
  };

  return (
    <Pressable
      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}
      onPress={toggleCheckbox}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderWidth: 2,
          borderColor: '#1E3A8A', // reemplaza con tu color dark_blue si tienes constantes
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
        }}
      >
        {checked && (
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: '#1E3A8A', // mismo color para llenado
            }}
          />
        )}
      </View>
      <Text style={{ marginLeft: 8, fontSize: 16 }}>{label}</Text>
    </Pressable>
  );
};

export default Checkbox;
