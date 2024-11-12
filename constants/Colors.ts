/**
 * Below are the colors used in the app, defined for both light and dark modes.
 * This color scheme is inspired by Airbnb's design, adapted for a flexible theming system.
 */

const tintColorLight = '#ff5a5f'; // Airbnb's signature reddish-pink
const tintColorDark = '#ff7885'; // A lighter version of the signature color for dark mode

export const Colors = {
  light: {
    text: '#484848', // Dark gray for primary text
    background: '#ffffff', // White background
    tint: tintColorLight,
    icon: '#767676', // Medium gray for icons
    tabIconDefault: '#767676', // Medium gray for unselected tab icons
    tabIconSelected: tintColorLight,
    primary: '#ff5a5f', // Airbnb's signature reddish-pink
    secondary: '#008489', // Teal, used for buttons and accents
    border: '#ebebeb', // Light gray for borders
    error: '#d93900', // Red for error messages
    success: '#008a05', // Green for success messages
    warning: '#ffb400', // Yellow for warning messages
    purple: '#5B59E2', // will be used for prices
  },
  dark: {
    text: '#f7f7f7', // Light gray for primary text in dark mode
    background: '#1a1a1a', // Very dark gray for background
    tint: tintColorDark,
    icon: '#b0b0b0', // Light gray for icons in dark mode
    tabIconDefault: '#b0b0b0', // Light gray for unselected tab icons in dark mode
    tabIconSelected: tintColorDark,
    primary: '#ff5a5f', // Keeping the same primary red for consistency
    secondary: '#00a699', // A brighter teal for dark mode
    border: '#333333', // Darker gray for borders in dark mode
    error: '#ff5a5f', // Brighter red for error messages in dark mode
    success: '#00c781', // Brighter green for success messages in dark mode
    warning: '#ffc400', // Brighter yellow for warning messages in dark mode
    purple: '#5B59E2', // will be used for prices
  },
};

export const getTheme = (isDark: boolean) => 
  isDark ? Colors.dark : Colors.light;