import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../baseStyles/colors';
import commonStyles from '../baseStyles/baseStyles';

/**
 * Props for the QuantitySelector component.
 */
interface QuantitySelectorProps {
  /**
   * Optional value that, when changed, triggers a reset of the quantity.
   * Can be any type, commonly a unique key from the parent.
   */
  resetKey?: any;
}

/**
 * QuantitySelector component.
 *
 * Allows the user to select a quantity between **1 and 100**.
 * Provides increment/decrement buttons and an editable text input.
 *
 * Exposes a `reset` method via `ref` to reset the quantity back to `1`.
 *
 * @component
 * @example
 * ```tsx
 * const ref = useRef<{ reset: () => void }>(null);
 *
 * <QuantitySelector ref={ref} resetKey={someKey} />
 *
 * // Reset manually from parent
 * ref.current?.reset();
 * ```
 *
 * @param {QuantitySelectorProps} props - Component props.
 * @param {React.Ref<{ reset: () => void }>} ref - Ref exposing a reset method.
 * @returns {JSX.Element} React component.
 */
const QuantitySelector = forwardRef<unknown, QuantitySelectorProps>((props, ref) => {
  const { resetKey } = props;

  /** Current quantity (string for TextInput compatibility) */
  const [quantity, setQuantity] = useState('1');

  /** Whether the user is editing the input field */
  const [editing, setEditing] = useState(false);

  /** Ref to control the TextInput */
  const inputRef = React.useRef<TextInput>(null);

  // Expose reset method to parent via ref
  useImperativeHandle(ref, () => ({
    reset: () => setQuantity('1'),
  }));

  // Automatically reset quantity when resetKey changes
  useEffect(() => {
    setQuantity('1');
  }, [resetKey]);

  /**
   * Handle changes in the TextInput.
   * Allows only numeric characters, but permits clearing the input temporarily.
   *
   * @param {string} text - Input text value.
   */
  const handleChange = (text: string) => {
    const filtered = text.replace(/[^0-9]/g, '');
    setQuantity(filtered);
  };

  /** Select all text when input is focused */
  const handleFocus = () => {
    setTimeout(() => {
      inputRef.current?.setSelection(0, quantity.length);
    }, 0);
  };

  /** Validate value when input loses focus */
  const handleBlur = () => {
    let num = Number(quantity);
    if (!quantity || isNaN(num)) {
      setQuantity('1');
    } else if (num < 1) {
      setQuantity('1');
    } else if (num > 100) {
      setQuantity('100');
    } else {
      setQuantity(String(num));
    }
    setEditing(false);
  };

  /** Increase quantity by 1 (capped at 100) */
  const increment = () => {
    setQuantity((prev) => {
      const num = Number(prev || '0');
      return num >= 100 ? '100' : String(num + 1);
    });
  };

  /** Decrease quantity by 1 (bottom limit 1) */
  const decrement = () => {
    setQuantity((prev) => {
      const num = Number(prev || '0');
      return num > 1 ? String(num - 1) : '1';
    });
  };

  return (
    <View style={styles.container}>
      {/* Decrement button */}
      <TouchableOpacity style={styles.button} onPress={decrement}>
        <Text style={commonStyles.header}>-</Text>
      </TouchableOpacity>

      {/* Editable input or display text */}
      {editing ? (
        <TextInput
          ref={inputRef}
          value={quantity}
          keyboardType="numeric"
          style={[commonStyles.paragraph, styles.input, { color: colors.dark_blue }]}
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
          <Text style={[commonStyles.paragraph, { color: colors.dark_blue }]}>{quantity}</Text>
        </TouchableOpacity>
      )}

      {/* Increment button */}
      <TouchableOpacity style={styles.button} onPress={increment}>
        <Text style={commonStyles.header}>+</Text>
      </TouchableOpacity>
    </View>
  );
});

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.light_gray,
    borderRadius: 5,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  button: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.light_gray,
    height: 'auto',
    minHeight: 32,
  },
  input: {
    borderBottomWidth: 1,
    textAlign: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 40,
    minHeight: 32,
  },
});

export default QuantitySelector;
