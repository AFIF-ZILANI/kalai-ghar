import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Kalai Ghor — কালাই ঘর",
        short_name: "Kalai Ghor",
        description: "Heritage Kalai Ruti of Rajshahi, Bangladesh",
        start_url: "/",
        display: "browser",
        background_color: "#fdf8f2",
        theme_color: "#b84520",
        icons: [
            { src: "/logo.png", sizes: "any", type: "image/png" },
        ],
    };
}
