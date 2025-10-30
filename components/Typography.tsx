import { StyleSheet, TextStyle } from 'react-native';

// Define all your text styles here with HIGH CONTRAST colors
export const Typography = StyleSheet.create({
  // HEADINGS (Pure white for maximum contrast)
h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',           // Pure white
    marginBottom: 8,
} as TextStyle,

h2: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',           // Pure white
    marginBottom: 8,
} as TextStyle,

h3: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',           // Pure white
    marginBottom: 6,
} as TextStyle,

h4: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',           // Pure white
    marginBottom: 4,
} as TextStyle,

  // BODY TEXT (Pure white for primary content)
body: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#FFFFFF',           // Pure white
    lineHeight: 24,
} as TextStyle,

bodySmall: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#B3B3B3',           // Light gray for less emphasis
    lineHeight: 20,
} as TextStyle,

  // SPECIAL TEXT TYPES
subtitle: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#B3B3B3',           // Light gray for secondary text
    lineHeight: 22,
} as TextStyle,

caption: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#808080',           // Medium gray for tertiary text
} as TextStyle,

  // BUTTON TEXT
button: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',           // White text on colored buttons
    textAlign: 'center',
} as TextStyle,

buttonSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',           // White text
    textAlign: 'center',
} as TextStyle,

  // LINK TEXT (Bright blue for dark backgrounds)
link: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#0A84FF',           // iOS blue (bright)
    textDecorationLine: 'underline',
} as TextStyle,

  // ERROR TEXT (Bright red for visibility)
error: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#FF453A',           // Bright red
} as TextStyle,

  // LABEL TEXT (for form inputs)
label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',           // Pure white for clarity
    marginBottom: 4,
} as TextStyle,

  // PLACEHOLDER TEXT (for inputs)
placeholder: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#4D4D4D',           // Dark gray (subtle)
} as TextStyle,
});