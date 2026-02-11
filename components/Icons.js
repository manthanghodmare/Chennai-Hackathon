function Icon({ name, size = "text-xl", className = "" }) {
    return <div className={`icon-${name} ${size} ${className}`}></div>;
}