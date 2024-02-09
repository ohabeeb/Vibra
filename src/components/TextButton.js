/* eslint-disable prettier/prettier */
import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

export default function TextButton({
  label,
  // disabled,
  // onPress,
  labelStyle,
  containerStyle,
  ...rest
}) {
  return (
    <TouchableOpacity
      // disabled={disabled}
      style={{
        paddingVertical: 14,
        marginVertical: 20,
        backgroundColor: 'maroon',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        ...containerStyle,
      }}
      // onPress={onPress}
      {...rest}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '500',
          color: '#FFF',
          ...labelStyle,
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
