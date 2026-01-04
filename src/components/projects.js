const ProjectSkeleton = ({ className = "" }) => {
    return (
        <div className={`relative w-full overflow-hidden rounded-3xl bg-dark/5 dark:bg-light/5 animate-pulse ${className}`}>
            <div className="absolute bottom-0 left-0 w-full p-6 space-y-3">
                {/* Type Skeleton */}
                <div className="h-3 w-20 bg-dark/10 dark:bg-light/10 rounded" />
                {/* Title Skeleton */}
                <div className="h-6 w-3/4 bg-dark/10 dark:bg-light/10 rounded" />
                {/* Icon/Link Skeleton */}
                <div className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-dark/10 dark:bg-light/10" />
                    <div className="h-4 w-24 bg-dark/10 dark:bg-light/10 rounded mt-2" />
                </div>
            </div>
        </div>
    );
};

export default ProjectSkeleton;