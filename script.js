var canvas, ctx;

Snowflakes = (function () {

    var sprCnt = 15;
    var sprWidth = 80;
    var sprHeight = 68;

    var snowflakes = [];
    var snowflakeSprites = [];

    var minScale = 0.2;
    var maxScale = 1.2;

    var minVerticalVelocity = 2;
    var maxVerticalVelocity = 5;
    var minHorizontalVelocity = -2;
    var maxHorizontalVelocity = 3;

    var minOpacity = 0.1;
    var maxOpacity = 0.9;
    var maxOpacityIncrement = 60;

    var minHorizontalDelta = 1;
    var maxHorizontalDelta = 4;

    var speed = 2;

    function getRandom(x1, x2) {
        return Math.random() * (x2 - x1) + x1
    }

    function initializeSprites() {
        var img = new Image();
        img.onload = function () {

            for (var i = 0; i < sprCnt; i++) {
                var sprite = document.createElement('canvas');
                sprite.width = sprWidth;
                sprite.height = sprHeight;
                var context = sprite.getContext('2d');

                context.drawImage(img, i * sprWidth, 0, sprWidth, sprHeight, 0, 0, sprWidth, sprHeight);

                snowflakeSprites.push(sprite);
            }
        }
        img.src = 'sprite.png';
    };

    function initialize(number) {
        initializeSprites();

        for (var i = 0; i < number; i++) {
            snowflakes.push(initializeSnowflake());
        }
    };

    function initializeSnowflake() {
        var scale = getRandom(minScale, maxScale);

        return {
            x: Math.random() * ctx.canvas.width,
            y: Math.random() * ctx.canvas.height,
            vv: getRandom(minVerticalVelocity, maxVerticalVelocity),
            hv: getRandom(minHorizontalVelocity, maxHorizontalVelocity),
            o: getRandom(minOpacity, maxOpacity),
            oi: Math.random() / maxOpacityIncrement,
            mhd: getRandom(minHorizontalDelta, maxHorizontalDelta),
            hd: 0,
            hdi: Math.random() / (maxHorizontalVelocity * minHorizontalDelta),
            sw: scale * sprWidth,
            sh: scale * sprHeight,
            si: Math.ceil(Math.random() * (sprCnt - 1))
        }
    };

    function moveFlakes() {
        for (var i = 0; i < snowflakes.length; i++) {
            var osf = snowflakes[i];

            osf.x += (osf.hd + osf.hv) * speed;
            osf.y += osf.vv * speed;

            osf.hd += osf.hdi;
            if (osf.hd < -osf.mhd || osf.hd > osf.mhd) {
                osf.hdi = -osf.hdi;
            };

            if (osf.y > ctx.canvas.height + sprHeight / 2) {
                osf.y = 0
            };
            if (osf.y < 0) {
                osf.y = ctx.canvas.height
            };
            if (osf.x > ctx.canvas.width + sprWidth / 2) {
                osf.x = 0
            };
            if (osf.x < 0) {
                osf.x = ctx.canvas.width
            };

            osf.o += osf.oi;
            if (osf.o > maxOpacity || osf.o < minOpacity) {
                osf.oi = -osf.oi
            };
            if (osf.o > maxOpacity)
                osf.o = maxOpacity;
            if (osf.o < minOpacity)
                osf.o = minOpacity;
        }
    }

    function renderFrame() {

        moveFlakes();

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (var i = 0; i < snowflakes.length; i++) {
            var osf = snowflakes[i];
            ctx.globalAlpha = osf.o;
            ctx.drawImage(snowflakeSprites[osf.si], 0, 0, sprWidth, sprHeight, osf.x, osf.y, osf.sw, osf.sh);
        }
    }

    return {
        'initialize': initialize,
        'render': renderFrame,
    }
})();

function initialization() {

    canvas = document.getElementById('panel');
    ctx = canvas.getContext('2d');

    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    setInterval(Snowflakes.render, 40);
    Snowflakes.initialize(100);
}

if (window.attachEvent) {
    window.attachEvent('onload', initialization);
} else {
    if (window.onload) {
        var curronload = window.onload;
        var newonload = function() {
            curronload();
            initialization();
        };
        window.onload = newonload;
    } else {
        window.onload = initialization;
    }
}
