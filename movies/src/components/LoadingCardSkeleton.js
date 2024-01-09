const LoadingCardSkeleton = () => {
  return (
    <div className="rounded-lg bg-gray-300 animate-pulse shadow-2xl">
      <div className="relative rounded-t-lg pb-80"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 mb-2 w-2/3"></div>
        <div className="h-4 bg-gray-200 mb-2 w-1/2"></div>
        <div className="h-4 bg-gray-200 w-1/4"></div>
      </div>
    </div>
  );
};

export default LoadingCardSkeleton;
