// Modal Design System Constants
export const MODAL_SIZES = {
  small: 600,     // Simple confirmations, options
  medium: 800,    // Forms, updates
  large: 1000,    // Details with tabs
  xlarge: 1200,   // Complex reports with multiple sections
} as const;

export const MODAL_COLORS = {
  primary: '#3B82F6',      // Blue for info/details
  warning: '#ff7849',      // Orange for warnings/dispatch
  success: '#52c41a',      // Green for success
  danger: '#ff4d4f',       // Red for delete/critical
  neutral: '#6782f5',      // Default blue
} as const;

export const MODAL_BACKGROUNDS = {
  content: '#f0f9ff',      // Light blue for content sections
  form: '#f9f9f9',         // Light gray for form sections
  header: '#3B82F6',       // Primary blue for headers
} as const;

// Standard Modal Props Interface
export interface StandardModalProps {
  visible: boolean;
  onCancel: () => void;
  width?: keyof typeof MODAL_SIZES | number;
  title?: string;
  color?: keyof typeof MODAL_COLORS;
}

// Standard Button Styles
export const BUTTON_STYLES = {
  primary: {
    backgroundColor: MODAL_COLORS.primary,
    borderColor: MODAL_COLORS.primary,
    fontWeight: 500,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: '#d9d9d9',
    color: '#595959',
  },
  danger: {
    backgroundColor: MODAL_COLORS.danger,
    borderColor: MODAL_COLORS.danger,
    fontWeight: 500,
  },
} as const;

// Standard Grid Layouts
export const GRID_LAYOUTS = {
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: 40,
  },
  threeColumn: {
    display: 'grid', 
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 20,
  },
  labelValue: {
    display: 'grid',
    gridTemplateColumns: '140px 20px 1fr',
    rowGap: 12,
    columnGap: 10,
  },
} as const;

// Typography System
export const TYPOGRAPHY = {
  fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  heading: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontWeight: 600,
  },
  subheading: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontWeight: 500,
  },
  body: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontWeight: 400,
  },
  label: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontWeight: 500,
  },
} as const;

// Standard Section Styles
export const SECTION_STYLES = {
  content: {
    padding: 24,
    background: MODAL_BACKGROUNDS.content,
    border: '1px solid #91d5ff',
    borderRadius: 8,
  },
  form: {
    padding: 24,
    background: MODAL_BACKGROUNDS.form,
    border: '1px solid #d9d9d9',
    borderRadius: 8,
  },
} as const;
