import 'styled-components';
import {LightTheme} from './theme';

declare module 'styled-components' {
    type ThemeType = typeof LightTheme

    export interface DefaultTheme extends ThemeType {}
}