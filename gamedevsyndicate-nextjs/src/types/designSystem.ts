export interface ColorValue {
  hex: string
  alpha: number
  hsl: {
    h: number
    s: number
    l: number
    a: number
  }
  hsv: {
    h: number
    s: number
    v: number
    a: number
  }
  rgb: {
    r: number
    g: number
    b: number
    a: number
  }
}

export interface ColorPalette {
  primary: ColorValue
  secondary: ColorValue
  tertiary: ColorValue
  buttonPrimary: ColorValue
  buttonSecondary: ColorValue
}

export interface AccessibilitySettings {
  contrastRatio: number
  colorBlindFriendly: boolean
}

export interface DesignSystem {
  _id: string
  _type: 'designSystem'
  title: string
  colors: ColorPalette
  accessibility: AccessibilitySettings
  _createdAt: string
  _updatedAt: string
}
