function Logo({ className = "", showText = true, size = "md" }) {
    const sizes = {
        sm: "h-8",
        md: "h-12",
        lg: "h-16",
        xl: "h-24"
    };

    const textSizes = {
        sm: "text-lg",
        md: "text-2xl",
        lg: "text-4xl",
        xl: "text-5xl"
    };

    const subtitleSizes = {
        sm: "text-[6px]",
        md: "text-[8px]",
        lg: "text-[10px]",
        xl: "text-[12px]"
    };

    return (
        <div className={`flex items-center gap-3 ${className}`} data-name="nexus-logo">
            {/* Logo Icon */}
            <div className={`${sizes[size]} aspect-square relative`}>
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                    {/* Main Pin Shape */}
                    <path
                        d="M50 5C30.7 5 15 20.7 15 40c0 14.5 15 35 35 55 20-20 35-40.5 35-55 0-19.3-15.7-35-35-35z"
                        fill="#1e3a5f"
                    />
                    {/* White Circle */}
                    <circle cx="50" cy="40" r="22" fill="white" />
                    {/* Simplified Bus Icon */}
                    <path
                        d="M62 42.5v-6c0-1.4-1.1-2.5-2.5-2.5h-19c-1.4 0-2.5 1.1-2.5 2.5v6c0 0.8 0.7 1.5 1.5 1.5h21c0.8 0 1.5-0.7 1.5-1.5zm-18-5.5h3v3h-3v-3zm5 0h3v3h-3v-3zm5 0h3v3h-3v-3zm5 0h3v3h-3v-3zm-16 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                        fill="#1e3a5f"
                    />
                    {/* Bottom Orange Curve */}
                    <path
                        d="M35 85c0 0 5 10 15 10s15-10 15-10"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="4"
                        lineCap="round"
                    />
                </svg>
            </div>

            {/* Logo Text */}
            {showText && (
                <div className="flex flex-col">
                    <h1 className={`${textSizes[size]} font-black tracking-tighter text-[#1e3a5f] leading-none`}>
                        NEXUS
                    </h1>
                    <p className={`${subtitleSizes[size]} font-bold tracking-[0.2em] text-[#f97316] uppercase leading-none mt-1`}>
                        Smart Link, Small Cities
                    </p>
                </div>
            )}
        </div>
    );
}
