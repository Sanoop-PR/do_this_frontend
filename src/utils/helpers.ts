import { IColor, IIcon } from "@/types/Index"
import { nanoid } from "nanoid/non-secure";

const palette = {
    red600: "#dc2626",
    yellow: "#ffd60a",
    orange400: "#e76942",
    green300: "#aacc00",
    green600: "#6ba175",
    sky300: "#38bdf8",
    sky600: "#4b95ae",
    purple300: "#8b809a",
    gray: "#6c757d",
    brown: "#eab85d",
}

export const getColors = () => {
    const colors : IColor[] = Object.keys(palette).map((_paletteItem) =>{
        return {
            id:`color_${nanoid()}`,
            code:palette[_paletteItem as keyof typeof palette],
            name:_paletteItem,
        }
    })
    return colors;
} ;

const ICON_SET = {
    personal: "🙍‍♂️",
    home: "🏡",
    work: "💼",
    shopping: "🛒",
    travel: "🏖",
    medical: "⚕",
    pet: "🐶",
}

export const getIcons=()=>{
    const icons : IIcon[] = Object.keys(ICON_SET).map(_icon=>{
        return {
            id:`icon_${nanoid()}`,
            symbol: ICON_SET[_icon as keyof typeof ICON_SET],
            name:_icon,
        }
    })
    return icons
}
