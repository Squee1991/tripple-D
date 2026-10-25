import Home from '~/assets/images/home.svg'
import News from '~/assets/images/news.svg'
import SettingsIcon from '~/assets/images/settings.svg'
import ShoppingCart from '~/assets/images/shopping-cart.svg'
import AccountIcon from '~/assets/images/account.png'
import IdCard from '~/assets/images/monitor.svg'
import Rewards from '~/assets/images/rewards.svg'
import RankAward from '~/assets/images/rankaward.svg'

export const RANK_AVATAR_FILES = [
    '16.png', '17.png', '18.png',
    '19.png', '20.png', '21.png',
    '22.png', '23.png', '24.png'
]

export const AVATAR_EFFECT_MAP = {
    '16.png': 'effect-unicorn', '17.png': 'effect-unicorn', '18.png': 'effect-unicorn',
    '19.png': 'effect-dragon',  '20.png': 'effect-dragon',  '21.png': 'effect-dragon',
    '22.png': 'effect-griffin', '23.png': 'effect-griffin', '24.png': 'effect-griffin'
}

export const MAIN_NAV_ITEMS = [
    { key: 'info', labelKey: 'cabinetSidebar.valueOne', alt: 'infoIcon', icon: AccountIcon },
    { key: 'archive', labelKey: 'cabinetSidebar.valueTwo', alt: 'archiveIcon', icon: News },
    { key: 'shop', labelKey: 'cabinetSidebar.valueThree', alt: 'shopIcon', icon: ShoppingCart },
    { key: 'settings', labelKey: 'cabinetSidebar.valueFour', alt: 'settingsIcon', icon: SettingsIcon }
]

export const HOME_NAV_ITEM = { key: 'home', labelKey: 'cabinet.main', alt: 'Home', icon: Home, url: '/' }

export const ACCOUNT_TABS_CONFIG = [
    { key: 'common', labelKey: 'cabinetNav.common', icon: IdCard, alt: 'IdCard' },
    { key: 'awards', labelKey: 'cabinetNav.awards', icon: Rewards, alt: 'award' },
    { key: 'rank', labelKey: 'cabinetNav.rank', icon: RankAward, alt: 'rank' }
]

export const AVATAR_TABS_CONFIG = [
    { key: 'regular', labelKey: 'typeOfAvatars.usual' },
    { key: 'rank', labelKey: 'typeOfAvatars.ranked' }
]