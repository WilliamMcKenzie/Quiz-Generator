import KUTE from "kute.js";
import { useEffect, useState } from "react";
import isMobile from "./singletons/is_mobile";

export default function Background()
{
    const [is_mobile, setMobile] = useState<boolean>(false)
    useEffect(() => {
        setMobile(isMobile())
        window.addEventListener('resize', () => {
            setMobile(isMobile())
        })

        KUTE.to('#top1', { path: "#top2" }, {repeat: 999, duration: 3000, yoyo: true}).start()
        KUTE.to('#bot1', { path: "#bot2" }, {repeat: 999, duration: 3000, yoyo: true}).start()
    }, [])

    const regular_background = (
        <svg className="svg_blend" id="visual" viewBox="0 0 900 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" version="1.1">
            <g transform="translate(900, 600)"><path id="top1" d="M-270.4 0C-256 -20.7 -241.5 -41.4 -234.7 -62.9C-227.9 -84.4 -228.7 -106.6 -221.7 -128C-214.7 -149.4 -199.9 -169.9 -180.3 -180.3C-160.8 -190.7 -136.5 -190.9 -118.5 -205.2C-100.5 -219.6 -88.7 -248 -70 -261.2C-51.3 -274.4 -25.6 -272.4 0 -270.4L0 0Z" fill="#ff0066"></path></g>
            <g transform="translate(0, 0)"><path id="bot1" d="M270.4 0C260 21.9 249.6 43.8 240.5 64.4C231.4 85 223.5 104.3 214.8 124C206 143.7 196.5 163.7 183.8 183.8C171.2 204 155.6 224.2 135.2 234.2C114.9 244.2 89.8 243.9 66.5 248.2C43.2 252.6 21.6 261.5 0 270.4L0 0Z" fill="#9900ff"></path></g>
            <g style={{visibility: "hidden"}} transform="translate(900, 600)"><path id="top2" d="M-270.4 0C-263.1 -23.2 -255.7 -46.3 -243.4 -65.2C-231.1 -84.1 -213.8 -98.8 -204.4 -118C-194.9 -137.2 -193.2 -161.1 -183.8 -183.8C-174.4 -206.6 -157.3 -228.3 -135.2 -234.2C-113.1 -240.1 -86 -230.3 -62.6 -233.8C-39.3 -237.2 -19.6 -253.8 0 -270.4L0 0Z" fill="#ff0066"></path></g>
            <g style={{visibility: "hidden"}} transform="translate(0, 0)"><path id="bot2" d="M270.4 0C259.7 21.6 248.9 43.1 243.4 65.2C237.9 87.3 237.6 110 231.2 133.5C224.9 157 212.5 181.4 191.2 191.2C169.9 201 139.7 196.2 118.5 205.2C97.3 214.2 85.3 237 67 250.2C48.8 263.3 24.4 266.9 0 270.4L0 0Z" fill="#9900ff"></path></g>
        </svg>
    )

    const mobile_background = (
        <svg className="svg_blend" id="visual" viewBox="0 0 360 800" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" version="1.1">
            <g transform="translate(360, 800)"><path id="top1" d="M-270.4 0C-256 -20.7 -241.5 -41.4 -234.7 -62.9C-227.9 -84.4 -228.7 -106.6 -221.7 -128C-214.7 -149.4 -199.9 -169.9 -180.3 -180.3C-160.8 -190.7 -136.5 -190.9 -118.5 -205.2C-100.5 -219.6 -88.7 -248 -70 -261.2C-51.3 -274.4 -25.6 -272.4 0 -270.4L0 0Z" fill="#ff0066"></path></g>
            <g transform="translate(0, 0)"><path id="bot1" d="M270.4 0C260 21.9 249.6 43.8 240.5 64.4C231.4 85 223.5 104.3 214.8 124C206 143.7 196.5 163.7 183.8 183.8C171.2 204 155.6 224.2 135.2 234.2C114.9 244.2 89.8 243.9 66.5 248.2C43.2 252.6 21.6 261.5 0 270.4L0 0Z" fill="#9900ff"></path></g>
            <g style={{visibility: "hidden"}} transform="translate(600, 900)"><path id="top2" d="M-270.4 0C-263.1 -23.2 -255.7 -46.3 -243.4 -65.2C-231.1 -84.1 -213.8 -98.8 -204.4 -118C-194.9 -137.2 -193.2 -161.1 -183.8 -183.8C-174.4 -206.6 -157.3 -228.3 -135.2 -234.2C-113.1 -240.1 -86 -230.3 -62.6 -233.8C-39.3 -237.2 -19.6 -253.8 0 -270.4L0 0Z" fill="#ff0066"></path></g>
            <g style={{visibility: "hidden"}} transform="translate(0, 0)"><path id="bot2" d="M270.4 0C259.7 21.6 248.9 43.1 243.4 65.2C237.9 87.3 237.6 110 231.2 133.5C224.9 157 212.5 181.4 191.2 191.2C169.9 201 139.7 196.2 118.5 205.2C97.3 214.2 85.3 237 67 250.2C48.8 263.3 24.4 266.9 0 270.4L0 0Z" fill="#9900ff"></path></g>
        </svg>
    )

    switch (is_mobile) 
    {
        case false:
            return regular_background
        case true:
            return mobile_background
    }
}