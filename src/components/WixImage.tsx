import Image, { ImageProps } from "next/image";
import { media as wixMedia } from "@wix/sdk";

type WixImageProps = Omit<
  ImageProps,
  "src" | "alt" | "placeholder" | "width" | "height"
> & {
  mediaIdentifier: string | undefined;
  placeholder?: string;
  alt?: string | null | undefined;
} & (
    | {
        scaleToFill?: true;
        width: number;
        height: number;
      }
    | {
        scaleToFill?: false;
        width?: number;
        height?: number;
      }
  );

export default function WixImage({
  mediaIdentifier,
  placeholder,
  alt,
  scaleToFill = true,
  width,
  height,
  ...props
}: WixImageProps) {
  const imageUrl = mediaIdentifier
    ? scaleToFill
      ? wixMedia.getScaledToFillImageUrl(
          mediaIdentifier,
          width as number,
          height as number,
          {},
        )
      : wixMedia.getImageUrl(mediaIdentifier).url
    : placeholder;

  return (
    <Image
      src={imageUrl!}
      alt={alt || ""}
      width={width ?? 100}
      height={height ?? 100}
      {...props}
    />
  );
}
