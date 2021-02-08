import React from 'react'
import { GeistUIThemes } from '@geist-ui/react'
import { DeepPartial } from '@geist-ui/react'



export const defaultConfigs = {
  sidebarScrollHeight: 0,
  updateSidebarScrollHeight: () => {},
  updateChineseState: () => {},

  tabbarFixed: false,
  updateTabbarFixed: () => {},

  customTheme: {},
  updateCustomTheme: () => {},
  onThemeChange: () => {},
}

export const ConfigContext = React.createContext(defaultConfigs)

export const useConfigs = () => React.useContext(ConfigContext)
