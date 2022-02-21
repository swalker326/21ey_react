import React, { useMemo, useState, Dispatch, SetStateAction, createContext, useContext, FC } from 'react';

interface ThemeModeInterface {
  mode: "dark" | "light",
  setMode: Dispatch<SetStateAction<"dark" | "light">>
}

const ThemeModeContext = createContext<ThemeModeInterface>({} as ThemeModeInterface)

export const useThemeMode = () => {
  const themeMode = useContext(ThemeModeContext);
  if (!themeMode?.mode) {
    throw new Error("Theme mode context accessed outside of provider tree")
  }
  return themeMode
}

export const ThemeModeProvider: FC = ({ children }) => {
  const [themeMode, setThemeMode] = useState<"dark" | "light">("light")
  const context = useMemo(() => ({ mode: themeMode, setMode: setThemeMode }), [themeMode, setThemeMode])

  return (
    <ThemeModeContext.Provider value={context}>
      {children}
    </ThemeModeContext.Provider>
  )
  
}