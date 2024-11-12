import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '@/context/themeContext';
import { getTheme } from '@/constants/Colors';

interface ThemedButtonProps {
  onPress: () => void;
  title: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: 'filled' | 'outlined';
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
  onPress,
  title,
  style,
  textStyle,
  variant = 'filled',
}) => {
  const { isDarkMode } = useTheme();
  const activeTheme = getTheme(isDarkMode);

  const buttonStyles = [
    styles.button,
    variant === 'filled' 
      ? { backgroundColor: activeTheme.primary }
      : {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: activeTheme.primary,
        },
    style,
  ];

  const textStyles = [
    styles.text,
    variant === 'filled'
      ? { color: '#FFFFFF' }
      : { color: activeTheme.primary },
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ThemedButton;