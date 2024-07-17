function IA() {
    return `
        ${Menu()}
        <style>
            body {
                margin: 0;
                overflow: hidden;
            }
            #myCanvas {
                background: #000;
                z-index: 1;
                border: 2px solid rgb(136, 14, 14);
                box-shadow: 0 0 10px rgba(179, 24, 24, 0.5);
                display: block;
                margin: auto;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            nav {
                background: #333;
                color: #fff;
                padding: 10px;
                text-align: center;
                position: fixed;
                top: 0;
                width: 100%;
                z-index: 10;
            }
            nav ul {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                justify-content: center;
            }
            nav ul li {
                margin: 0 15px;
            }
            nav ul li a {
                color: #fff;
                text-decoration: none;
                font-weight: bold;
            }
            nav ul li a:hover {
                text-decoration: underline;
            }
        </style>
        <div>
            <canvas id="myCanvas" width="800" height="400">
                Votre navigateur ne supporte pas le canvas HTML5.
            </canvas>
        </div>
    `;
}