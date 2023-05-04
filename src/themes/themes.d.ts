import { PaletteColor } from "@mui/material/styles"

declare module "@mui/material/styles" {
    export interface PaletteColor {
        link: string;
    }
}