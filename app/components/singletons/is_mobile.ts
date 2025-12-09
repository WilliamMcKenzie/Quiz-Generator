export default function isMobile()
{
    const screen_width = window.innerWidth
    const screen_height = window.innerHeight
    const is_mobile = (screen_width / screen_height) < 1

    return is_mobile
}