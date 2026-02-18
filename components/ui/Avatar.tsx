import React, { useState, useEffect } from 'react';

interface AvatarProps {
    src?: string | null;
    name: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar: React.FC<AvatarProps> = ({ src, name, className = '', size = 'md' }) => {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [src]);

    const getInitials = (name: string) => {
        return (name && name.length > 0) ? name.charAt(0).toUpperCase() : '?';
    };

    const getRandomColor = (name: string) => {
        if (!name) return 'bg-gray-500'; // Fallback color

        const colors = [
            'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
            'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-16 h-16 text-xl',
        xl: 'w-24 h-24 text-3xl'
    };

    const baseClasses = `rounded-full flex items-center justify-center font-bold text-white overflow-hidden ${sizeClasses[size]} ${className}`;

    if (src && !imageError) {
        return (
            <img
                src={src}
                alt={name}
                className={`${baseClasses} object-cover`}
                onError={() => setImageError(true)}
            />
        );
    }

    return (
        <div className={`${baseClasses} ${getRandomColor(name)}`}>
            {getInitials(name)}
        </div>
    );
};

export default Avatar;
