/**
 * Hook para detectar si la resolución de pantalla es considerada "mobile".
 * Retorna `true` si el ancho de la ventana es menor o igual a 768px.
 */

import { useEffect, useState } from "react"

const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768) // Mobile: <= 768px
    }

    // Detectamos el tamaño inicial y escuchamos cambios.
    handleResize()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}

export default useIsMobile
