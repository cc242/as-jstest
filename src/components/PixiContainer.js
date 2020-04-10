import React, {useEffect, useRef} from 'react';
import * as PIXI from "pixi.js";
import {gsap, TweenMax} from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';
import {animConfig, colourConfig} from "../config/DisplayConfig";

PixiPlugin.registerPIXI(PIXI);gsap.registerPlugin(PixiPlugin);

const PixiContainer = (props) => {
    let renderer, stage, ticker;
    const pixiRef = useRef();
    const bgRef = useRef();
    const cloud1Ref = useRef();
    const cloud2Ref = useRef();
    const cloud3Ref = useRef();
    const cloud4Ref = useRef();
    const cloud5Ref = useRef();
    const cloud6Ref = useRef();
    const cloudArray = useRef();
    const sunRef = useRef();
    const moonRef = useRef();

    useEffect(() => {
        /**
         * Using icon code from openweathermap
         */
        const weatherProp = props.weather ? props.weather : '01d';
        const weather = animConfig[weatherProp];
        // hide show num clouds
        updateClouds(weather.clouds);
        // change the background colour for day or night, show sun or moon
        let bgColor = weather.day ? colourConfig.colour.day : colourConfig.colour.night;
        updateDayNight(weather.day, bgColor);

    }, [props.weather]);

    // setting initial weather
    useEffect(()=> {
        setTimeout(()=> {
            const weather = animConfig['01d'];
            updateClouds(weather.clouds);
            let bgColor = weather.day ? colourConfig.colour.day : colourConfig.colour.night;
            updateDayNight(weather.day, bgColor);
        }, 60)
    }, []);

    useEffect(() => {
        renderer = new PIXI.Renderer({ width: window.innerWidth, height: 400, backgroundColor: 0x1099bb });
        pixiRef.current.appendChild(renderer.view);
        stage = new PIXI.Container();
        ticker = new PIXI.Ticker();
        ticker.add(() => {
            renderer.render(stage);
        }, PIXI.UPDATE_PRIORITY.LOW);
        ticker.start();

        bgRef.current = addBackground();
        sunRef.current = addSun();
        moonRef.current = addMoon();
        cloud1Ref.current = addClouds();
        cloud2Ref.current = addClouds();
        cloud3Ref.current = addClouds();
        cloud4Ref.current = addClouds();
        cloud5Ref.current = addClouds();
        cloud6Ref.current = addClouds();
        cloudArray.current = [cloud1Ref.current, cloud2Ref.current, cloud3Ref.current, cloud4Ref.current, cloud5Ref.current, cloud6Ref.current];

        function resize() {
            renderer.resize(window.innerWidth, 400);
            bgRef.current.width = window.innerWidth;
            sunRef.current.x = renderer.screen.width/2;
            moonRef.current.x = renderer.screen.width/2;
        }
        window.addEventListener('resize', resize);

        return () => {
            stage.destroy(true);
            stage = null;
            pixiRef.current.removeChild(renderer.view);
            ticker.destroy();
            renderer.destroy( true );
            renderer = null;
            window.removeEventListener('resize', resize);
        }
    }, []);

    const addBackground = () => {
        let bgGraphics = new PIXI.Graphics();
        bgGraphics.beginFill(0xFFFFFF);
        bgGraphics.drawRect(0, 0, renderer.screen.width, renderer.screen.height);
        stage.addChild(bgGraphics);
        return bgGraphics;
    };

    const addClouds = () => {
        let sprite = PIXI.Sprite.from('/assets/cloud.png');
        let randomPos = getRandom(100);
        sprite.anchor.set(0.5);
        sprite.position.set((renderer.screen.width/2)+randomPos, (renderer.screen.height/2)+randomPos);
        sprite.alpha = clamp(Math.random(), 0.5, 1);
        let speed = (Math.random() * 100) / 200;
        speed = clamp(speed, 0.1, 0.3);
        stage.addChild(sprite);
        ticker.add(function(delta) {
            //sprite.x += speed * delta;
            if (sprite.x > (renderer.screen.width + (sprite.width/2))) {
                sprite.x = 0 - (sprite.width/2);
                sprite.y = (renderer.screen.height/2)+getRandom(100);
            }
        });
        return sprite;
    };

    const addSun = () => {
        console.log('add sun');
        let sprite = PIXI.Sprite.from('/assets/sun.png');
        sprite.anchor.set(0.5);
        sprite.scale.set(0.5)
        sprite.position.set(renderer.screen.width/2, renderer.screen.height/2);
        stage.addChild(sprite);
        return sprite;
    };
    const addMoon = () => {
        let sprite = PIXI.Sprite.from('/assets/moon.png');
        sprite.anchor.set(0.5);
        sprite.scale.set(0.5)
        sprite.position.set(renderer.screen.width/2, renderer.screen.height/2);
        stage.addChild(sprite);
        return sprite;
    };
    const updateDayNight = (day, bg) => {
       console.log('UPDATE DAY NIGHT', bg);
       TweenMax.to(sunRef.current, 1, {alpha: day ? 1 : 0});
       TweenMax.to(moonRef.current, 1, {alpha: day ? 0 : 1});
        if (bgRef.current) {
            TweenMax.to(bgRef.current, 0.4, {pixi:{ tint: parseInt(bg)}});
        }
    };

    const updateClouds = (num) => {
        if (!cloudArray.current) return;
        console.log('update clouds', num);
        for (let i=0; i<cloudArray.current.length; i++) {
           if (i <= (num-1)) {
               TweenMax.to( cloudArray.current[i], 1, {alpha:  clamp(Math.random(), 0.5, 1)});
           } else {
               TweenMax.to( cloudArray.current[i], 1, {alpha: 0});
           }
        }
    };
    console.log('pixi');
    return (
        <div>
            <div ref={pixiRef} className="pixi-container"></div>
        </div>
    )
};
export default PixiContainer;

function getRandom(range) {
    return (Math.random()  * range) * (Math.random() > 0.5 ? -1 : 1);
}
function clamp(a,b,c) {
    return Math.max(b,Math.min(c,a));
}
