/* eslint-disable prettier/prettier */
import {View, Text, TextInput} from 'react-native';
import React from 'react';

export default function FormInput({
  label,
  labelStyle,
  placeholder,
  secureTextEntry,
  containerStyle,
  errorMessage,
  onChangeText,
  keyboardType,
  inputStyle,
  ...rest
}) {
  return (
    <View style={{marginVertical: 5, ...containerStyle}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{color: 'maroon', marginVertical: 5, ...labelStyle}}>
          {label}
        </Text>
        <Text style={{fontSize: 16, color: 'red'}}>{errorMessage}</Text>
      </View>
      <TextInput
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
        style={{
          height: 40,
          borderWidth: 1,
          borderColor: 'maroon',
          borderRadius: 5,
          paddingHorizontal: 10,
          ...inputStyle,
        }}
      />
    </View>
  );
}
