import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import colors from '../baseStyles/colors';
import commonStyles from '../baseStyles/baseStyles';

// QuantitySelector allows the user to select a number between 1 and 100
// Props for QuantitySelector. Optional prop to trigger a reset from parent.
interface QuantitySelectorProps {
  resetKey?: any;
}

const QuantitySelector = forwardRef<unknown, QuantitySelectorProps>(
  (props, ref) => {
    const { resetKey } = props;
    // State for the quantity value (as string for TextInput compatibility)
    const [quantity, setQuantity] = useState('1');
    // State to control if the input is being edited
    const [editing, setEditing] = useState(false);
    // Ref to access the TextInput for selection
    const inputRef = React.useRef<TextInput>(null);

    // Allow parent to reset the quantity using ref
    useImperativeHandle(ref, () => ({
      reset: () => setQuantity('1'),
    }));

    // Automatically reset quantity when resetKey changes
    useEffect(() => {
      setQuantity('1');
    }, [resetKey]);

    // Handle changes in the TextInput (only allow numbers)
    const handleChange = (text: string) => {
      // Allow only numbers, but let the user clear the input
      let filtered = text.replace(/[^0-9]/g, '');
      // Replace the value with the new number
      setQuantity(filtered);
    };

    // Select all text when the input is focused
    const handleFocus = () => {
      setTimeout(() => {
        inputRef.current?.setSelection(0, quantity.length);
      }, 0);
    };

    // Validate the value when the input loses focus
    const handleBlur = () => {
      let num = Number(quantity);
      if (!quantity || isNaN(num)) {
        setQuantity('1'); // Default to 1 if empty or invalid
      } else if (num < 1) {
        setQuantity('1'); // Minimum is 1
      } else if (num > 100) {
        setQuantity('100'); // Maximum is 100
      } else {
        setQuantity(String(num));
      }
      setEditing(false);
    };

    // Increase the quantity by 1 (up to 100)
    const increment = () => {
      setQuantity((prev) => {
        const num = Number(prev || '0');
        if (num >= 100) return '100';
        return String(num + 1);
      });
    };

    // Decrease the quantity by 1 (down to 1)
    const decrement = () => {
      setQuantity((prev) => {
        const num = Number(prev || '0');
        return num > 1 ? String(num - 1) : '1';
      });
    };

    // Render the component UI
    return (
      <View style={styles.container}>
        {/* Decrement button */}
        <TouchableOpacity style={styles.button} onPress={decrement}>
          <Text style={commonStyles.header}>-</Text>
        </TouchableOpacity>
        {/* Show TextInput if editing, otherwise show the value as text */}
        {editing ? (
          <TextInput
            ref={inputRef}
            value={quantity}
            keyboardType="numeric"
            style={[
              commonStyles.paragraph,
              styles.input,
              { color: colors.dark_blue },
            ]}
            onChangeText={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            selectTextOnFocus={true}
            autoFocus={true}
            maxLength={3}
          />
        ) : (
          <TouchableOpacity
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => setEditing(true)}>
            <Text style={[commonStyles.paragraph, { color: colors.dark_blue }]}>
              {quantity}
            </Text>
          </TouchableOpacity>
        )}
        {/* Increment button */}
        <TouchableOpacity style={styles.button} onPress={increment}>
          <Text style={commonStyles.header}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
);

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.light_gray,
    borderRadius: 5,
    overflow: 'hidden',
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.light_gray,
  },
  input: {
    borderBottomWidth: 1,
    textAlign: 'center',
    padding: 0,
  },
});

export default QuantitySelector;
