import { ExternalLink } from "lucide-react"

interface ProductLinkPreviewProps {
  title: string
  image: string
  url: string
}

export default function ProductLinkPreview({ title, image, url }: ProductLinkPreviewProps) {
  const domain = url ? new URL(url).hostname.replace("www.", "") : ""

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center p-3 bg-gray-50 border-b">
        <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
        <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
        <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
        <div className="flex-1 text-center text-xs text-gray-500">{domain}</div>
      </div>
      <div className="p-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
            {image ? (
              <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-2"
            >
              <ExternalLink className="h-3 w-3" />
              Visit product page
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
