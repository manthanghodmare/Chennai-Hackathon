function Logo({ className = "", showText = true, size = "md" }) {
    const sizes = {
        sm: "h-10",
        md: "h-14",
        lg: "h-20",
        xl: "h-32"
    };

    const textSizes = {
        sm: "text-xl",
        md: "text-3xl",
        lg: "text-5xl",
        xl: "text-7xl"
    };

    const subtitleSizes = {
        sm: "text-[7px]",
        md: "text-[10px]",
        lg: "text-[12px]",
        xl: "text-[16px]"
    };

    const colors = {
        primary: "#1E3A8A", // Deep Blue
        accent: "#F59E0B"   // Amber
    };

    return (
        <div className={`flex items-center gap-3 ${className}`} data-name="nexus-logo">
            {/* Logo Icon */}
            <div className={`${sizes[size]} aspect-square relative`}>
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm overflow-visible">
                    {/* Main Pin Shape */}
                    <path
                        d="M50 85C50 85 80 60 80 40C80 23.4 66.6 10 50 10C33.4 10 20 23.4 20 40C20 60 50 85 50 85Z"
                        fill={colors.primary}
                    />

                    {/* White Circle Background for Bus */}
                    <circle cx="50" cy="40" r="21" fill="white" />

                    {/* Bus Icon Detail (Blue on White Circle) */}
                    <g transform="translate(32, 30) scale(0.36)">
                        {/* Bus Body */}
                        <path
                            d="M8 10h84c2.2 0 4 1.8 4 4v30c0 4.4-3.6 8-8 8H12c-4.4 0-8-3.6-8-8V14c0-2.2 1.8-4 4-4z"
                            fill={colors.primary}
                        />
                        {/* Windows */}
                        <rect x="12" y="16" width="14" height="20" rx="2" fill="white" />
                        <rect x="30" y="16" width="14" height="20" rx="2" fill="white" />
                        <rect x="48" y="16" width="14" height="20" rx="2" fill="white" />
                        <rect x="66" y="16" width="14" height="20" rx="2" fill="white" />

                        {/* Door/Tall Window section */}
                        <rect x="84" y="16" width="8" height="28" rx="2" fill="white" />

                        {/* Wheels */}
                        <circle cx="28" cy="52" r="8" fill={colors.primary} stroke="white" strokeWidth="3" />
                        <circle cx="72" cy="52" r="8" fill={colors.primary} stroke="white" strokeWidth="3" />
                    </g>

                    {/* Bottom Orange Arc */}
                    <path
                        d="M38 75C38 75 42 85 50 85s12-10 12-10"
                        fill="none"
                        stroke={colors.accent}
                        strokeWidth="3.5"
                        lineCap="round"
                        transform="translate(0, 8)"
                    />
                </svg>
            </div>

            {/* Logo Text */}
            {showText && (
                <div className="flex flex-col">
                    <h1 className={`${textSizes[size]} font-black tracking-tight text-[#1E3A8A] leading-none uppercase drop-shadow-sm`}>
                        NEXUS
                    </h1>
                    <p className={`${subtitleSizes[size]} font-bold tracking-[0.2em] text-[#F59E0B] uppercase leading-none mt-1.5`}>
                        SMART LINK, SMALL CITIES
                    </p>
                </div>
            )}
        </div>
    );
}
