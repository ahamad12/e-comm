import WixImage from "@/components/WixImage";
import { cn } from "@/lib/utils";
import { products } from "@wix/stores";
import { PlayIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
interface ProductMediaProps {
  media: products.MediaItem[] | undefined;
}

export default function ProductMedia({ media }: ProductMediaProps) {
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  
  const selectedMedia = media?.[selectedIndex];
  
  
  useEffect(() => {
    if (media && selectedIndex >= media.length) {
      setSelectedIndex(0);
    }
  }, [media, selectedIndex]);

  if (!media?.length) return null;

  const selectedImage = selectedMedia?.image;
  const selectedVideo = selectedMedia?.video?.files?.[0];

  return (
    <div className="h-fit basis-2/5 space-y-5 md:sticky md:top-10">
      <div className="aspect-square bg-secondary">
        {selectedImage?.url ? (
          <Zoom key={selectedMedia?._id}>
            <WixImage
              mediaIdentifier={selectedImage.url}
              alt={selectedImage.altText}
              width={1000}
              height={1000}
            />
          </Zoom>
        ) : selectedVideo?.url ? (
          <div className="flex size-full items-center bg-black">
            <video 
              controls 
              className="size-full"
              poster={selectedMedia?.thumbnail?.url}
            >
              <source
                src={selectedVideo.url}
                type={`video/${selectedVideo.format}`}
              />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : null}
      </div>
      {media.length > 1 && (
        <div className="flex flex-wrap gap-5" role="list">
          {media.map((mediaItem, index) => (
            <MediaPreview
              key={mediaItem._id}
              mediaItem={mediaItem}
              isSelected={index === selectedIndex}
              onSelect={() => setSelectedIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface MediaPreviewProps {
  mediaItem: products.MediaItem;
  isSelected: boolean;
  onSelect: () => void;
}

function MediaPreview({ mediaItem, isSelected, onSelect }: MediaPreviewProps) {
  const imageUrl = mediaItem.image?.url;
  const videoThumbnail = mediaItem.thumbnail?.url;
  const isVideo = !!mediaItem.video;

  // Use video thumbnail if available, otherwise use image
  const thumbnailUrl = imageUrl || videoThumbnail;

  if (!thumbnailUrl) return null;

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onSelect}
      className={cn(
        "relative cursor-pointer bg-secondary transition-all hover:scale-105",
        isSelected && "outline outline-2 outline-primary outline-offset-2",
      )}
      aria-label={`View ${isVideo ? 'video' : 'image'}: ${mediaItem.image?.altText || 'product media'}`}
      aria-pressed={isSelected}
    >
      <WixImage
        mediaIdentifier={thumbnailUrl}
        alt={mediaItem.image?.altText || mediaItem.video?.files?.[0].altText}
        width={100}
        height={100}
      />
      {isVideo && (
        <span 
          className="absolute left-1/2 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40"
          aria-hidden="true"
        >
          <PlayIcon className="size-5 text-white/60" />
        </span>
      )}
    </button>
  );
}
