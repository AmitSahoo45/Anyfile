import dynamic from 'next/dynamic';
import type { Metadata } from "next";
import ImageConverter from "./ImageConverter";

export const metadata: Metadata = {
    title: "Online Image Converter - Quickly convert any image to JPG, PNG, GIF, BMP, TIFF, WEBP, and more | Anyfile",
    description: "Instantly convert your images online for free. Quickly convert image of any format to JPG, PNG, GIF, BMP, TIFF, WEBP, and HEIC files quickly and securely with Anyfile's powerful image converter. 100% safe, secure and works on web browsers. We don't store your files, so your privacy is guaranteed!!!! The easiest free online image converter.",
    keywords: `image converter, 
    convert jpg to png, convert jpg to gif, convert jpg to bmp, convert jpg to tiff, convert jpg to webp, convert jpg to heic,
    convert png to jpg, convert png to gif, convert png to bmp, convert png to tiff, convert png to webp, convert png to heic,
    convert gif to jpg, convert gif to png, convert gif to bmp, convert gif to tiff, convert gif to webp, convert gif to heic,
    convert bmp to jpg, convert bmp to png, convert bmp to gif, convert bmp to tiff, convert bmp to webp, convert bmp to heic,
    convert tiff to jpg, convert tiff to png, convert tiff to gif, convert tiff to bmp, convert tiff to webp, convert tiff to heic,
    convert webp to jpg, convert webp to png, convert webp to gif, convert webp to bmp, convert webp to tiff, convert webp to heic, 
    convert jpg, jpeg, convert png, convert gif, convert bmp, convert tiff, convert webp, convert heic, online image converter, free image converter, online image converter save secure, online image converter save, online image converter secure, online image converter save secure, jpg png gif bmp tiff webp heic conversion`,
    openGraph: {
        title: "Free Online Image Converter | Anyfile",
        description: "Convert JPG, PNG, GIF, BMP, TIFF, WEBP, and HEIC images quickly and securely with Anyfile. No uploads required, complete privacy guaranteed.",
        url: "https://yourdomain.com/image-converter",
        images: [
            { url: "https://yourdomain.com/image-converter-og-image.jpg", width: 1200, height: 630 }
        ],
        type: "website",
    },
};

export default function ImagesConverterPage() {
    return (
        <main>
            <ImageConverter />
        </main>
    );
}