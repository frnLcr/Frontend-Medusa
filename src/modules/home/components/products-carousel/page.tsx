"use client"
import React, { useEffect, useState, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Swiper as SwiperType } from "swiper"
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectCoverflow,
} from "swiper/modules"
import Link from "next/link"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "./styles/styles.css"
import Image from "next/image"
import { Loader } from "../../../../../public"
import useIsMobile from "../../../../lib/hooks/useIsMobile"

const ProductCarousel: React.FC = () => {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useIsMobile()
  const progressCircle = useRef<SVGSVGElement>(null)
  const progressContent = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:9000/store/products", {
          method: "GET",
          headers: {
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
        })

        if (!response.ok) {
          throw new Error("Network response was not ok")
        }

        const data = await response.json()
        setProducts(data.products)
      } catch (error: any) {
        console.error("Error fetching products:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "600px",
          width: "100%",
        }}
      >
        <Image src={Loader} alt="Loading" width={15} height={15} />
      </div>
    )
  }

  if (error) {
    return <div>Error: {error}</div>
  }
  const onAutoplayTimeLeft = (
    s: SwiperType,
    time: number,
    progress: number
  ) => {
    if (progressCircle.current) {
      progressCircle.current.style.setProperty(
        "--progress",
        (1 - progress).toString()
      )
    }
    if (progressContent.current) {
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`
    }
  }

  // Función para convertir el título en un slug
  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/ /g, "-") // Reemplazar espacios con guiones
      .replace(/[^\w-]+/g, "") // Eliminar caracteres especiales
  }

  return (
    <div className="w-full h-[600px] flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-full h-full">
        <Swiper
          effect="coverflow"
          slidesPerView={isMobile ? 1 : 2}
          spaceBetween={20}
          centeredSlides={true}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          className="w-full h-full mySwiper"
        >
          {products.map((product, index) => (
            <SwiperSlide
              key={index}
              className="flex flex-col items-center justify-center text-center"
            >
              <Link
                href={`/products/${slugify(product?.title ?? "")}`}
                passHref
              >
                <div className="flex flex-col items-center justify-center text-center h-full">
                  <img
                    src={product?.images[0]?.url}
                    alt={product?.title}
                    className="max-h-80 object-cover rounded-lg mx-auto"
                  />
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold font-sans">
                      {product?.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-sans">
                      {product?.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ProductCarousel
