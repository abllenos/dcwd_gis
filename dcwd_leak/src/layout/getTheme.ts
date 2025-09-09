export const getTheme = (isDarkMode: boolean) => ({
  algorithm: isDarkMode ? undefined : undefined, // Ant Design's built-in algorithms
  token: {
    colorPrimary: '#6782f5',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    fontFamily: 'Noto Sans, -apple-system, BlinkMacSystemFont, sans-serif',
    borderRadius: 8,
    colorBgContainer: isDarkMode ? '#1f1f1f' : '#ffffff',
    colorBgElevated: isDarkMode ? '#1f1f1f' : '#ffffff',
    colorBgLayout: isDarkMode ? '#141414' : '#f5f6fa',
    colorText: isDarkMode ? '#ffffff' : '#262626',
    colorTextSecondary: isDarkMode ? '#d9d9d9' : '#595959',
    colorBorder: isDarkMode ? '#303030' : '#f0f0f0',
  },
  components: {
    Form: {
      labelFontSize: 12,
      labelColor: isDarkMode ? '#ffffff' : '#262626',
    },
    Button: {
      borderRadius: 8,
    },
    Card: {
      borderRadius: 12,
    },
    Layout: {
      siderBg: isDarkMode ? '#1f1f1f' : '#ffffff',
      headerBg: isDarkMode ? '#1f1f1f' : '#ffffff',
    },
    Menu: {
      itemBg: 'transparent',
      subMenuItemBg: 'transparent',
      itemColor: isDarkMode ? '#d9d9d9' : '#595959',
      itemHoverColor: '#6782f5',
      itemSelectedColor: '#ffffff',
      itemSelectedBg: '#6782f5',
    },
  },
});
