'use strict';


function Vector(x, y) {
    this.x = x || 0.0;
    this.y = y || 0.0;
}

Vector.prototype.set = function (x, y) {
    this.x = x;
    this.y = y;
    return this;
}

Vector.prototype.copy = function (v) {
    this.x = v.x;
    this.y = v.y;
    return this;
}

Vector.prototype.sub = function (v1, v2) {
    this.x = v1.x - v2.x;
    this.y = v1.y - v2.y;
    return this;
}

Vector.prototype.selfSub = function (v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
}

Vector.prototype.mult = function (v, f) {
    this.x = v.x * f;
    this.y = v.y * f;
    return this;
}

Vector.prototype.selfMult = function (f) {
    this.x *= f;
    this.y *= f;
    return this;
}

Vector.prototype.div = function (v, f) {
    this.x = v.x / f;
    this.y = v.y / f;
    return this;
}

Vector.prototype.selfDiv = function (f) {
    this.x /= f;
    this.y /= f;
    return this;
}

Vector.prototype.add = function (v1, v2) {
    this.x = v1.x + v2.x;
    this.y = v1.y + v2.y;
    return this;
}

Vector.prototype.selfAdd = function (v) {
    this.x += v.x;
    this.y += v.y;
    return this;
}

Vector.prototype.limit = function (maxLength) {
    var lengthSquared = this.x * this.x + this.y * this.y;
    if( (lengthSquared > maxLength * maxLength) && (lengthSquared > 0) ) {
        var ratio = maxLength / Math.sqrt(lengthSquared);
        this.x *= ratio;
        this.y *= ratio;
    }
    return this;
}

Vector.prototype.dist2 = function (v) {
    return ((this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y));
}

Vector.prototype.mag2 = function () {
    return (this.x * this.x + this.y * this.y);
}

var canvas = {

    elem: document.createElement('canvas'),

    _resize: function () {
        this.width = this.elem.width = this.elem.offsetWidth;
        this.height = this.elem.height = this.elem.offsetHeight;
        this.resize && this.resize();
    },

    init: function () {
        var ctx = this.elem.getContext('2d');
        document.body.appendChild(this.elem);
        window.addEventListener('resize', this._resize.bind(this), false);
        this._resize();
        return ctx;
    },

    setCursor: function (type) {
        if( type !== this.cursor ) {
            this.cursor            = type;
            this.elem.style.cursor = type;
        }
    },

    pointer: function () {
        var pointer = {
            x: 0,
            y: 0,
            isDown: false
        };

        pointer.move = function (e) {
            var touchMode = e.targetTouches,
                pointer;
            if( touchMode ) {
                e.preventDefault();
                pointer = touchMode[0];
            } else pointer = e;
            this.x = pointer.clientX;
            this.y = pointer.clientY;
        }

        pointer.bind = function (elem, events, fn) {
            for ( var i = 0, e = events.split(','); i < e.length; i++ ) {
                elem.addEventListener(e[i], fn.bind(pointer), false);
            }
        }

        pointer.bind(window, 'mousemove,touchmove', function (e) {
            this.move(e);
        });

        pointer.bind(canvas.elem, 'mousedown,touchstart', function (e) {
            this.move(e);
            this.isDown = true;
            this.down && this.down();
        });

        pointer.bind(window, 'mouseup,touchend,touchcancel', function (e) {
            e.preventDefault();
            this.isDown = false;
            this.up && this.up();
        });

        return pointer;

    }
};

