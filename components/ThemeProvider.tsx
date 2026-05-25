"use client";

import {
  ThemeProvider as NextThemesProvider,
} from "next-themes";

export function ThemeProvider({
  children,
}: any) {

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
    >

      {children}

    </NextThemesProvider>
  );
}