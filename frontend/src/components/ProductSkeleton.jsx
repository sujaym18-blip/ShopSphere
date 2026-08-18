const ProductSkeleton = () => {
  return (
    <div className="card">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200 skeleton"></div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="h-3 w-20 bg-gray-200 skeleton"></div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 skeleton"></div>
          <div className="h-4 w-3/4 bg-gray-200 skeleton"></div>
        </div>

        {/* Rating */}
        <div className="h-4 w-32 bg-gray-200 skeleton"></div>

        {/* Price */}
        <div className="h-6 w-24 bg-gray-200 skeleton"></div>

        {/* Button */}
        <div className="h-10 w-full bg-gray-200 skeleton rounded-lg"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