~function () {

    var count    = 60,
        circles  = [],
        ds       = 2,
        dragging = false,
        colors   = ['#f80', '#08f', '#666'],
        maxRad, grd;

    function Circle() {
        this.rad    = 10 + Math.random() * maxRad;
        this.rad2   = this.rad * this.rad;
        this.pos    = new Vector(canvas.width * Math.random(), canvas.height * Math.random());
        this.vel    = new Vector(Math.random() - 0.5, Math.random() - 0.5);
        this.acc    = new Vector();
        this.offset = new Vector();
        this.force  = new Vector();
        this.c      = colors[Math.floor(Math.random() * colors.length)];
        this.locked = false;
        this.parent = null;
        this.k      = 0.1;
        this.damp   = 0.98;
    }

    Circle.prototype.update = function () {

        this.acc.set(0, 0);

        if( this.locked && this.parent === null ) {
            this.acc.sub(this.force.sub(pointer, this.offset), this.pos).limit(1);
            this.vel.selfAdd(this.acc).limit(3);
            this.pos.sub(pointer, this.offset);
        } else if( this.locked && this.parent !== null && this.pos.dist2(this.parent.pos) >= this.parent.rad2 ) {
            this.force.sub(this.pos, this.parent.pos).selfMult(-this.k);
            this.acc.div(this.force, this.rad * 0.5);
            this.vel.mult(this.force.add(this.vel, this.acc), this.damp).limit(14);
            this.pos.selfAdd(this.vel);
        } else {
            this.vel.selfAdd(this.acc.limit(1));
            if( this.vel.mag2() > 0.5 * 0.5 ) {
                this.vel.selfMult(0.99);
            }
            this.pos.selfAdd(this.vel);

        }

        var dm = this.rad * 1;
        if( this.pos.x < -dm ) this.pos.x = canvas.width + dm;
        if( this.pos.x > canvas.width + dm ) this.pos.x = -dm;
        if( this.pos.y < -dm ) this.pos.y = canvas.height + dm;
        if( this.pos.y > canvas.height + dm ) this.pos.y = -dm;

    };

    Circle.prototype.render = function () {

        ctx.beginPath();

        if( this.pos.dist2(pointer) < this.rad2 ) {
            ctx.fillStyle   = '#f20';
            ctx.globalAlpha = 0.35;
            pointer.over    = true;
        } else {
            ctx.fillStyle   = this.c;
            ctx.globalAlpha = 0.35;
        }

        ctx.arc(this.pos.x, this.pos.y, this.rad, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = '#777777';
        ctx.globalAlpha = 0.35;

        for ( var j = 0; j < count; j++ ) {
            var that = circles[j];
            if( this.pos.dist2(that.pos) < this.rad2 * 1.44 ) {
                ctx.beginPath();
                ctx.moveTo(this.pos.x, this.pos.y);
                ctx.lineTo(that.pos.x, that.pos.y);
                ctx.stroke();

                if( this.locked && !that.locked ) {
                    that.locked = true;
                    that.parent = this;
                }
            } else if( that.parent != null && that.parent === this ) {
                ctx.beginPath();
                ctx.moveTo(this.pos.x, this.pos.y);
                ctx.lineTo(that.pos.x, that.pos.y);
                ctx.stroke();
            }
        }
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.pos.x - ds, this.pos.y - ds, ds * 2, ds * 2);

    };

    function draw() {

        requestAnimationFrame(draw);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';
        pointer.over                 = false;

        for ( var i = 0; i < count; i++ ) {
            circles[i].update();
            circles[i].render();
        }

        if( dragging ) {
            canvas.setCursor('move');
        } else {
            if( pointer.over ) canvas.setCursor('pointer');
            else canvas.setCursor('default');
        }

        ctx.globalAlpha              = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle                = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

    }

    var ctx = canvas.init();

    canvas.resize = function () {
        maxRad          = Math.round(Math.sqrt(Math.min(this.width, this.height)) * 5);
        var outerRadius = this.width * 0.7;
        var innerRadius = this.height * 0.3;
        grd             = ctx.createRadialGradient(this.width / 2, this.height / 2, innerRadius, this.width / 2, this.height / 2, outerRadius);
        grd.addColorStop(0, 'rgba(0,0,0,0)');
        grd.addColorStop(1, 'rgba(0,0,0,1)');

    };

    canvas.resize();

    var pointer = canvas.pointer();

    pointer.down = function () {
        for ( var i = 0; i < count; i++ ) {
            if( circles[i].pos.dist2(this) < circles[i].rad2 ) {
                circles[i].locked = true;
                circles[i].offset.sub(this, circles[i].pos);
                dragging = true;
                break;
            }
        }

    };

    pointer.up = function () {
        for ( var i = 0; i < count; i++ ) {
            circles[i].offset.set(0, 0);
            circles[i].locked = false;
            circles[i].parent = null; // Clear parent
        }
        dragging = false;

    };

    for ( var i = 0; i < count; i++ ) {
        circles[i] = new Circle();
    }

    draw();

}();