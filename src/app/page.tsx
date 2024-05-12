"use client"
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from '@/messages.json'
import Autoplay from 'embla-carousel-autoplay'
import React from 'react'

export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 1500, stopOnInteraction: true }))
  return (
    <>
    <Navbar/>
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        {/* Carousel for Messages */}
        <Carousel className="w-full max-w-xs" plugins={[plugin.current]}>
        <CarouselContent>
          {messages.map((message) => (
            <CarouselItem className="basic-1/2">
              <Card>
                <CardHeader className="text-center mt-2">
                  {message.title}
                </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6 text-center">
                  {message.content}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2023 True Feedback. All rights reserved.
      </footer>
    </>
  );
}
