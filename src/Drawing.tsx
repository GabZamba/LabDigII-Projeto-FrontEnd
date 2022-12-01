import React from 'react';

const cor_papelao = '#d5b59c';
const cor_madeira = '#a07146';

const HEAD = (
    <div
        style={{
            height: '50px',
            width: '50px',
            borderRadius: '100%',
            border: '10px solid black',
            background: '#555555',
            position: 'absolute',
            top: '50px',
            right: '-30px', // 25 + 5px
        }}
    />
);
const BODY = (
    <div
        style={{
            height: '100px',
            width: '10px',
            background: 'black',
            position: 'absolute',
            top: '120px',
            right: 0,
        }}
    />
);
const RIGHT_ARM = (
    <div
        style={{
            height: '10px',
            width: '100px',
            background: 'black',
            position: 'absolute',
            top: '150px',
            right: '-100px',
            rotate: '-30deg', // rotate around the center
            transformOrigin: 'left bottom', // position the origin to rotate around bottom left
        }}
    />
);
const LEFT_ARM = (
    <div
        style={{
            height: '10px',
            width: '100px',
            background: 'black',
            position: 'absolute',
            top: '150px',
            right: '10px',
            rotate: '30deg',
            transformOrigin: 'right bottom',
        }}
    />
);
const RIGHT_LEG = (
    <div
        style={{
            height: '10px',
            width: '100px',
            background: 'black',
            position: 'absolute',
            top: '210px',
            right: '-90px',
            rotate: '60deg',
            transformOrigin: 'left bottom',
        }}
    />
);
const LEFT_LEG = (
    <div
        style={{
            height: '10px',
            width: '100px',
            background: 'black',
            position: 'absolute',
            top: '210px',
            right: 0,
            rotate: '-60deg',
            transformOrigin: 'right bottom',
        }}
    />
);

const FIXED_PLATFORM = (
    <div>
        <div
            style={{
                // suporte parafuso
                height: '250px',
                width: '50px',
                background: cor_madeira,
                position: 'absolute',
                border: '1px solid black',
                right: 0,
                bottom: 40,
            }}
        />
        <div
            style={{
                // suporte servo
                height: '150px',
                width: '50px',
                background: cor_madeira,
                position: 'absolute',
                border: '1px solid black',
                left: 150,
                bottom: 40,
            }}
        />
        <div
            style={{
                // plataforma
                height: '40px',
                width: '650px',
                background: cor_madeira,
                position: 'absolute',
                border: '1px solid black',
                right: 0,
                bottom: 0,
            }}
        />
        <div // parafuso
            style={{
                height: '20px',
                width: '20px',
                borderRadius: '100%',
                border: '1px solid black',
                background: '#555555',
                position: 'absolute',
                top: 140,
                right: 15,
            }}
        />
        <div
            style={{
                // servomotor
                height: '40px',
                width: '40px',
                background: '#335998',
                position: 'absolute',
                border: '1px solid black',
                left: 155, // left e width/2 suporte servo - width/2
                bottom: 190, // height suporte servo + height
            }}
        >
            <div
                style={{
                    // servomotor
                    height: '40px',
                    width: '40px',
                    background: '#335998',
                    position: 'absolute',
                    border: '1px solid black',
                    left: 155, // left e width/2 suporte servo - width/2
                    bottom: 190, // height suporte servo + height
                }}
            />
            <div
                style={{
                    // helice
                    height: '20px',
                    width: '20px',
                    borderRadius: '100%',
                    border: '1px solid black',
                    background: '#555555',
                    position: 'absolute',
                    top: 140,
                    right: 15,
                }}
            />
            <div
                style={{
                    // helice
                    height: '34px',
                    width: '20px',
                    borderRadius: '100%',
                    border: '1px solid black',
                    background: '#cccccc',
                    position: 'absolute',
                    top: 2,
                    left: 10,
                }}
            />
        </div>
    </div>
);

const MOBILE_PLATFORM = (
    <div>
        <div
            style={{
                // suporte parafuso
                height: '250px',
                width: '50px',
                background: cor_madeira,
                position: 'absolute',
                border: '1px solid black',
                right: 0,
                bottom: 40,
            }}
        />
        <div
            style={{
                // suporte servo
                height: '150px',
                width: '50px',
                background: cor_madeira,
                position: 'absolute',
                border: '1px solid black',
                left: 150,
                bottom: 40,
            }}
        />
        <div
            style={{
                // plataforma
                height: '40px',
                width: '650px',
                background: cor_madeira,
                position: 'absolute',
                border: '1px solid black',
                right: 0,
                bottom: 0,
            }}
        />
        <div // braço servo
            style={{
                height: '40px',
                width: '100px',
                borderRadius: '40%',
                border: '1px solid black',
                background: cor_papelao,
                position: 'absolute',
                top: 140,
                left: 15,
            }}
        />
        <div // furo braço servo
            style={{
                height: '10px',
                width: '10px',
                borderRadius: '100%',
                border: '1px solid black',
                background: '#555555',
                position: 'absolute',
                top: 155, // top braco + height braco/2 - height/2
                left: 30,
            }}
        />
        <div // furo braço servo
            style={{
                height: '10px',
                width: '10px',
                borderRadius: '100%',
                border: '1px solid black',
                background: 'white',
                position: 'absolute',
                top: 155, // top braco + height braco/2 - height/2
                left: 60,
            }}
        />
        <div // furo braço servo
            style={{
                height: '10px',
                width: '10px',
                borderRadius: '100%',
                border: '1px solid black',
                background: 'white',
                position: 'absolute',
                top: 155, // top braco + height braco/2 - height/2
                left: 90,
            }}
        />
    </div>
);

// const BODY_PARTS = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG];

type HandmanDrawingProps = {
    numberOfGuesses: number;
};

export function Drawing() {
    return (
        <div style={{ position: 'relative' }}>
            {MOBILE_PLATFORM}
            {FIXED_PLATFORM}
            {/* {HEAD} */}
            {/* {BODY} */}
            {/* {RIGHT_ARM} */}
            {/* {LEFT_ARM} */}
            {RIGHT_LEG}
            {LEFT_LEG}
            {/* {BODY_PARTS.slice(0, BODY_PARTS.length)} */}
            <div
                style={{
                    height: '50px',
                    width: '10px',
                    background: 'black',
                    position: 'absolute',
                    top: 0,
                    right: 300,
                }}
                onClick={(event) => {
                    event.preventDefault();
                }}
            />
            <div
                style={{
                    height: '10px',
                    width: '200px',
                    background: 'black',
                    marginLeft: '120px',
                }}
            />
            <div
                style={{
                    height: '400px',
                    width: '10px',
                    background: 'black',
                    marginLeft: '120px',
                }}
            />
            <div
                style={{ height: '10px', width: '250px', background: 'black' }}
            />
        </div>
    );
}
