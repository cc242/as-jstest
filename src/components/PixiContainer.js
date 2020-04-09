import React, {useEffect, useRef} from 'react';
import * as PIXI from "pixi.js";
import {gsap, TweenMax} from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin'
PixiPlugin.registerPIXI(PIXI);gsap.registerPlugin(PixiPlugin);

const PixiContainer = (props) => {
    let renderer, stage, ticker;
    const pixiRef = useRef();
    const bgRef = useRef();
    const cloud1Ref = useRef();
    const cloud2Ref = useRef();
    const cloud3Ref = useRef();
    const cloudArray = useRef();
    const sunRef = useRef();
    const moonRef = useRef();

    const assetConfig = {
      colour: {
          night: '0x0c3953',
          day: '0x7fb5d3'
      }
    };
    const animConfig = {
        '01d': {
            day: true,
            sun: true,
            clouds: 0,
            rain: false,
            snow: false
        },
        '02d': {
            day: true,
            sun: true,
            clouds: 1,
            rain: false,
            snow: false
        },
        '03d': {
            day: true,
            sun: true,
            clouds: 2,
            rain: false,
            snow: false
        },
        '04d': {
            day: true,
            sun: false,
            clouds: 3,
            rain: false,
            snow: false
        },
        '09d': {
            day: true,
            sun: true,
            clouds: 3,
            rain: true,
            snow: false
        },
        '10d': {
            day: true,
            sun: true,
            clouds: 3,
            rain: true,
            snow: false
        },
        '11d': {
            day: true,
            sun: false,
            clouds: 0,
            rain: true,
            snow: false
        },
        '13d': {
            day: true,
            sun: false,
            clouds: 3,
            rain: false,
            snow: true
        },
        '50d': {
            day: true,
            sun: true,
            clouds: 0,
            rain: false,
            snow: false
        },
        '01n': {
            day: false,
            sun: true,
            clouds: 0,
            rain: false,
            snow: false
        },
        '02n': {
            day: false,
            sun: true,
            clouds: 1,
            rain: false,
            snow: false
        },
        '03n': {
            day: false,
            sun: true,
            clouds: 2,
            rain: false,
            snow: false
        },
        '04n': {
            day: false,
            sun: false,
            clouds: 3,
            rain: false,
            snow: false
        },
        '09n': {
            day: false,
            sun: true,
            clouds: 3,
            rain: true,
            snow: false
        },
        '10n': {
            day: false,
            sun: true,
            clouds: 3,
            rain: true,
            snow: false
        },
        '11n': {
            day: false,
            sun: false,
            clouds: 0,
            rain: true,
            snow: false
        },
        '13n': {
            day: false,
            sun: false,
            clouds: 3,
            rain: false,
            snow: true
        },
        '50n': {
            day: false,
            sun: true,
            clouds: 0,
            rain: false,
            snow: false
        }
    };


    useEffect(() => {
        /**
         * Using icon code from openweathermap
         */
        const weatherProp = props.weather ? props.weather : '01d';
        const weather = animConfig[weatherProp];
        // hide show num clouds

        updateClouds(weather.clouds);
        // change the background colour for day or night, show sun or moon
        let bgColor = weather.day ? assetConfig.colour.day : assetConfig.colour.night;
        updateDayNight(weather.day, bgColor);

    }, [props.weather]);

    // setting initial weather
    useEffect(()=> {
        setTimeout(()=> {
            const weather = animConfig['01d'];
            updateClouds(weather.clouds);
            let bgColor = weather.day ? assetConfig.colour.day : assetConfig.colour.night;
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

        addSprite();
        bgRef.current = addBackground();
        sunRef.current = addSun();
        moonRef.current = addMoon();
        cloud1Ref.current = addClouds();
        cloud2Ref.current = addClouds();
        cloud3Ref.current = addClouds();
        cloudArray.current = [cloud1Ref.current, cloud2Ref.current, cloud3Ref.current];

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

    const addSprite = () => {
        let sprite = PIXI.Sprite.from('/assets/bunny.png');
        sprite.anchor.set(0.5);
        sprite.position.set(renderer.screen.width/2, renderer.screen.height/2);
        sprite.interactive = true;
        sprite.buttonMode = true;
        stage.addChild(sprite);
        ticker.add(function(delta) {
            sprite.x += 0.1 * delta;
        });
    };

    const addBackground = () => {
        let bgGraphics = new PIXI.Graphics();
        bgGraphics.beginFill(0xFFFFFF);
        bgGraphics.drawRect(0, 0, renderer.screen.width, renderer.screen.height);
        stage.addChild(bgGraphics);
        return bgGraphics;
    };

    const addClouds = () => {
        let sprite = PIXI.Sprite.from('/assets/cloud.png');
        let randomPos = getRandom(200);
        sprite.anchor.set(0.5);
        sprite.position.set((renderer.screen.width/2)+randomPos, (renderer.screen.height/2)+randomPos);
        sprite.interactive = true;
        sprite.buttonMode = true;
        sprite.alpha = clamp(Math.random(), 0.5, 1);
        let speed = (Math.random() * 100) / 200;
        speed = clamp(speed, 0.1, 0.3);
        stage.addChild(sprite);
        ticker.add(function(delta) {
            sprite.x += speed * delta;
            if (sprite.x > (renderer.screen.width + (sprite.width/2))) {
                sprite.x = 0 - (sprite.width/2);
                sprite.y = (renderer.screen.height/2)+getRandom(200);
            }
        });
        return sprite;
    };

    const addSun = () => {
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
       // TweenMax.to(bgRef.current, 1, {pixi:{ tint: Math.random() * 0xffffff}});
        if (bgRef.current) {
            bgRef.current.tint = 0xFFFFFF;
            TweenMax.to(bgRef.current, 0.4, {pixi:{ tint: parseInt(bg)}});
        }
    };

    const updateClouds = (num) => {
        if (!cloudArray.current) return;
        for (let i=0; i<cloudArray.current.length; i++) {
           if (i <= (num-1)) {
               TweenMax.to( cloudArray.current[i], 1, {alpha:  clamp(Math.random(), 0.5, 1)});
           } else {
               TweenMax.to( cloudArray.current[i], 1, {alpha: 0});
           }
        }
    };

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
